//jshint esversion:6

const express = require("express"); // Express is a framework for Node.js
const bodyParser = require("body-parser"); // Body-parser is a middleware for Express
const mongoose = require("mongoose"); // Mongoose is an ODM for MongoDB
const _ = require("lodash"); // Lodash is a utility library
// const date = require(__dirname + "/date.js"); // Require the date.js file

const app = express(); // Create an Express app

// const items = ["Buy Food", "Cook Food", "Eat Food"]; // Create a variable to store the new item
// const workItems = []; // Create a variable to store the new work item

app.set("view engine", "ejs"); // Set the view engine to EJS

app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser
app.use(express.static("public")); // Use the public folder

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { // Connect to the todolistDB database
//   useNewUrlParser: true,
// });

mongoose.connect("mongodb+srv://bhoirchinmay2016:Chinmay@cluster0.engybuo.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({ // Create a schema for the items
  name: String, // The name of the item
});

const Item = new mongoose.model("Item", itemsSchema); // Create a model for the items

const item1 = new Item({ // Create a new item
  name: "Welcome to your todolist!", // Set the name of the item
});

// const item2 = new Item({ // Create a new item
//   name: "Hit the + button to add a new item.", // Set the name of the item
// });

// const item3 = new Item({ // Create a new item
//   name: "<-- Hit this to delete an item.", // Set the name of the item
// });

const defaultItems = [item1]; // Create an array of the default items

const listSchema = new mongoose.Schema({ // Create a schema for the lists
  name: String, // The name of the list
  items: [itemsSchema], // The items in the list
});

const List = new mongoose.model("List", listSchema); // Create a model for the lists

// Item.insertMany(defaultItems) // Insert the default items into the database
//   .then(function () { // If the items are successfully inserted into the database
//     console.log("Successfully saved default items to DB"); // Log a message to the console
//   })
//   .catch(function (err) { // If there is an error
//     console.log(err); // Log the error to the console
//   });

app.get("/", function (req, res) {
  // Get request to the root route
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

  // if (currentDay === 6 || currentDay === 0) {
  //   day = "Weekend"; // Set the day of the week
  //   // res.sendFile(__dirname + "/weekend.html"); // Send a response
  // } else {
  //   day = "Weekday"; // Set the day of the week
  //   // res.sendFile(__dirname + "/weekday.html"); // Send a response
  // }
  // res.render("list", { kindOfDay: day, newListItem: items }); // Render the index.ejs file and pass the day of the week

  // const day = date.getDate(); // Set the day of the week

  Item.find().then(function (foundItems) { // Find all the items in the database
    if (foundItems.length === 0) { // If there are no items in the database
      Item.insertMany(defaultItems) // Insert the default items into the database
        .then(function () { // If the items are successfully inserted into the database
          console.log("Successfully saved default items to DB"); // Log a message to the console
          res.redirect("/"); // Redirect to the root route
        })
        .catch(function (err) { // If there is an error
          console.log(err); // Log the error to the console
        });
    } else {
      res.render("list", { listTitle: "Today", newListItem: foundItems }); // Render the index.ejs file and pass the day of the week
    }
  });
});



app.get("/:customListName", function (req, res) {
  // Get request to the custom list route
  const customListName = _.capitalize(req.params.customListName); // Get the custom list name from the request parameters
  List.findOne({ name: customListName })
    .then(function (foundList) { // Find the list with the custom list name
      if (foundList) { // If the list exists
        res.render("list", { // Render the list.ejs file and pass the list title and items
          listTitle: foundList.name,
          newListItem: foundList.items
        })
      } else {
        const list = new List({ // Create a new list
          name: customListName,
          items: defaultItems
        })
        list.save(); // Save the new list to the database
        res.redirect("/" + customListName) // Redirect to the custom list route
      }
    }).catch(function (err) {
      console.log(err);
    });
  // res.render("list", { listTitle: customListName, newListItem: foundItems }); // Render the index.ejs file and pass the day of the week
});

app.post("/", function (req, res) {
  // Post request to the root route
  const itemName = req.body.newItem; // Get the new item from the request body
  const listName = req.body.list; // Get the list name from the request body

  const item = new Item({ // Create a new item
    name: itemName, // Set the name of the item
  });

  if (listName === "Today") { // If the list is the default list
    item.save(); // Save the new item to the database
    res.redirect("/"); // Redirect to the root route
  } else {
    List.findOne({ name: listName })
      .then(function (foundList) { // Find the list with the custom list name
        foundList.items.push(item); // Push the new item to the items array
        foundList.save(); // Save the list to the database
        res.redirect("/" + listName) // Redirect to the custom list route
      });
  }

  // const item = req.body.newItem;
  // if (req.body.list === "Work") {
  //   // If the list is the work list
  //   workItems.push(item); // Push the new item to the workItems array
  //   res.redirect("/work"); // Redirect to the /work route
  // } else {
  //   items.push(item);
  //   // console.log(item); // Log the new item to the console
  //   res.redirect("/"); // Redirect to the root route
  // }
});


app.post("/delete", function (req, res) {
  // Post request to the /delete route
  const checkedItemId = req.body.checkbox; // Get the id of the checked item from the request body
  const listName = req.body.listName; // Get the list name from the request body

  if (listName === "Today") { // If the list is the default list 
    Item.findByIdAndRemove(checkedItemId) // Find the item by its id and remove it
      .then(function (foundItem) { // If the item is successfully removed
        Item.deleteOne({ _id: checkedItemId }) // Delete the item from the database
        console.log("Successfully deleted checked item"); // Log a message to the console
        res.redirect("/"); // Redirect to the root route
      });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }) // Find the list by its name and remove the item from the items array
      .then(function (foundList) { // If the list is successfully updated
        res.redirect("/" + listName); // Redirect to the custom list route
      });
  }
});

// app.get("/work", function (req, res) { 
//   // Get request to the /work route
//   res.render("list", { listTitle: "Work List", newListItem: workItems }); // Render the index.ejs file and pass the day of the week
// });

app.post("/work", function (req, res) {
  // Post request to the /work route
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work"); // Redirect to the /work route
});

app.listen(3000, function () {
  // Listen on port 3000
  console.log("Server started on port 3000."); // Log a message to the console
});

