import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user.id,
      organizer: {
        id: req.user.id,
        name: req.user.orgName || req.user.name,
      },
      status: "pending",
    };
    
    const event = await Event.create(eventData);
    
    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ "organizer.id": req.user.id });
    
    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get my events error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const singleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    if (event.organizer.id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get single event error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    if (event.organizer.id !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only update your own events" });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    if (event.organizer.id !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own events" });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};