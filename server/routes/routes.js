const router = require("express").Router();

const {
  testNotify,
  updateDeviceToken,
  sendUserNotify,
} = require("../controllers/notification-controllers.js");

const { login, createUser } = require("../controllers/user-controllers.js");

router.post("/user", login);
router.post("/user/new", createUser);
router.post("/user/send-notification", sendUserNotify);
router.post("/user/refresh-device-token", updateDeviceToken);
router.post("/notification", testNotify);

module.exports = router;
