const express = require("express");
const { uploadDataset, startFineTune, checkFineTuneStatus, generateCompletion } = require("../controllers/fineTuneController");
const router = express.Router();

router.post("/upload", uploadDataset);
router.post("/start", startFineTune);
router.get("/status/:id", checkFineTuneStatus);
router.post("/generate", generateCompletion);

module.exports = router;