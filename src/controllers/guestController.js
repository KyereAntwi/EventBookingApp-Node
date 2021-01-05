const express = require("express");
const verify = require("../models/shared/verify-token");
const { isFileImage } = require("../models/shared/validation-schema");

const router = express.Router();

const Guest = require("../models/guest");
const Event = require("../models/event");

router.get("/guests/:eventId", async (req, res) => {
  if (!req.params.eventId) res.status(400).send("Event Id was not provided");

  try {
    const guestList = await Guest.find({ eventId: req.params.eventId });
    res.json({
      success: true,
      message: "Operation successful",
      data: guestList,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem loading data");
  }
});

router.post("/guests", verify, async (req, res) => {
  const body = req.body;
  let image = req.files ? req.files.file : null;

  if (image) {
    const { isImage, name } = isFileImage(image);
    if (!isImage)
      res
        .status(400)
        .send("Image uploaded should be an image with extension jpeg or png");

    body.imageUrl = name;
  }

  const newGuest = new Guest(body);

  try {
    const selectedEvent = await Event.findById({ _id: newGuest.eventId });

    if (!selectedEvent) res.status(404).send("Event does not exist");

    const response = await newGuest.save();
    res.status(201).json({
      success: true,
      message: "Guest created successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem adding guest");
  }
});

router.delete("/guests/:id", verify, async (req, res) => {
  if (!req.params.id) res.status(400).send("Guest Id was not provided");

  try {
    const selectedGuest = await Guest.findById({ _id: req.params.id });

    if (!selectedGuest) res.status(404).send("Guest does not exist");

    const respone = await Guest.findByIdAndRemove({ _id: selectedGuest._id });
    res.json({
      success: true,
      message: "Guest removed successfully",
      data: respone,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Problem removing guest");
  }
});

router.put("/guests/:id", verify, async (req, res) => {
  if (!req.params.id) res.status(400).send("Guest id was not provided");

  if (image) {
    const { isImage, name } = isFileImage(image);
    if (!isImage)
      res
        .status(400)
        .send("Image uploaded should be an image with extension jpeg or png");

    req.body.imageUrl = name;
  }

  try {
    const selectedGuest = await Guest.findById({ _id: req.params.id });

    if (!selectedGuest) res.status(404).send("Guest does not exist");

    const respone = await Guest.findByIdAndUpdate(
      { _id: selectedGuest._id },
      req.body
    );
    res.json({
      success: true,
      message: "Guest removed successfully",
      data: respone,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Guest update failed");
  }
});

module.exports = router;
