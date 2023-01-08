//jshint esversion:6

module.exports = getDate; // Export the getDate function

function getDate() {
    let today = new Date(); // Create a new date object
    let options = {
        // Create an object to store the options for the date
        weekday: "long", // Set the day of the week
        day: "numeric", // Set the day of the month
        month: "long", // Set the month
    };

    let day = today.toLocaleDateString("en-US", options); //  Set the day of the week
    return day;
}