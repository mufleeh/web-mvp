const fs = require("fs");

const inputFile = "chat_formatted_dataset.jsonl";
const outputFile = "validated_dataset.jsonl";

function validateAndReformatDataset() {
    try {
        const inputLines = fs.readFileSync(inputFile, "utf-8").trim().split("\n");
        const validEntries = [];

        inputLines.forEach((line, index) => {
            try {
                const jsonData = JSON.parse(line); // Validate JSON format
                if (jsonData.messages && Array.isArray(jsonData.messages)) {
                    validEntries.push(JSON.stringify(jsonData)); // Reformat and collect valid entries
                } else {
                    console.error(`Line ${index + 1}: Missing or invalid 'messages' key.`);
                }
            } catch (error) {
                console.error(`Line ${index + 1}: Invalid JSON - ${error.message}`);
            }
        });

        // Write valid entries to the output file
        fs.writeFileSync(outputFile, validEntries.join("\n"), "utf-8");
        console.log(`Dataset validation complete. Validated dataset saved to ${outputFile}`);
    } catch (error) {
        console.error("Error processing the dataset:", error.message);
    }
}

validateAndReformatDataset();
