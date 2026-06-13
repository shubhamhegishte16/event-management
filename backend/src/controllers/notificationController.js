export const createNotification = async (req, res) => {
  try {
    const { eventId, message, type } = req.body;

    const notification = await Notification.create({
      event: eventId,
      organizer: req.organizer._id,
      message,
      type,

      // visible for 7 days
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};