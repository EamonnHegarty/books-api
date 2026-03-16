import { Router, Request, Response, NextFunction } from "express";
import { transformBookQuery } from "../services/claudeService";
import { searchBooks, getBookById } from "../services/booksService";

const router = Router();

router.post(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.body;

      if (!query || typeof query !== "string") {
        res
          .status(400)
          .json({ error: "query is required and must be a string" });
        return;
      }

      const structuredQuery = await transformBookQuery(query);
      const books = await searchBooks(structuredQuery);

      res.status(200).json({
        originalQuery: query,
        structuredQuery,
        results: books,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const book = await getBookById(id as string);
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
});

export default router;
