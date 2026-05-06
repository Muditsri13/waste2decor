const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = "admin@test.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists!");
      // Ensure role is admin
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Updated existing user role to admin.");
    } else {
      const hashedPassword = await bcrypt.hash("adminpassword123", 10);
      const newAdmin = new User({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      await newAdmin.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Failed to seed admin:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
