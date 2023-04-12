// Requiring in dotenv and express
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

//----------------------------- Controllers ---------------------------------
const routes = require("./controllers/routes.controller");

// ---------------------------- Middleware ---------------------------------
app.use(express.json());

// ---------------------------- Routes ---------------------------------
app.use("/blog", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
