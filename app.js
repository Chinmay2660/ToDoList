//jshint esversion:6

const express = require("express"); // Express is a framework for Node.js
const bodyParser = require("body-parser"); // Body-parser is a middleware for Express

const app = express(); // Create an Express app

let items = ["Buy Food", "Cook Food", "Eat Food"]; // Create a variable to store the new item
let workItems = []; // Create a variable to store the new work item

app.set("view engine", "ejs"); // Set the view engine to EJS

app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser
app.use(express.static("public")); // Use the public folder

app.get("/", function (req, res) {
  // Get request to the root route
  let today = new Date(); // Create a new date object
  // var currentDay = today.getDay(); // Get the day of the week
  // var day = ""; // Create a variable to store the day of the week

  // switch (currentDay) {
  //   case 0:
  //     day = "Sunday";
  //     break;
  //   case 1:
  //     day = "Monday";
  //     break;
  //   case 2:
  //     day = "Tuesday";
  //     break;
  //   case 3:
  //     day = "Wednesday";
  //     break;
  //   case 4:
  //     day = "Thursday";
  //     break;
  //   case 5:
  //     day = "Friday";
  //     break;
  //   case 6:
  //     day = "Saturday";
  //     break;
  //   default:
  //     console.log("Error: current day is equal to: " + currentDay);
  // }

  let options = {
    // Create an object to store the options for the date
    weekday: "long", // Set the day of the week
    day: "numeric", // Set the day of the month
    month: "long", // Set the month
  };

  let day = today.toLocaleDateString("en-US", options); //  Set the day of the week

  // if (currentDay === 6 || currentDay === 0) {
  //   day = "Weekend"; // Set the day of the week
  //   // res.sendFile(__dirname + "/weekend.html"); // Send a response
  // } else {
  //   day = "Weekday"; // Set the day of the week
  //   // res.sendFile(__dirname + "/weekday.html"); // Send a response
  // }
  // res.render("list", { kindOfDay: day, newListItem: items }); // Render the index.ejs file and pass the day of the week
  res.render("list", { listTitle: day, newListItem: items });
});

app.post("/", function (req, res) {
  // Post request to the root route
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    // If the list is the work list
    workItems.push(item); // Push the new item to the workItems array
    res.redirect("/work"); // Redirect to the /work route
  } else {
    items.push(item);
    // console.log(item); // Log the new item to the console
    res.redirect("/"); // Redirect to the root route
  }
});

app.get("/work", function (req, res) {
  // Get request to the /work route
  res.render("list", { listTitle: "Work List", newListItem: workItems }); // Render the index.ejs file and pass the day of the week
});

app.post("/work", function (req, res) {
  // Post request to the /work route
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work"); // Redirect to the /work route
});

app.listen(3000, function () {
  // Listen on port 3000
  console.log("Server started on port 3000."); // Log a message to the console
});
