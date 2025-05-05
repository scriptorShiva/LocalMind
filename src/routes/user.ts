import { Router, Request, Response } from "express";
import { handleUserChat } from "../services/userChat";

const router = Router();

router.post("/chat", async (req: Request, res: Response) => {
  const { prompt: inputText, docName } = req.body;

  if (!inputText || !docName) {
    res.status(400).json({ error: "Missing prompt or document name" });
  }

  try {
    const { answer, references } = await handleUserChat(inputText, docName);
    res.status(200).json({ message: "chat with user", answer, references });
  } catch (err) {
    console.log("Chat error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
