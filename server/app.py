
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from anthropic import Anthropic
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
client = Anthropic()

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), default="New Conversation")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    messages = db.relationship("Message", backref="conversation", lazy=True, cascade="all, delete-orphan")

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey("conversation.id"), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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

@app.route("/api/conversations", methods=["GET"])
def get_conversations():
    conversations = Conversation.query.order_by(Conversation.created_at.desc()).all()
    return jsonify([{"id": c.id, "title": c.title, "created_at": c.created_at.isoformat()} for c in conversations])

@app.route("/api/conversations", methods=["POST"])
def create_conversation():
    conv = Conversation(title="New Conversation")
    db.session.add(conv)
    db.session.commit()
    return jsonify({"id": conv.id, "title": conv.title})

@app.route("/api/conversations/<int:conv_id>", methods=["DELETE"])
def delete_conversation(conv_id):
    conv = Conversation.query.get_or_404(conv_id)
    db.session.delete(conv)
    db.session.commit()
    return jsonify({"success": True})

@app.route("/api/conversations/<int:conv_id>/messages", methods=["GET"])
def get_messages(conv_id):
    messages = Message.query.filter_by(conversation_id=conv_id).order_by(Message.created_at).all()
    return jsonify([{"role": m.role, "content": m.content} for m in messages])

@app.route("/api/conversations/<int:conv_id>/chat", methods=["POST"])
def chat(conv_id):
    conv = Conversation.query.get_or_404(conv_id)
    data = request.json
    user_content = data.get("message")

    user_msg = Message(conversation_id=conv_id, role="user", content=user_content)
    db.session.add(user_msg)

    if len(conv.messages) == 1:
        conv.title = user_content[:60]

    db.session.commit()

    history = [{"role": m.role, "content": m.content} for m in conv.messages]

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=history
    )

    reply = response.content[0].text

    assistant_msg = Message(conversation_id=conv_id, role="assistant", content=reply)
    db.session.add(assistant_msg)
    db.session.commit()

    return jsonify({"reply": reply})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
