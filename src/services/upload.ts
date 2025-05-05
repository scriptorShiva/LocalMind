import { pdfQueue } from "../queues/pdfQueue";
import path from "path";

export const handleFileUpload = async (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  const nameWithoutExt = path.basename(file.originalname, ext);

  await pdfQueue.add("process-pdf", {
    pdfPath: file.path,
    fileName: file.filename,
    originalName: file.originalname,
    originalNameWithoutExt: nameWithoutExt,
  });

  return {
    message: "PDF uploaded successfully",
    fileName: file.filename,
    size: file.size,
    path: file.path,
    originalName: file.originalname,
    originalNameWithoutExt: nameWithoutExt,
  };
};
