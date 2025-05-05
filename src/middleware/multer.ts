import multer from "multer";
import path from "path";

// for memory storage example to send it to s3 , replace multer.storage with multer.memoryStorage
// Storage setup -- we try to store pdf in server memory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf, .jpg
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}_${Date.now()}${ext}`);
  },
});

// File filter: accept only PDF files
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"));
  }
};

// Multer instance: apply storage and filter
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
