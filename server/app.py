from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
client = Anthropic()

SYSTEM_PROMPT = """You are an Islamic scholar assistant with deep knowledge 
of the Quran, Hadith, and classical Islamic scholarship.

Rules:
- Always cite Quran (Surah:Ayah) and Hadith (collection + number) when relevant
- Mention when scholars differ on an issue
- Note madhab differences (Hanafi, Maliki, Shafi'i, Hanbali) when relevant
- Never give fatwas — recommend consulting a qualified scholar for personal rulings
- Use appropriate Islamic phrases (ﷺ after the Prophet's name, رضي الله عنه for companions)
- If unsure about something, say so — never fabricate citations
- Be respectful, clear, and educational"""

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=messages
    )

    return jsonify({"reply": response.content[0].text})

if __name__ == "__main__":
    app.run(debug=True, port=5000)