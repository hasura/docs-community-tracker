import { SheetRow } from "../types.js";
import { client } from "./config.js";

// Summarize an issue body into a one-sentence note.
export async function summarizeBody(issueBody: string): Promise<string> {
  const note = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize this GitHub issue into a one-sentence summary of what the user is asking for: ${issueBody}`,
      },
    ],
    model: "gpt-4o",
  });

  if (!note.choices[0].message.content) {
    throw new Error(`Error from OpenAI generating a summary`);
  }

  return note.choices[0].message.content;
}

// Transforms an existing Issue to use the summarized response from GPT.
export function updateIssueBody(issue: SheetRow, summary: string): SheetRow {
  issue.notes = summary;
  return issue;
}
