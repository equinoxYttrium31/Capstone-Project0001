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

const updateRecord = async (req, res) => {
  try {
      // Get the userId from the request parameters instead of from the token
      const userId = req.params.userId; 

      // Validate if userId is provided
      if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      // Destructure necessary fields from the request body
      const {
          firstName,
          lastName,
          email,
          birthDate,
          gender,
          address, // Expecting an array of address objects
          CellNum,
          TelNum,
          CellLead,
          NetLead,
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      // Prepare the update object
      const updateData = {
          firstName,
          lastName,
          email,
          birthDate,
          gender,
          address, // Directly use the address array from the frontend
          CellNum,
          TelNum,
          CellLead,
          NetLead,
      };

      // Find and update the user in the database
      let updatedUser;
      try {
          updatedUser = await ChurchUser.findByIdAndUpdate(
              userId,
              updateData,
              { new: true, select: '-password' } // Return the updated document, excluding the password
          );
      } catch (dbError) {
          console.error('Database update error:', dbError);
          return res.status(500).json({ error: 'Database error' });
      }

      // Check if the user was found
      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Return the updated user data
      res.json(updatedUser);
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getRecords,
  addNewRecord,
  updateRecord,
};