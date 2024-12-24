require("dotenv").config();

const express = require("express"); // Import express
const cors = require("cors"); // Import CORS for cross-origin requests
const path = require("path");
const { Sequelize, QueryTypes } = require("sequelize"); // Import Sequelize for DB connection
const axios = require("axios");

const app = express(); // Initialize the app

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

// API endpoint for fetching products
app.get("/api/products", async (req, res) => {
    const { q = "", price = null } = req.query;

    try {
        // Query the database to fetch products based on filters
        const query = `
            SELECT * FROM products
            WHERE 
                (name LIKE :query OR description LIKE :query OR category LIKE :query)
                ${price ? "AND price <= :price" : ""}
        `;

        const products = await sequelize.query(query, {
            replacements: { query: `%${q}%`, price: price ? parseFloat(price) : null },
            type: QueryTypes.SELECT,
        });

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// API endpoint for AI assistant
app.post("/api/ai-assistant", async (req, res) => {
    const userInput = req.body.query;
    console.log("Received Query:", userInput); // Log the query received from frontend

    try {
        // OpenAI API Call
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an e-commerce assistant. When given a query, identify and extract the product category (e.g., 'electronics', 'fashion'), specific product name (e.g., 'smartphones', 'headphones'), and any price range mentioned. Respond in a JSON format like this: {\"category\": \"electronics\", \"product\": \"smartphones\", \"price\": \"100\"}. If a specific attribute is not mentioned, leave it empty."
                    },
                    { role: "user", content: userInput }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        console.log("OpenAI API Response:", response.data); // Log the API response

        const aiResponse = response.data.choices[0].message.content;

        try {
            // Parse the AI response as JSON
            const extractedData = JSON.parse(aiResponse);

            res.json({
                response: aiResponse, // Full AI response
                searchParams: {
                    category: extractedData.category || "",
                    product: extractedData.product || "",
                    price: extractedData.price || ""
                }
            });
        } catch (error) {
            console.error("Error parsing AI response:", error);
            res.status(500).json({ error: "Failed to process AI response" });
        }
    } catch (error) {
        console.error("Error with OpenAI API:", error.response?.data || error.message); // Log the exact error
        res.status(500).json({ error: "Failed to process AI request" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
