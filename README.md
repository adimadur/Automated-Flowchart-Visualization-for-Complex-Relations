# Summarize AI

Automated flowchart and mind map generator for historical topics, using NLP summarization and Graphviz visualization.

## Features
- 🔍 Automated data scraping from the web
- 📄 AI-powered summarization (Python, Sumy, NLTK)
- 🗺️ Mind map generation using Graphviz
- 🖼️ PNG mind map images served via Node.js backend
- 🌐 Simple web UI (EJS, CSS, JS)

## Tech Stack
- Node.js, Express.js (backend API & web server)
- Python (NLP summarization)
- Sumy, NLTK (Python libraries)
- Graphviz (mind map rendering)
- EJS (templating), CSS, JavaScript (frontend)
- Docker (deployment)

## Setup (Local)

1. **Install dependencies:**
   - Node.js (v18+ recommended)
   - Python 3.7+
   - [Graphviz](https://graphviz.gitlab.io/download/)

2. **Install Node.js dependencies:**
   ```sh
   npm install
   ```

3. **Install Python dependencies:**
   ```sh
   pip install -r python/requirements.txt
   ```

4. **Set up environment variables:**
   - Copy `.example.env` to `.env` and fill in your API keys.

5. **Run the server:**
   ```sh
   npm start
   ```

6. **Visit:**
   - [http://localhost:5000](http://localhost:5000)

## Setup (Docker)

1. **Build the Docker image:**
   ```sh
   docker build -t summarize-ai .
   ```
2. **Run the container:**
   ```sh
   docker run -p 5000:5000 --env-file .env summarize-ai
   ```

## Environment Variables
See `.example.env` for all required variables:
- `GEMINI_API_KEY` - Google Gemini API key
- `SERPAPI_KEY` - SerpAPI key for scraping
- `PORT` - (optional) server port

## Usage
- Search for a historical figure or topic.
- The app scrapes, summarizes, and generates a mind map image.
- Results are shown in the web UI.

---

**Team:**
- Aditya Madur, Bhagyesh Gavhale, Priti Jadhav, Madhuri Patil

**License:**

This project is proprietary and is not licensed for use, modification, or distribution.

It is publicly visible for demonstration purposes only.

Please contact adityamadur735@gmail.com for any questions.
