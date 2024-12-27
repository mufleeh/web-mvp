require("dotenv").config();

const express = require("express"); // Import express
const cors = require("cors"); // Import CORS for cross-origin requests
const path = require("path");
const { Sequelize, QueryTypes } = require("sequelize"); // Import Sequelize for DB connection
const OpenAI = require("openai");
const fs = require("fs");

const app = express(); // Initialize the app
const logger = require("./logger");

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Database connection setup
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql", // Adjust for your DB type (e.g., postgres, sqlite, etc.)
    }
);

// Test the database connection
sequelize
    .authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to database:", err));

// Serve static files from the 'images' directory
app.use("/images", express.static(path.join(__dirname, "images")));

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your .env file contains this key
});

// Fine-Tuning: Upload Dataset
app.post("/api/fine-tune/upload", async (req, res) => {
    try {
        const response = await openai.files.create({
            file: fs.createReadStream("validated_dataset.jsonl"),
            purpose: "fine-tune",
        });
        res.json({ fileId: response.id });
    } catch (error) {
        console.error("Error uploading dataset:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to upload dataset" });
    }
});

// Fine-Tuning: Start Process
app.post("/api/fine-tune/start", async (req, res) => {
    const { fileId } = req.body;
    try {
        const response = await openai.fineTuning.jobs.create({
            training_file: fileId,
            model: "gpt-3.5-turbo",
        });
        res.json({ fineTuneId: response.id });
    } catch (error) {
        console.error("Error starting fine-tune:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to start fine-tuning" });
    }
});

// Fine-Tuning: Check Status
app.get("/api/fine-tune/status/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await openai.fineTuning.jobs.retrieve(id);
        res.json(response);
    } catch (error) {
        console.error("Error checking fine-tune status:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to check fine-tune status" });
    }
});

// Fine-Tuning: Generate Completion
app.post("/api/fine-tune/generate", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo:your-fine-tuned-model-id", // Replace with your fine-tuned model ID
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
        });
        res.json({ completion: response.choices[0].message.content });
    } catch (error) {
        console.error("Error generating completion:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate completion" });
    }
});

// API endpoint for fetching products
app.get("/api/products", async (req, res) => {
    const { q = "", category = "" } = req.query;

    try {
        const query = `
            SELECT id, name, description, price, image_url, category
            FROM products
            WHERE
                (:query = '' OR (name LIKE :query OR description LIKE :query OR category LIKE :query))
                AND (:category = '' OR category = :category)
        `;

        const products = await sequelize.query(query, {
            replacements: { query: `%${q}%`, category },
            type: QueryTypes.SELECT,
        });

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products." });
    }
});



// API endpoint for AI assistant


app.post("/api/ai-assistant", async (req, res) => {
    const userInput = req.body.query;

    try {
        // Step 1: Generate SQL query using ChatGPT
        const aiResponse = await openai.chat.completions.create({
            model: "ft:gpt-3.5-turbo-0125:personal::AiUec3ix",
            messages: [
                { role: "system", content: "You are an SQL assistant." },
                { role: "user", content: userInput }
            ],
            max_tokens: 150
        });

        const sqlQuery = aiResponse.data.choices[0].message.content.trim();
        console.log("Generated SQL Query:", sqlQuery);

        // Step 2: Execute the SQL query
        const results = await sequelize.query(sqlQuery, { type: QueryTypes.SELECT });
        console.log("Query Results:", results);

        // Step 3: Return the results to the frontend
        res.json({ results });
    } catch (error) {
        console.error("Error processing AI request:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to process query." });
    }
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
