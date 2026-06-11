import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            event
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({createdAt: -1});

        res.status(200).json({
            success: true,
            events
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to fetch events",
            error: error.message
        });
    }
};