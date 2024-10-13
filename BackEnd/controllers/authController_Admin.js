const ChurchUser = require('../models/ChurchUser');  // Adjust to your model
const { hashPassword, comparePassword } = require('../helpers/auth');

// Controller to get all records
const getRecords = async (req, res) => {
  try {
    const records = await ChurchUser.find();  // Fetch records from the database
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const addNewRecord = async (req, res) => {
    try {
        const { firstName, lastName, email, password, birthDate } = req.body;

        // Validate input fields
        if (!firstName) {
            return res.status(400).json({ error: "First name is required" });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // Check if the user already exists
        const userExists = await ChurchUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password and create a new user
        const hashedPassword = await hashPassword(password);
        const newUser = await ChurchUser.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthDate,
        });

        return res.status(201).json(newUser); // Return the newly created user
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
  getRecords,
  addNewRecord,
};