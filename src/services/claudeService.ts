import Anthropic from "@anthropic-ai/sdk";

export async function transformBookQuery(
  naturalLanguageQuery: string,
): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: naturalLanguageQuery,
      },
    ],
    system: `You are a search query optimizer for the Google Books API. 
Convert the user's natural language request into an optimized search query string.
Return ONLY the search query string, nothing else. No explanation, no punctuation, just the query.

Examples:
User: "I want a scary horror book set in space"
Response: intitle:horror space science fiction

User: "something by stephen king about a haunted hotel"
Response: inauthor:stephen+king haunted hotel

User: "best books for learning python programming"
Response: subject:programming python beginner`,
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text.trim();
}
