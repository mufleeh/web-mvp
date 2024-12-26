const openai = require("../config/openai");
const fs = require("fs");

exports.uploadDataset = async (req, res) => {
  try {
    const response = await openai.createFile(
      fs.createReadStream("fine-tuning/shopping_assistant_dataset.jsonl"),
      "fine-tune"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

exports.startFineTune = async (req, res) => {
  const { fileId } = req.body;
  try {
    const response = await openai.createFineTune({
      training_file: fileId,
      model: "gpt-3.5-turbo",
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

exports.checkFineTuneStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await openai.retrieveFineTune(id);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

exports.generateCompletion = async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.createCompletion({
      model: "ft-gpt-3.5-turbo:your-fine-tuned-model-id", // Replace with your model ID
      prompt: prompt,
      max_tokens: 150,
    });
    res.json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
