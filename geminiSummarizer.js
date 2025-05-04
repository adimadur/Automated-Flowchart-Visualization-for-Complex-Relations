const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

async function summarizeWithGemini(text) {
    try {
        const prompt = `
        Summarize the following content, focusing on historical aspects.
        Provide a valid JSON output without markdown formatting.
        The response **must** include "mind_map_nodes" with structured subtopics.

        Output format:
        {
            "name": "Person's Name",
            "birth": "Birth details",
            "major_events": ["Event1", "Event2"],
            "achievements": ["Achievement1", "Achievement2"],
            "legacy": "Brief legacy",
            "historical_summary":"Brief Historical summary in detail (500 words)"
            "mind_map_nodes": {
                "Main Topic": { "Subtopic1": ["Detail1", "Detail2"], "Subtopic2": ["Detail3"] }
            }
        }
        Ensure "mind_map_nodes" is always present.

        Content: ${text}
        `;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        let rawResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        // console.log("🔹 RAW RESPONSE FROM GEMINI:", rawResponse);

        if (!rawResponse) {
            throw new Error("Empty response from Gemini API");
        }

        if (rawResponse.startsWith("```json")) {
            rawResponse = rawResponse.replace(/```json/, "").replace(/```/, "").trim();
        }

        let parsedData;
        try {
            parsedData = JSON.parse(rawResponse);
        } catch (parseError) {
            console.error("❌ JSON Parsing Error:", parseError);
            return { error: "Failed to parse JSON from Gemini API" };
        }

        if (!parsedData.mind_map_nodes) {
            parsedData.mind_map_nodes = { "Main Topic": {} }; // Ensure mind map exists
        }

        console.log("✅ Parsed JSON:", parsedData);
        
        return parsedData;
    } catch (error) {
        console.error("❌ Gemini API Error:", error.response?.data || error.message);
        return { error: "Summarization failed due to an error." };
    }
}

module.exports = { summarizeWithGemini };
