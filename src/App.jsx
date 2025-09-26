import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://sentiment-api-ty4j.onrender.com/predict_sentiment"; 

function App() {
  const [inputText, setInputText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSentiment = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze.');
      setSentiment(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSentiment(null);

    try {
      const payload = { text: inputText };

      // The POST request expects JSON data
      console.log("Sending payload:", payload);
      console.log("API URL:", API_URL);
      const response = await axios.post(API_URL, payload);

      // Assuming your API returns { "sentiment": "Positive" }
      setSentiment(response.data.sentiment);

    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to connect to the sentiment API. Check the URL or console.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'black';
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment === 'positive') return 'green';
    if (lowerSentiment === 'negative') return 'red';
    return 'gray'; // Neutral or other
  };

  return (
    <div className="analyzer-container">
      <h1>Sentiment Analyzer</h1>
      <p>Powered by FastAPI & Your ML Model on Render</p>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your text here..."
        rows="5"
        disabled={loading}
      />

      <button 
        onClick={analyzeSentiment} 
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Text'}
      </button>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      {sentiment && (
        <div className="result-box">
          <h2>Result:</h2>
          <p style={{ color: getSentimentColor(sentiment), fontWeight: 'bold' }}>
            {sentiment}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;