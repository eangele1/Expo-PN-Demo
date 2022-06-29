const router = require("express").Router();

const {
  sendUserNotify,
} = require("../controllers/notification-controllers.js");

router.post("/user/send-notification", sendUserNotify);

module.exports = router;
