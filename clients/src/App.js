import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I'm your DSA Teaching Assistant. Enter a LeetCode URL and your question to get started.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [lastUrl, setLastUrl] = useState(''); // Store the last submitted URL
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState(''); // For URL validation feedback
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const isValidUrl = (input) => {
    const urlPattern = /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\//i;
    return urlPattern.test(input);
  };

  const handleSend = async () => {
    // Validate URL if provided, or use lastUrl if omitted
    const effectiveUrl = url.trim() || lastUrl;
    if (url.trim() && !isValidUrl(url.trim())) {
      setUrlError('Please enter a valid LeetCode problem URL (e.g., https://leetcode.com/problems/two-sum/)');
      return;
    }
    if (!effectiveUrl) {
      alert('Please provide a LeetCode URL to start.');
      return;
    }
    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }

    setUrlError(''); // Clear any previous error
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'user', text: `URL: ${effectiveUrl}\nQuestion: ${question}`, timestamp };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: effectiveUrl, question }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const assistantMessage = {
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastUrl(effectiveUrl); // Update lastUrl after successful submission
    } catch (error) {
      const errorMessage = {
        sender: 'assistant',
        text: 'Error: Couldn’t process your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setUrl(''); // Clear URL field only
      setQuestion('');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: "Chat cleared! How can I assist you now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLastUrl(''); // Reset lastUrl on clear
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">DSA Bot</div>
        <div className="status">Online</div>
        <button className="clear-btn" onClick={handleClearChat}>
          Clear Chat
        </button>
      </header>
      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="avatar">{msg.sender === 'user' ? 'YOU' : 'BOT'}</div>
            <div className="message-wrapper">
              <div className="message-content">
                {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <span className="timestamp">{msg.timestamp}</span>
              </div>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(msg.text)}
                title="Copy message"
              >
                📋
              </button>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="avatar">BOT</div>
            <div className="message-wrapper">
              <div className="message-content typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="input-container">
        <div className="input-field">
          <input
            type="text"
            placeholder="LeetCode URL (e.g., https://leetcode.com/problems/two-sum/)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className={urlError ? 'error' : ''}
          />
          {urlError && <span className="error-message">{urlError}</span>}
        </div>
        <div className="input-field">
          <textarea
            placeholder={lastUrl ? 'Ask a follow-up question...' : 'Your question about the problem'}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="3"
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading}>
            <span className="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;