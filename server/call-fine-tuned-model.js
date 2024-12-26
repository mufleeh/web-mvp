const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.OPENAI_API_KEY;
const FINE_TUNED_MODEL = "ft:gpt-3.5-turbo-0125:personal::AiUec3ix";

async function callFineTunedModel() {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const requestData = {
        model: FINE_TUNED_MODEL,
        messages: [
            { role: "system", content: "You are an SQL assistant." },
            { role: "user", content: "Show me all products under $50." }
        ],
        max_tokens: 150
    };

    try {
        const response = await axios.post(endpoint, requestData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`
            }
        });

        console.log("Response from fine-tuned model:");
        console.log(JSON.stringify(response.data, null, 2)); // Pretty-print the full response
    } catch (error) {
        console.error("Error calling fine-tuned model:");
        console.error(error.response?.data || error.message);
    }
}

callFineTunedModel();
