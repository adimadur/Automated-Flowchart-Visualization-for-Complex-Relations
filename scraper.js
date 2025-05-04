const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;

// 🔹 Fetch Google search results using SerpAPI
async function getSearchResults(query, numResults = 3) {
    try {
        console.log(`🔍 Searching Google for: ${query}`);
        const response = await axios.get("https://serpapi.com/search", {
            params: {
                q: query,
                api_key: SERPAPI_KEY,
                num: numResults,
                hl: "en"
            }
        });

        const results = response?.data?.organic_results;

        if (!Array.isArray(results)) {
            console.error("⚠️ No organic_results found in SerpAPI response:", response.data);
            return { links: [] };
        }

        const links = results.map(result => result.link).filter(Boolean).slice(0, numResults);
        return { links };
    } catch (error) {
        console.error("❌ Error fetching search results:", error.response?.data || error.message);
        return { links: [] }; 
    }
}

// 🔹 Scrape content from a webpage
async function scrapeArticle(url) {
    try {
        const response = await axios.get(url, { timeout: 10000 }); // Add timeout for safety
        const $ = cheerio.load(response.data);
        let articleText = $("p, h1, h2, h3").text().replace(/\s+/g, " ").trim();
        return articleText.substring(0, 50000);
    } catch (error) {
        console.error(`⚠ Error scraping ${url}:`, error.message);
        return "";
    }
}

// 🔹 Get Content from Multiple Sources
async function getScrapedContent(keyword) {
    const { links } = await getSearchResults(keyword, 3);
    let fullText = "";

    if (!links.length) {
        console.warn("⚠ No links returned from getSearchResults");
        return { content: "", links: [] };
    }

    for (const url of links) {
        console.log(`✅ Fetching: ${url}`);
        const articleText = await scrapeArticle(url);
        fullText += articleText + "\n\n";
    }

    return { content: fullText.trim(), links };
}

module.exports = { getScrapedContent };
