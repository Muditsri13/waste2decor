const axios = require('axios');

async function test() {
  try {
    const res = await axios.post("https://waste2decor-backend.onrender.com/api/auth/login", {
      email: "muditsrikap000@gmail.com",
      password: "somepassword"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error response status:", err.response?.status);
    console.log("Error response data:", err.response?.data);
    console.log("Error message:", err.message);
  }
}
test();
