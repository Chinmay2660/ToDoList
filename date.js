//jshint esversion:6

exports.getDate = function () { // Export the getDate function

    const today = new Date(); // Create a new date object
    const options = {
        // Create an object to store the options for the date
        weekday: "long", // Set the day of the week
        day: "numeric", // Set the day of the month
        month: "long", // Set the month
    };

    return today.toLocaleDateString("en-US", options); //  Set the day of the week
}

module.exports.getDay = function () { // Export the getDay function

    const today = new Date(); // Create a new date object
    const options = {
        // Create an object to store the options for the date
        weekday: "long", // Set the day of the week
    };

    return today.toLocaleDateString("en-US", options); //  Set the day of the week
}

// console.log(module.exports); // Log the module.exports object to the console