const express = require("express");
const router = express.Router();
const { handleAgentQuery } = require("../services/agentService");

router.post("/query", async (req, res) => {
  const { emailId, userQuery } = req.body || {};
  if (!emailId || !userQuery) {
    return res.status(400).json({ error: "emailId and userQuery required" });
  }

  try {
    const result = await handleAgentQuery(emailId, userQuery);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Query handling failed" });
  }
});

module.exports = router;
