const { Expo } = require("expo-server-sdk");
const User = require("../models/UserModel");

module.exports = {
  updateDeviceToken: async (req, res) => {
    const user = await User.find({ email: req.body.email });
    try {
      const updateResponse = await User.findByIdAndUpdate(user[0]._id, {
        deviceToken: req.body.deviceToken,
      });

      if (updateResponse !== null) {
        return res.json({ msg: "success" });
      }
      console.log("oops.");
      res.json({ msg: "wrong id sent" });
    } catch (err) {
      res.json({ msg: err });
    }
  },
  sendUserNotify: async (req, res) => {
    const user = await User.find({ _id: req.body.userID });

    if (user[0] === null) {
      console.error("No user found with that info.");
      res.json({ msg: "No user found with that info." });
    }

    //makes a new Expo client
    const expo = new Expo();

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(user[0].deviceToken)) {
      res.json({
        msg: `${user[0].deviceToken} is not a valid Expo push token`,
      });
    }

    /* since we're only sending one message, but the chunkPushNotifications 
    function requires the messages to be iteratable, we'll make an
    initialized array with our message. */
    const messages = [
      {
        to: user[0].deviceToken,
        data: req.body.data,
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
  testNotify: async (req, res) => {
    //makes a new Expo client
    const expo = new Expo();

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(req.body.pushToken)) {
      res.json({ msg: `${req.body.pushToken} is not a valid Expo push token` });
    }

    /* since we're only sending one message, but the chunkPushNotifications 
    function requires the messages to be iteratable, we'll make an
    initialized array with our message. */
    const messages = [
      {
        to: req.body.pushToken,
        data: req.body.data,
        title: req.body.title,
        body: req.body.textBody,
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
