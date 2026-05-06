const mongoose = require('mongoose');

try {
  console.log("Connecting...");
  mongoose.connect(undefined)
    .then(() => console.log("Connected"))
    .catch(err => console.log("Caught in promise:", err.message));
} catch (err) {
  console.log("Caught exception:", err.message);
}
