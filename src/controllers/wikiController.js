const express = require("express");
const verify = require("../models/shared/verify-token");
const router = express.Router();

const Wiki = require("../models/shared/event-wikis-schema");
const WikiComment = require("../models/comments");

router.get("/wikis/all-event-wikis/:eventId", async (req, res) => {
  if (!req.params.eventId) res.status(400).send("Event id was not provided");

  try {
    const response = await Wiki.find({ _eventId: req.params.eventId });

    res.json({
      success: true,
      message: "Operation successful",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

router.get("/wikis/all-users-wikis", verify, async (req, res) => {
  try {
    const response = await Wiki.find({ user: req.user._id });
    res.json({
      success: true,
      message: "Operation successful",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

router.get("/wikis/comments/:id", async (req, res) => {
  if (!req.params.id) res.status(400).send("Wiki id was not provided");

  try {
    const response = await WikiComment.find({ wikiId: req.params.id });
    res.json({
      success: true,
      message: "Operation successful",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

router.post("/wikis", verify, async (req, res) => {
  let body = req.body;

  if (!body.eventId || !body.messge)
    res.status(400).send("Body does not contain required data");

  body.user = req.user._id;

  try {
    const newWiki = new Wiki(body);
    const response = await newWiki.save();
    res.status(201).json({
      success: true,
      message: "Wiki posted successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("There was a problem posting wiki");
  }
});

router.post("/wikis/add-comment/:wikisId", verify, async (req, res) => {
  if (!req.params.wikisId || !req.body)
    res.status(400).send("Wikis Id was not provided");

  const message = req.body;
  const user = req.user._id;

  const comment = new WikiComment({
    user: user,
    message: message,
    wikiId: req.params.wikisId,
  });

  try {
    const response = await comment.save();
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("There was a problem adding comment");
  }
});

router.delete("/wikis/:id", verify, async (req, res) => {
  if (!req.params.id) res.status(400).send("Wiki Id was not provided");

  try {
    const selectedWiki = await Wiki.findById({ _id: req.params.id });

    if (!selectedWiki)
      res.status(404).send("There is no wiki with provided id");
    if (selectedWiki.user !== req.user._id) res.status(400).send("Bad request");

    const commentsResponse = await WikiComment.find({ wikiId: req.params.id });

    if (!commentsResponse)
      res.status(400).send("This wiki has comments and cannot be deleted");

    const response = await Wiki.findByIdAndRemove({ _id: req.params.id });

    res.json({
      success: true,
      message: "",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("There was a problem deleting the wiki");
  }
});

module.exports = router;
