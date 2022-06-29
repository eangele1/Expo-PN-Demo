const { Expo } = require("expo-server-sdk");
const User = require("../models/UserModel");

module.exports = {
  sendUserNotify: async (req, res) => {
    //makes a new Expo client
    const expo = new Expo();

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(req.body.deviceToken)) {
      res.json({
        msg: `${req.body.deviceToken} is not a valid Expo push token`,
      });
    }

    /* since we're only sending one message, but the chunkPushNotifications 
    function requires the messages to be iteratable, we'll make an
    initialized array with our message. */
    const messages = [
      {
        to: req.body.deviceToken,
        title: req.body.title,
        body: req.body.text,
        priority: "high",
      },
    ];

    const chunks = expo.chunkPushNotifications(messages);

    //same as before, in order to receive a ticket of our notification, we need a tickets array
    let tickets = [];
    try {
      for (let chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }

    console.log("Success!");
    res.json({ msg: "Success!" });
  },
};
