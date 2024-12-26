const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

(async () => {
    try {
        const response = await axios.get("https://api.openai.com/v1/files", {
            headers: { Authorization: `Bearer ${apiKey}` },
        });

        const files = response.data.data;
        console.log(`Found ${files.length} files.`);

        for (const file of files) {
            console.log(`Deleting file: ${file.id}`);
            await axios.delete(`https://api.openai.com/v1/files/${file.id}`, {
                headers: { Authorization: `Bearer ${apiKey}` },
            });
        }

        console.log("All files deleted successfully.");
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
})();
