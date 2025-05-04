const express = require("express");
const { getScrapedContent } = require("./scraper");
const { summarizeWithGemini } = require("./geminiSummarizer");
const { generateMindMap } = require("./mindMapGenerator");

const router = express.Router();

// 🔹 API Endpoint for Summarization (POST)
router.post("/summarize", async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: "Missing keyword" });

    try {
        console.log(`🔍 Scraping for: ${keyword}`);
        const { content, links } = await getScrapedContent(keyword);
        if (!content) return res.status(500).json({ error: "No relevant data found" });

        console.log("🔹 Sending to Gemini...");
        const summaryData = await summarizeWithGemini(content);

        if (!summaryData || !summaryData.historical_summary) {
            return res.status(500).json({ error: "Missing summary data in response" });
        }

        res.send({ summary: summaryData.historical_summary, links });
    } catch (error) {
        console.error("❌ Summarization Error:", error);
        res.status(500).json({ error: "Summarization failed" });
    }
});

// 🔹 API Endpoint for Mind Map Generation (POST)
router.post("/generateMindMap", async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: "Missing keyword" });

    try {
        console.log(`🧠 Generating mind map for: ${keyword}`);
        
        const { content, links } = await getScrapedContent(keyword);
        const summary = await summarizeWithGemini(content);

        if (!summary || !summary.mind_map_nodes) {
            return res.status(500).json({ error: "Missing summary data" });
        }

        const imageBuffer = await generateMindMap(summary);
        res.set("Content-Type", "image/png").send(imageBuffer);
    } catch (error) {
        console.error("❌ Mind Map Error:", error);
        res.status(500).json({ error: "Mind map generation failed" });
    }
});

// ✅ NEW: API Endpoint to Fetch Summary & Mind Map (GET)
router.get("/getSummaryAndMindMap", async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: "Missing keyword" });

    try {
        console.log(`📝 Fetching stored summary & mind map for: ${keyword}`);

        const { content, links } = await getScrapedContent(keyword);
        const summary = await summarizeWithGemini(content);
        
        const imageBuffer = await generateMindMap(summary);
        const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
        
        res.json({
            summary: summary,
            mindMapImage: imageBase64,
            links
        });

    } catch (error) {
        console.error("❌ Error fetching summary/mind map:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.get("/about-project", (req, res) => {
    res.render("aboutProject");
});

router.get("/about-us", (req, res) => {
    res.render("aboutUs");
});

module.exports = router;
