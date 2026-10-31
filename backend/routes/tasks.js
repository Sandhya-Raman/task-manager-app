
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all task routes
router.use(authMiddleware);

// Add a new task
router.post("/", async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description,
            status,
            dueDate: dueDate || null,
            user: req.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to create task",
            error: error.message
        });
    }
});

// Get all tasks and filter by status
router.get("/", async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {
            user: req.user.id
        };

        if (status) {
            const allowedStatuses = [
                "Pending",
                "In Progress",
                "Completed"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid task status"
                });
            }

            filter.status = status;
        }

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
});

// Update a task
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const { title, description, status, dueDate } = req.body;

        const updates = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    message: "Task title cannot be empty"
                });
            }
            updates.title = title.trim();
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (status !== undefined) {
            updates.status = status;
        }

        if (dueDate !== undefined) {
            updates.dueDate = dueDate || null;
        }

        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user.id },
            updates,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to update task",
            error: error.message
        });
    }
});

// Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
});

module.exports = router;
