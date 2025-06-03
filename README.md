# Estate Item Analyzer Demo

This project contains a simple web interface and a Netlify Function for analyzing estate sale items with OpenAI. The function expects an uploaded image and optional prompt, then returns a structured JSON response with details like estimated value and condition.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   If you don't have the Netlify CLI installed globally, add it as well:
   ```bash
   npm install -g netlify-cli
   ```

2. **Configure OpenAI**
   Set your OpenAI API key in the environment before running the function:
   ```bash
   export OPENAI_API_KEY=sk-yourkey
   ```
   You can also place this in a `.env` file if you prefer.

## Running locally

Use the Netlify CLI to serve the function:
```bash
netlify functions:serve
```
This will start the `analyze` function from `netlify/functions/` and expose it on a local URL. You can invoke the endpoint by sending a POST request with an `imageBase64` field and optional `prompt`.

For a full local dev server (serving `index.html` as well), you can run:
```bash
netlify dev
```

## Project Structure

- `index.html` – Demo page that uploads images and calls the Netlify Function.
- `netlify/functions/analyze.js` – Serverless function that calls OpenAI's API.
- `package.json` – Minimal dependencies (only `openai`).

Feel free to modify the code or styling to fit your needs. This repo is meant as a small demonstration of using OpenAI inside a Netlify Function.
