require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Get necessary routes
require("./app/routes/alert.routes")(app);
require("./app/routes/alertType.routes")(app);
require("./app/routes/asset.routes")(app);
require("./app/routes/assetCategory.routes")(app);
require("./app/routes/assetData.routes")(app);
require("./app/routes/assetField.routes")(app);
require("./app/routes/assetTemplate.routes")(app);
require("./app/routes/assetType.routes")(app);
require("./app/routes/auth.routes.js")(app);
require("./app/routes/building.routes")(app);
require("./app/routes/fieldList.routes")(app);
require("./app/routes/fieldListOption.routes")(app);
require("./app/routes/group.routes")(app);
require("./app/routes/log.routes")(app);
require("./app/routes/notification.routes")(app);
require("./app/routes/permission.routes")(app);
require("./app/routes/person.routes")(app);
require("./app/routes/room.routes")(app);
require("./app/routes/templateData.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/vendor.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3033;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
