from flask import Flask, request, render_template, jsonify
from flask_cors import CORS  # Import the CORS module
import pickle

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)  # This allows your Flask app to accept requests from other origins (like your React app)

# Load pickled files
newses = pickle.load(open('newses.pkl', 'rb'))
new = pickle.load(open('new.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Function to get recommendations for a news item
def recommend_by_index(news_index):
    distances = sorted(list(enumerate(similarity[news_index])), key=lambda x: x[1], reverse=True)
    
    recommendations = []
    for i in distances[1:9]:  # Get top 5 recommendations excluding itself
        temp_df = newses[newses['Unnamed: 0.1'] == new.index[i[0]]]
        if temp_df.empty:
            continue
        
        rec = {
            "title": temp_df['title'].values[0],
            "date": temp_df['date'].values[0] if 'date' in temp_df.columns else "N/A",
            "link": temp_df['link'].values[0]
        }
        recommendations.append(rec)
    
    return recommendations

@app.route('/')
def home():
    # Fill missing values in the summary column with a default text and convert to string
    newses['summary'] = newses['summary'].fillna("No summary available").astype(str)
    
    # Send all news items to the homepage
    all_news = newses[['Unnamed: 0.1', 'title', 'summary']].to_dict(orient='records')
    return render_template('explore.html', all_news=all_news)


@app.route('/news/<int:news_id>')
def news_details(news_id):
    # Fetch details of the selected news item
    selected_news = newses[newses['Unnamed: 0.1'] == news_id].iloc[0]
    recommendations = recommend_by_index(news_id)
    return jsonify({
        "title": selected_news['title'],
        "summary": selected_news['summary'],
        "date": selected_news.get('date', "N/A"),
        "link": selected_news['link'],
        "recommendations": recommendations
    })

@app.route('/search')
def search_news():
    query = request.args.get('q', '').lower()

    # Filter news by matching query in title or summary
    filtered_news = newses[newses['title'].str.lower().str.contains(query, na=False) |
                           newses['summary'].str.lower().str.contains(query, na=False)]
    # Convert the filtered news to a JSON format
    results = filtered_news[['Unnamed: 0.1', 'title', 'summary']].to_dict(orient='records')
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Flask will run on port 5000
