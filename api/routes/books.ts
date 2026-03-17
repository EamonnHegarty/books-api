import { Router, Request, Response, NextFunction } from "express";
import { transformBookQuery } from "../services/claudeService";
import { searchBooks, getBookById } from "../services/booksService";
import logger from "../utils/logger";

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

      logger.info("Book search request", { query });

      const structuredQuery = await transformBookQuery(query);

      logger.info("Claude structured query", {
        originalQuery: query,
        structuredQuery,
      });

      const books = await searchBooks(structuredQuery);

      logger.info("Search complete", { resultCount: books.length });

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
