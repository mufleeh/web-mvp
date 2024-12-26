const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

(async () => {
    try {
        const models = await openai.listModels();
        console.log("Available models:", models.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
})();
