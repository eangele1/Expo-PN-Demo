const express = require("express");
const app = express();
const PORT = 5050;
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/Expo-PN-Demo-DB",
  (err) => {
    if (err) throw new Error({ msg: err });
    console.log("Connected to Expo-PN-Demo-DB!");
  }
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/notify", require("./routes/routes.js"));

app.listen(PORT, () =>
  console.log(`Now listening at http://localhost:${PORT}.`)
);
