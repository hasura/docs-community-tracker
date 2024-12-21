import { SheetRow } from "../types.js";
import { client } from "./config.js";

// Summarize an issue body into a one-sentence note.
export async function summarizeIssueBody(issueBody: string): Promise<string> {
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

export async function summarizeDiscussionBody(
  discussionBody: string,
): Promise<string> {
  const note = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize this GitHub discussion into a one-sentence summary of what the user is asking for: ${discussionBody}`,
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
export function updateDiscussionBody(
  discussion: SheetRow,
  summary: string,
): SheetRow {
  discussion.notes = summary;
  return discussion;
}

export async function summarizeDiscordThreadContent(
  threadName: string,
  content: string,
): Promise<string> {
  const note = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize this Discord thread into a one-sentence summary of what the user is asking for: ${threadName}\n\n ${content}`,
      },
    ],
    model: "gpt-4o",
  });

  if (!note.choices[0].message.content) {
    throw new Error(`Error from OpenAI generating a summary`);
  }

  return note.choices[0].message.content;
}
