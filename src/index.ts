import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import uploadRoutes from "./routes/upload";
import user from "./routes/user";

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express with TypeScript");
});

// Use upload routes
app.use("/api/v1", uploadRoutes);

// Use customer chat route
app.use("/api/v1/user", user);

// Serve uploaded files
// or example, if you upload a PDF named document.pdf to uploads/, you can access it via http://localhost:8080/uploads/document.pdf.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
