const express = require("express");
const router = express.Router();
const { processEmails } = require("../services/emailService");

router.post("/", async (req, res) => {
  try {
    const result = await processEmails();
    res.json({ ok: true, processedCount: result.filter(e => e.processed).length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

module.exports = router;
