import Organizer from "../models/Organizer.js";
import Event from "../models/Event.js";
import Registration from "../models/Registeration.js";

// Get organizer profile
export const getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.user.id).select("-password");
    if (!organizer) {
      return res.status(404).json({ success: false, message: "Organizer not found" });
    }
    res.json({ success: true, organizer });
  } catch (error) {
    console.error("Get organizer profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get organizer dashboard statistics
export const getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user.id;
    
    console.log("Fetching stats for organizer:", organizerId);
    
    // Get all events by this organizer
    const events = await Event.find({ 
      $or: [
        { organizerId: organizerId },
        { "organizer.id": organizerId },
        { createdBy: organizerId }
      ]
    });
    
    console.log(`Found ${events.length} events for organizer`);
    
    const eventIds = events.map(e => e._id);
    
    // Get ALL registrations for these events
    const registrations = await Registration.find({
      event: { $in: eventIds }
    });
    
    console.log(`Found ${registrations.length} total registrations`);
    
    // Calculate total registrations
    const totalRegistrations = registrations.length;
    
    // Get unique attendees count
    const uniqueAttendees = new Set(registrations.map(r => r.attendeeEmail)).size;
    
    // Calculate total revenue
    let totalRevenue = 0;
    for (const reg of registrations) {
      const event = events.find(e => e._id.toString() === reg.event.toString());
      if (event && reg.paymentStatus !== "failed") {
        totalRevenue += (event.price || 0) * (reg.ticketsBooked || 1);
      }
    }
    
    // Calculate event stats
    const eventCount = events.length;
    const totalCapacity = events.reduce((sum, e) => sum + (e.totalTickets || 0), 0);
    const availableSeats = events.reduce((sum, e) => sum + (e.availableTickets || 0), 0);
    
    // Calculate fill rate
    const fillRate = totalCapacity > 0 ? ((totalRegistrations / totalCapacity) * 100).toFixed(1) : 0;
    
    res.json({
      success: true,
      stats: {
        totalEvents: eventCount,
        totalRegistrations,
        uniqueAttendees,
        totalRevenue,
        totalCapacity,
        availableSeats,
        fillRate: parseFloat(fillRate)
      }
    });
  } catch (error) {
    console.error("Get organizer stats error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};