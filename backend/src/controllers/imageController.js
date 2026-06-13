import Image from "../models/Image.js";
import Registration from "../models/Registeration.js";
import Event from "../models/Event.js";

// @desc    Upload an image for a registered event
// @route   POST /api/images/upload
// @access  Private (user must be registered for the event)
export const uploadImage = async (req, res) => {
  try {
    const { eventId, imageData, fileName, mimeType, caption } = req.body;

    if (!eventId || !imageData || !fileName || !mimeType) {
      return res.status(400).json({
        success: false,
        message: "eventId, imageData, fileName, and mimeType are required.",
      });
    }

    // Check file size (base64 is ~33% larger than raw, so 2.7MB base64 ≈ 2MB file)
    const sizeInBytes = Buffer.byteLength(imageData, "utf8");
    if (sizeInBytes > 2.7 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image too large. Max size is 2MB.",
      });
    }

    // Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Verify user is registered for this event
    const registration = await Registration.findOne({
      event: eventId,
      attendeeEmail: req.user.email,
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: "You can only upload images for events you have registered for.",
      });
    }

    const image = await Image.create({
      eventId,
      uploadedBy: req.user.id,
      uploaderName: req.user.name,
      imageData,
      fileName,
      mimeType,
      caption: caption || "",
    });

    res.status(201).json({
      success: true,
      image: {
        _id: image._id,
        eventId: image.eventId,
        uploaderName: image.uploaderName,
        fileName: image.fileName,
        caption: image.caption,
        createdAt: image.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all images for a specific event
// @route   GET /api/images/event/:eventId
// @access  Private
export const getImagesByEvent = async (req, res) => {
  try {
    const images = await Image.find({ eventId: req.params.eventId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all images uploaded by the current user
// @route   GET /api/images/my-uploads
// @access  Private
export const getMyUploads = async (req, res) => {
  try {
    const images = await Image.find({ uploadedBy: req.user.id })
      .populate("eventId", "title date venue category")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Get my uploads error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Private (uploader or event organizer)
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
      });
    }

    // Allow delete if user is the uploader
    const isUploader = image.uploadedBy.toString() === req.user.id.toString();

    // Allow delete if user is the organizer of the event
    const event = await Event.findById(image.eventId);
    const isOrganizer =
      event &&
      (event.organizerId?.toString() === req.user.id.toString() ||
        event.organizer?.id?.toString() === req.user.id.toString());

    if (!isUploader && !isOrganizer) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own images or images for your events.",
      });
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
