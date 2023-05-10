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

// mongoose.connect("mongodb://localhost:27017/todolistDB", { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// }); // Connect to the todolistDB database

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

app.get("/", async(req, res) => { // Find all the items in the database
    try {
        const foundItems = await Item.find(); // Find all the items in the database
        if (foundItems.length === 0) { // If there are no items in the database
            await Item.insertMany(defaultItems); // Insert the default items into the database

            console.log("Successfully saved default items to DB"); // Log a message to the console

            res.redirect("/"); // Redirect to the root route
        } else {
            res.render("list", { listTitle: "Today", newListItem: foundItems }); // Render the index.ejs file and pass the day of the week
        }
    } catch (err) {
        console.log(err); // Log the error to the console
    }
});

app.get("/:customListName", async(req, res) => {
    // Get request to the custom list route
    const customListName = _.capitalize(req.params.customListName); // Get the custom list name from the request parameters
    try {
        const foundList = await List.findOne({ name: customListName }); // Find the list with the custom list name
        if (foundList) { // If the list exists
            res.render("list", { // Render the list.ejs file and pass the list title and items
                listTitle: foundList.name,
                newListItem: foundList.items
            });
        } else {
            const list = new List({ // Create a new list
                name: customListName,
                items: defaultItems
            });
            await list.save(); // Save the new list to the database
            res.redirect("/" + customListName); // Redirect to the custom list route
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/", async(req, res) => {
    // Post request to the root route
    const itemName = req.body.newItem; // Get the new item from the request body
    const listName = req.body.list; // Get the list name from the request body
    const item = new Item({ // Create a new item
        name: itemName, // Set the name of the item
    });

    if (listName === "Today") { // If the list is the default list
        await item.save(); // Save the new item to the database
        res.redirect("/"); // Redirect to the root route
    } else {
        try {
            const foundList = await List.findOne({ name: listName }); // Find the list with the custom list name
            foundList.items.push(item); // Push the new item to the items array
            await foundList.save(); // Save the list to the database
            res.redirect("/" + listName); // Redirect to the custom list route
        } catch (err) {
            console.log(err);
        }
    }
});

app.post("/delete", async(req, res) => {
    // Post request to the /delete route
    const checkedItemId = req.body.checkbox; // Get the id of the checked item from the request body
    const listName = req.body.listName; // Get the list name from the request body

    if (listName === "Today") { // If the list is the default list 
        try {
            await Item.findByIdAndRemove(checkedItemId); // Find the item by its id and remove it
            console.log("Successfully deleted checked item"); // Log a message to the console
            res.redirect("/"); // Redirect to the root route
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            await List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }); // Find the list by its name and remove the item from the items array
            res.redirect("/" + listName); // Redirect to the custom list route
        } catch (err) {
            console.log(err);
        }
    }
});

app.post("/work", (req, res) => {
    // Post request to the /work route
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work"); // Redirect to the /work route
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    // Listen on port 3000
    console.log("Server has started successfully."); // Log a message to the console
});