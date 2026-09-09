import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { query } = req.body;

  res.json({
    message: `Received: ${query}`,
  });
});

export default router;
