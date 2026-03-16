export type GoogleBooksResponse = {
  items?: GoogleBookItem[];
};

export type GoogleBookItem = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
};

export type Book = {
  id: string;
  title: string;
  authors: string[];
  description: string;
  publishedDate: string;
  pageCount: number;
  categories: string[];
  thumbnail: string | null;
};
