const User = require("../models/UserModel");

module.exports = {
  login: async (req, res) => {
    try {
      const user = await User.find({ email: req.body.email });

      const isMatch = req.body.password === user[0].password;

      if (user[0] !== null && isMatch) {
        res.json({
          _id: user[0]._id,
          userName: user[0].userName,
          email: user[0].email,
          deviceToken: req.body.deviceToken,
        });
      } else {
        console.error("No user found with that info.");
      }
    } catch (error) {
      res.status(401).json({ msg: error });
    }
  },
  createUser: async (req, res) => {
    try {
      const userExists = await User.findOne({ email: req.body.email });

      if (userExists)
        return res.json({ msg: "User with this email already exists" });

      const newUser = await new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        deviceToken: req.body.pushToken,
      }).save();

      res.json({
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        deviceToken: newUser.deviceToken,
      });
    } catch (err) {
      res.json({ msg: err });
    }
  },
};
