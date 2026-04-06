const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/waste2decor")
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
});

module.exports = mongoose;