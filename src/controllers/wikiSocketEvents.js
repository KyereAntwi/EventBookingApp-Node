const Wiki = require("../models/shared/event-wikis-schema");
const WikiComment = require("../models/comments");

// send all wikis to connected user for this event room
const joinEventWikisRoomsAndSendAllWikis = (socket) => {
  let allWikis = [];

  socket.on("joinEventWikisRoom", ({ eventId, username }) => {
    socket.join(eventId);

    let wikisListOfEvent = [];
    Wiki.find({ eventId: eventId }).then((res) => {
      wikisListOfEvent = res;
    });

    if (wikisListOfEvent) {
      wikisListOfEvent.forEach((wiki) => {
        let mainWiki = wiki;
        mainWiki.comments = [];

        let wikiCommentsList = [];
        WikiComment.find({ wikiId: wiki._id }).then((res) => {
          wikiCommentsList = res;
        });

        if (wikiCommentsList) {
          mainWiki.comments = [...wikiCommentsList];
        }

        allWikis.push(mainWiki);
      });
    }

    socket.broadcast.to(eventId).emit("newJoin", username);
    socket.emit("getAllEventWikis", allWikis);
  });
};

// post a wiki on an event wiki page
const postWiki = (socket) => {
  socket.on("postWiki", ({ wikiMessage, eventId, userId }) => {
    let wiki = {
      user: userId,
      eventId: eventId,
      message: wikiMessage,
    };

    const newWiki = new Wiki(wiki);
    let response = null;
    newWiki
      .save()
      .then((res) => {
        response = res;
        socket.broadcast
          .to(eventId)
          .emit("newWiki", { status: true, data: response });
      })
      .catch((err) => {
        console.log(err.message);
        socket.emit("newWiki", { status: false, error: err.message });
      });
  });
};

const deleteWiki = (socket) => {
  socket.on("deleteWiki", (wikiId) => {
    const commentsList = [];
    WikiComment.find({ wikiId: wikiId }).then((res) => {
      commentsList = res;
    });

    if (!commentsList) {
      let response = null;
      Wiki.findOneAndRemove({ _id: wikiId }).then((res) => {
        response = res;
      });
      socket.broadcast
        .to(response.eventId)
        .emit("deletedWiki", { status: true, data: response });
    } else {
      socket.emit("deletedWiki", {
        status: false,
        error: "Wiki has some comments so cannot be deleted",
      });
    }
  });
};

const postWikiComment = (socket) => {
  socket.on("commentWiki", ({ comment, wikiId, userId }) => {
    let bodyComment = {
      user: userId,
      message: comment,
      wikiId: wikiId,
    };

    const newComment = new WikiComment(bodyComment);
    let response = null;
    newComment.save().then((res) => {
      response = res;
    });
    let wiki = null;
    Wiki.findById({ _id: response.wikiId }).then((res) => {
      wiki = resl;
      socket.broadcast.to(wiki.eventId).emit("newComment", response);
    });
  });
};

module.exports = {
  joinEventWikisRoomsAndSendAllWikis,
  postWiki,
  postWikiComment,
  deleteWiki,
};
