const express = require("express");
const router = express.Router();
const { generateDraft, loadDrafts, saveDrafts, createCustomDraft } = require("../services/draftService");

// Create Draft from email
router.post("/create", async (req, res) => {
  const { emailId } = req.body;
  if (!emailId) return res.status(400).json({ error: "emailId required" });

  try {
    const draft = await generateDraft(emailId);
    res.json(draft);
  } catch (error) {
    console.error("Draft generation failed:", error);
    res.status(500).json({ error: "Draft generation failed" });
  }
});

// Create Custom Draft (Blank)
router.post("/custom", async (req, res) => {
  try {
    const newDraft = await createCustomDraft();
    res.json(newDraft);
  } catch (err) {
    console.error("Custom draft creation failed:", err);
    res.status(500).json({ error: "Unable to create custom draft" });
  }
});

// Update Draft
router.post("/update", (req, res) => {
  const { id, subject, body } = req.body;
  if (!id) return res.status(400).json({ error: "Draft id required" });

  const drafts = loadDrafts();
  const index = drafts.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).json({ error: "Draft not found" });

  drafts[index].subject = subject;
  drafts[index].body = body;
  drafts[index].updatedAt = new Date().toISOString();

  saveDrafts(drafts);
  res.json({ ok: true, message: "Draft updated", draft: drafts[index] });
});

// Delete Draft
router.delete("/:id", (req, res) => {
  const drafts = loadDrafts();
  const newDrafts = drafts.filter(d => d.id !== req.params.id);

  if (drafts.length === newDrafts.length) return res.status(404).json({ error: "Draft not found" });

  saveDrafts(newDrafts);
  res.json({ ok: true, message: "Draft deleted" });
});

// Get All Drafts
router.get("/", (req, res) => {
  res.json(loadDrafts());
});

module.exports = router;
