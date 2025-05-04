const express = require("express");
// const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routes);

// 🔹 Setup EJS and public folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { data: null, keyword: null });
});

app.get("/search", async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) return res.redirect("/");

    try {
        const response = await fetch(`http://localhost:${process.env.PORT || 5000}/api/getSummaryAndMindMap?keyword=${keyword}`);
        const jsonData = await response.json();
        res.render("index", { data: jsonData, keyword });
    } catch (error) {
        console.error("❌ EJS Page Error:", error);
        res.render("index", { data: null, keyword: keyword, error: "Failed to fetch data." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
