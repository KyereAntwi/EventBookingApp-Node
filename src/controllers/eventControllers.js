const express = require("express");
const verify = require("../models/shared/verify-token");
const { isFileImage } = require("../models/shared/validation-schema");

const router = express.Router();

const Event = require("../models/event");
const User = require("../models/user");

router.get("/events", async (req, res) => {
  let list = [];

  try {
    if (req.query.lng !== null && req.query.lat !== null) {
      list = await Event.geoSearch(
        {
          type: "Point",
          coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
        },
        { maxDistance: 100000, spherical: true }
      );
    } else if (req.query.orgkey !== null) {
      list = await Event.find({ organizerId: req.query.orgkey });
    } else if (req.query.keyword !== null) {
      // perform a query to query event with keyword in theme, description or locality
      list = await Event.find({});
    } else {
      list = await Event.find({});
    }

    res.json({
      success: true,
      message: "Operation successful",
      data: list,
    });
  } catch (error) {
    res.status(500).send("There was an error");
  }
});

router.get("/events/:id", async (req, res) => {
  if (!req.params.id) res.status(400).send("Event id was no provided");

  try {
    let event = await Event.findById(req.params.id);

    if (!event)
      res.status(404).json({
        success: false,
        message: "Operation failed",
        data: null,
      });

    res.json({
      success: true,
      message: "Operation successful",
      data: event,
    });
  } catch (error) {
    res.status(500).send("There was a problem loading event");
  }
});

router.post("/events", verify, async (req, res) => {
  const body = req.body;

  if (!body) res.status(400).send("Bad request");

  const newEvent = new Event(body);

  try {
    const response = await newEvent.save();
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong creating event");
  }
});

router.delete("/events/:id", verify, async (req, res) => {
  if (!req.params.id) res.status(404).send("Did not provide event id");

  try {
    const event = await Event.findById({ _id: req.params.id });

    if (!event)
      res.status(404).json({
        success: false,
        message: "There was no event found with such id",
        data: null,
      });

    await Event.findByIdAndRemove({ _id: req.params.id });
    res.json({
      success: true,
      message: "Event deleted successfully",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong deleting the event");
  }
});

router.put("/events/mark-done/:id", verify, async (req, res) => {
  if (!req.params.id) res.status(400).send("Event id was not provided");

  try {
    const selectedEvent = await Event.findById({ _id: req.params.id });

    if (!selectedEvent) res.status(404).send("Selected event does not exist");

    selectedEvent.done = true;
    await Event.findOneAndUpdate({ _id: req.params.id }, selectedEvent);
    res.json({
      success: true,
      message: "Event update was successful",
      data: selectedEvent,
    });
  } catch (error) {
    console.log(error.message);
    req.status(500).send("There was a problem trying to update event status");
  }
});

router.put("/events/update-banner/:id", verify, async (req, res) => {
  if (req.files === null) res.status(400).send("No image was uploaded");

  if (!req.params.id) res.status(400).send("No event id provided");

  const file = req.files.file;
  const { isImage, name } = isFileImage(file);

  if (!isImage)
    res
      .status(400)
      .send("Uploaded file must be an image with a png or jpeg extension");

  const filePath = `${__dirname}/uploads/${name}`;
  file.mv(filePath, (err) => {
    console.log(err);
    return res.status(500).send("There was a problem updating banner");
  });

  try {
    const selectedEvent = await Event.findById({ _id: req.params.id });

    if (!selectedEvent) res.status(404).send("Selected event was not found");

    selectedEvent.bannerUrl = filePath;
    await Event.findOneAndUpdate({ _id: req.params.id }, selectedEvent);

    res.json({
      success: true,
      message: "Banner was updated successfully",
      data: {
        bannerName: name,
        filePath: filePath,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("There was a problem updating banner");
  }
});

router.put("/events/update-rsvps/:id", verify, async (req, res) => {
  if (!req.params.id) res.status(400).send("Event id was not provided");

  const idLists = req.body;

  if (idLists.length <= 0) res.status(400).send("Bad request");

  try {
    let listOfUserIds = [];
    const users = await User.find({});
    const event = await Event.findById({ _id: req.params.id });

    if (!event) res.status(404).send("Specified event does not exist");

    users.forEach((user) => {
      listOfUserIds.push(user._id);
    });

    idLists.forEach((id) => {
      if (listOfUserIds.includes(id)) {
        event.rsvps.push(id);
      }
    });

    await Event.findByIdAndUpdate({ _id: event._id }, event);

    res.json({
      success: true,
      message: "RSVPs are updated successfully",
      data: event,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("There was a problem updating rsvps");
  }
});

module.exports = router;
