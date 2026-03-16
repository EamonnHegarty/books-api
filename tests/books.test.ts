import request from "supertest";
import app from "../src/app";

jest.mock("../src/services/claudeService", () => ({
  transformBookQuery: jest
    .fn()
    .mockResolvedValue("intitle:horror space science fiction"),
}));

jest.mock("../src/services/booksService", () => ({
  searchBooks: jest.fn().mockResolvedValue([
    {
      id: "abc123",
      title: "Space Horror",
      authors: ["Test Author"],
      description: "A scary book in space",
      publishedDate: "2021",
      pageCount: 300,
      categories: ["Fiction"],
      thumbnail: null,
    },
  ]),
  getBookById: jest.fn().mockResolvedValue({
    id: "abc123",
    title: "Space Horror",
    authors: ["Test Author"],
    description: "A scary book in space",
    publishedDate: "2021",
    pageCount: 300,
    categories: ["Fiction"],
    thumbnail: null,
  }),
}));

describe("GET /health", () => {
  it("returns 200 with status and timestamp", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.timestamp).toBeDefined();
  });
});

describe("POST /books/search", () => {
  it("returns 200 with results", async () => {
    const res = await request(app)
      .post("/books/search")
      .send({ query: "a scary horror book set in space" });
    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.structuredQuery).toBe(
      "intitle:horror space science fiction",
    );
  });

  it("returns 400 if query is missing", async () => {
    const res = await request(app).post("/books/search").send({});
    expect(res.status).toBe(400);
  });
});

describe("GET /books/:id", () => {
  it("returns 200 with book", async () => {
    const res = await request(app).get("/books/abc123");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Space Horror");
  });
});
