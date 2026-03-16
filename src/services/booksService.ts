import axios from "axios";
import { Book, GoogleBookItem, GoogleBooksResponse } from "../types/types";

const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1";

function mapBookItem(item: GoogleBookItem): Book {
  const info = item.volumeInfo ?? {};
  return {
    id: item.id,
    title: info.title ?? "Unknown Title",
    authors: info.authors ?? [],
    description: info.description ?? "",
    publishedDate: info.publishedDate ?? "",
    pageCount: info.pageCount ?? 0,
    categories: info.categories ?? [],
    thumbnail: info.imageLinks?.thumbnail ?? null,
  };
}

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await axios.get<GoogleBooksResponse>(
    `${GOOGLE_BOOKS_BASE_URL}/volumes`,
    {
      params: {
        q: query,
        maxResults: 10,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    },
  );

  const items = response.data.items ?? [];
  return items.map(mapBookItem);
}

export async function getBookById(id: string): Promise<Book> {
  const response = await axios.get<GoogleBookItem>(
    `${GOOGLE_BOOKS_BASE_URL}/volumes/${id}`,
    {
      params: {
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    },
  );
  return mapBookItem(response.data);
}
