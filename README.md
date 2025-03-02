# DSA Teaching Assistant Chat Application

A chat-based application built for the Software Engineering Intern Assignment to assist users with Data Structures and Algorithms (DSA) problems using Google’s Gemini 1.5 Flash model. This project, housed in `dsa-teaching-assistant1`, delivers a modern, interactive experience with progressive guidance tailored to foster independent problem-solving.

## Setup Instructions

### Prerequisites
- **Node.js**: Version 16 or higher ([download](https://nodejs.org/)).
- **npm**: Included with Node.js.
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://ai.google.dev).

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <(https://github.com/AyushMaurya1/dsa-teaching-assistant1)>
   cd dsa-teaching-assistant1
   ```

2. **Install Frontend Dependencies**:
   Navigate to the client directory:
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**:
   Navigate to the server directory:
   ```bash
   cd ../server
   npm install
   ```

4. **Configure API Key**:
   Create a file named `.env` in the `server` directory with:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```

5. **Start the Application**:
   - Start the backend (from `server/`):
     ```bash
     npm start
     ```
     Runs on http://localhost:5000.
   
   - Start the frontend (from `client/`):
     ```bash
     npm start
     ```
     Opens at http://localhost:3000 in your browser.

## Dependencies

### Frontend (client):
- `react`, `react-dom`: Core React libraries for UI rendering.
- `react-scripts`: Build tools for development and production.

### Backend (server):
- `express`: Web framework for API endpoints.
- `cors`: Enables cross-origin requests from the frontend.
- `@google/generative-ai`: SDK for Gemini API integration.
- `dotenv`: Loads environment variables from `.env`.

## Architecture

### Frontend (client):
- Built with React, providing a sleek, modern chat interface.
- Features include:
  - Separate input fields for LeetCode URL and questions.
  - URL validation (`https://leetcode.com/problems/*`).
  - Persistent URL storage for follow-ups.
  - Rich chat display with avatars, timestamps, and message copying.
- Communicates with the backend via POST requests to `/api/ask`.

### Backend (server):
- Built with Node.js and Express.
- Handles API requests and integrates with the Gemini API.
- Maintains an in-memory store (`lastUrl` and `questionCountPerUrl`) for progressive hinting.
- Uses `dotenv` to securely manage API keys.

### Data Flow:
1. The client sends a JSON payload `{ url, question }` to the server.
2. The server processes the request, queries Gemini with a tailored prompt, and returns a JSON response `{ reply }`.
3. The client renders the reply in the chat interface.

## Usage Guidelines

1. **Launch the Application**:
   - Start the backend:
     ```bash
     cd server && npm start
     ```
   - Start the frontend:
     ```bash
     cd client && npm start
     ```
   - Open http://localhost:3000 in your browser.

2. **Submit an Initial Question**:
   - Enter a valid LeetCode URL (e.g., `https://leetcode.com/problems/two-sum/`).
   - Type your question (e.g., “How do I optimize this?”).
   - Click the “Send” button or press Enter.

3. **Ask Follow-Up Questions**:
   - Leave the URL field blank to reuse the last URL.
   - Enter a new question and submit.

## Key Features

- **URL Validation**: Only accepts `https://leetcode.com/problems/*` URLs.
- **Persistent URL**: Stores the last URL for follow-ups.
- **Progressive Hints**: Guidance escalates with each question.
- **Chat Enhancements**: Avatars, timestamps, copy-to-clipboard, and typing indicator.

## Gemini Integration

### Model
- Uses `gemini-1.5-flash`, a fast model from Google, via the `@google/generative-ai` SDK.

### API Key Management
- Securely stored in `server/.env`.

### Prompt Design
```text
You’re a DSA Teaching Assistant who turns puzzles into adventures! The user’s tackling this LeetCode challenge: "<url>". Their question is: "<question>". Don’t spoil the treasure—no direct solutions or code! Instead:
- Ask 1-2 razor-sharp questions.
- Weave a vivid analogy.
- Provide hints tailored to progress.
  - 1st: Broad hints.
  - 2nd: Subtle data structure hints.
  - 3rd+: Specific hints (no code).
  - Code requests: Refusal with encouragement.
Craft a punchy, spirited reply (max 200 words).
```

### Integration Mechanism
- The server tracks questions per URL.
- Hints escalate with each question.
- Gemini returns text responses, which the server sends as `{ reply }`.

### Example Interaction
```text
Read PROMPTS.md
```

