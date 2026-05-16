const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");
const Interview = require("./chat");
const protect = require("./authMiddleware");
const connectDB = require("./db");
require("dotenv").config();

const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-70b-8192";
const configuredGroqTimeout = Number(process.env.GROQ_TIMEOUT_MS);
const GROQ_TIMEOUT_MS = Number.isFinite(configuredGroqTimeout) ? configuredGroqTimeout : 30000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: GROQ_TIMEOUT_MS,
});

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Diagnostic Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health & Readiness Checks
app.get("/api/interview/health", (req, res) => {
  res.json({ status: "ok", service: "interview-service" });
});

app.get("/api/interview/ready", (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: "not_ready", db: "disconnected" });
  }
  res.json({ status: "ready" });
});

// Fetch all interview results for a user
app.get("/api/interview/results", protect, async (req, res) => {
  try {
    const user = req.email;
    const userInterviews = await Interview.find({ user }).sort({ date: -1 });
    res.json(userInterviews || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate Interview Questions via Groq
app.post("/api/interview/generate", protect, async (req, res) => {
  try {
    const { topic, difficulty = "Intermediate" } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const prompt = `You are a professional technical interviewer for the Scholar's Study platform.
Generate 10 interview questions for the topic: "${topic}" at a "${difficulty}" level.
The questions should be structured, context-aware, and progressive in difficulty.
Return the questions as a JSON object where the keys are sub-topics and values are arrays of questions.

Example Format:
{
  "Core Concepts": ["Question 1", "Question 2"],
  "Advanced Scenarios": ["Question 3"]
}

Return ONLY the JSON object. No extra text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(chatCompletion.choices[0].message.content);
    res.json(response);
  } catch (err) {
    console.error("Groq Generation Error:", err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// Append chat message to interview session
app.post("/api/interview/chat", protect, async (req, res) => {
  const { topic, interviewData } = req.body;
  const user = req.email;
  try {
    const updateOperation = Array.isArray(interviewData)
      ? { $push: { interviewData: { $each: interviewData } } }
      : { $push: { interviewData } };
    
    await Interview.updateOne(
      { user, topic },
      updateOperation,
      { upsert: true }
    );
    res.status(200).json({ message: "Transcript updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update transcript" });
  }
});

// Evaluate the entire interview session
app.post("/api/interview/evaluate", protect, async (req, res) => {
  try {
    const { topic } = req.body;
    const user = req.email;

    const interview = await Interview.findOne({ user, topic }).sort({ date: -1 });
    if (!interview) return res.status(404).json({ error: "Session not found" });

    const transcript = interview.interviewData.map(d => `${d.type.toUpperCase()}: ${d.text}`).join('\n');

    const prompt = `You are an expert mentor on the Scholar's Study platform.
Evaluate the following interview transcript for the topic: "${topic}".
Provide a detailed mentor-style review covering:
1. Technical Correctness
2. Communication Quality
3. Confidence Level
4. Specific Improvement Suggestions
Assign an overall score from 1-10.

Return the evaluation in JSON format:
{
  "overallScore": 8,
  "overallReview": "Paragraph summary...",
  "mentorComments": [
    { "aspect": "Technical", "comment": "...", "score": 8 },
    { "aspect": "Communication", "comment": "...", "score": 9 }
  ],
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."]
}

Transcript:
${transcript}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: "json_object" }
    });

    const evaluation = JSON.parse(chatCompletion.choices[0].message.content);
    interview.evaluation = evaluation;
    await interview.save();

    res.json(evaluation);
  } catch (err) {
    console.error("Groq Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate session" });
  }
});

const PORT = process.env.PORT || 5002;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Interview Service running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to start Interview Service:", err);
  process.exit(1);
});
