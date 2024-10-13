const mongoose = require('mongoose');
const { Schema } = mongoose;

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ChurchUser', // Assuming you have a User model
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    tasksCompleted: {
        type: Number,
        default: 0, // Default value if no tasks have been completed
    },
    attendanceRecords: {
        type: Number,
        default: 0, // Default value for attendance
    },
    notes: {
        type: String,
        default: '', // Optional notes about progress
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexing for fast queries
progressSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

// Method to update progress
progressSchema.methods.updateProgress = function (newData) {
    if (newData.tasksCompleted !== undefined) {
        this.tasksCompleted += newData.tasksCompleted;
    }
    if (newData.attendanceRecords !== undefined) {
        this.attendanceRecords += newData.attendanceRecords;
    }
    if (newData.notes !== undefined) {
        this.notes = newData.notes; // Replace or update notes
    }
    return this.save(); // Save the updated progress
};

const ProgressModel = mongoose.model('Progress', progressSchema, 'Progress');

module.exports = ProgressModel;
