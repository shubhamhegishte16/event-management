import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  uploadImage,
  getImagesByEvent,
  getMyUploads,
  deleteImage,
} from "../controllers/imageController.js";

const router = express.Router();

router.post("/upload", protect, uploadImage);
router.get("/my-uploads", protect, getMyUploads);
router.get("/event/:eventId", protect, getImagesByEvent);
router.delete("/:id", protect, deleteImage);

export default router;
