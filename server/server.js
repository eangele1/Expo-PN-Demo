const express = require("express");
const app = express();
const PORT = 5050;
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/notify", require("./routes/routes.js"));

app.listen(PORT, () =>
  console.log(`Now listening at http://localhost:${PORT}.`)
);
