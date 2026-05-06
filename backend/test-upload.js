const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    const form = new FormData();
    form.append('name', 'Test Product');
    form.append('description', 'Test Description');
    form.append('price', '100');
    form.append('category', 'Furniture');
    form.append('userId', '64c1e8a9f2a9c3d4e5f6g7h8'); // Fake ObjectId
    
    // Create a tiny dummy image
    fs.writeFileSync('dummy.jpg', 'fake image content');
    form.append('image', fs.createReadStream('dummy.jpg'));

    console.log("Sending upload request to Render...");
    const res = await axios.post('https://waste2decor-backend-kmqa.onrender.com/api/products/add', form, {
      headers: form.getHeaders()
    });
    
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
    console.log("ERROR MESSAGE:", err.message);
  }
}

testUpload();
