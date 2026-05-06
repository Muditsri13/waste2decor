const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('https://waste2decor-backend-kmqa.onrender.com/api/debug');
    console.log(res.data);
  } catch (err) {
    console.log(err.message);
  }
}
test();
