const express = require("express");
const router = express.Router();

const UserMessage = require("../models/user-message");

const validate = require("../models/shared/verify-token");

router.get(
  "/messages/messages-creators-ids/:userId",
  validate,
  async (req, res) => {
    if (!req.params.userId)
      res.status(400).send("The user id was not provided");

    try {
      let ids = [];
      const messagesList = await UserMessage.find({
        toUserId: req.params.userId,
      });

      if (messagesList.length > 0) {
        messagesList.forEach((item) => {
          if (!ids.includes(item.toUserId)) ids.push(item.toUserId);
        });
      }

      res.json({
        success: true,
        message: "Data loaded successfully",
        data: ids,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Problem loading data");
    }
  }
);

router.get("/messages/:userId", validate, async (req, res) => {
  if (!req.params.userId) res.status(400).send("The user id was not provided");

  try {
    const response = await UserMessage.find({ toUserId: req.params.userId });

    res.json({
      success: true,
      message: "Data loaded successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

router.get("/messages/sent-by/:userId", validate, async (req, res) => {
  if (!req.params.userId) res.status(400).send("The user id was not provided");

  try {
    const response = await UserMessage.find({ fromUserId: req.params.userId });

    res.json({
      success: true,
      message: "Data loaded successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

router.get("messages/:fromId/:toId", validate, async (req, res) => {
  if (!req.params.fromId || !req.params.toId)
    res.status(400).send("The ids were not provided");

  try {
    const response = await UserMessage.find({
      fromUserId: req.params.fromId,
      toUserId: req.params.toId,
    });

    res.json({
      success: true,
      message: "Data loaded successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

module.exports = router;
