import { Router, Request, Response } from "express";
import upload from "../middleware/multer";
import { handleFileUpload } from "../services/upload";

const router = Router();

// POST /upload
/*when a file is uploaded through the route (e.g., POST /uploads), the Multer middleware processes the incoming file and saves it in the uploads/ folder on the server (based on the destination setting in the storage configuration). */
router.post(
  "/uploads",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded or invalid file type" });
      return;
    }

    try {
      const fileInfo = await handleFileUpload(req.file);

      res.status(200).json({
        message: "PDF uploaded successfully",
        file: fileInfo,
      });
    } catch (err) {
      console.log("PDF upload error", err);
      res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({
      message: "PDF uploaded successfully",
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
      },
    });
  }
);

export default router;
