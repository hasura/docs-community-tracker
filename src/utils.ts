import {
  Issue,
  Discussion,
  Thread,
  SheetRow,
  MessageDetails,
} from "./types.js";
import { GUILD_ID } from "./constants.js";

export function getYesterdayInISO(): string {
  const now = new Date();
  now.setDate(now.getDate() - 30);
  return now.toISOString();
}

export function eliminateExistingIssues(
  issues: Issue[],
  rows: SheetRow[],
): Issue[] {
  const existingLinks = new Set(rows.map((row) => row.link));

  const filteredIssues = issues.filter(
    (issue) => !existingLinks.has(issue.url),
  );

  return filteredIssues;
}

export function eliminateExistingDiscussions(
  discussions: Discussion[],
  rows: SheetRow[],
): Discussion[] {
  const existingLinks = new Set(rows.map((row) => row.link));

  const filteredDiscussions = discussions.filter(
    (discussion) => !existingLinks.has(discussion.url),
  );

  return filteredDiscussions;
}

export function eliminateExistingThreads(
  threads: MessageDetails[],
  rows: SheetRow[],
): MessageDetails[] {
  const existingLinks = new Set(rows.map((row) => row.link));

  const filteredThreads = threads.filter(
    (thread) => thread.url && !existingLinks.has(thread.url),
  );

  return filteredThreads;
}

// sortThreads() takes in the creation dates and makes sure
// the most-recent threads are at the bottom
export function sortThreads(recentThreads: Thread[]): Thread[] {
  recentThreads.sort((a, b) => {
    const dateA = a.thread_metadata?.create_timestamp
      ? new Date(a.thread_metadata.create_timestamp).getTime()
      : 0;
    const dateB = b.thread_metadata?.create_timestamp
      ? new Date(b.thread_metadata.create_timestamp).getTime()
      : 0;

    return dateA - dateB;
  });

  return recentThreads;
}

// shapeDiscordRow() combines the name of the thread along with
// the MessageDetails returned when retrieving the first MessageDetails
// to create everythign we need for a new SheetRow so the LLM can understand
// exactly what a user is talking about
export function shapeDiscordRow(
  threadName: string,
  messageDetails: MessageDetails,
): MessageDetails {
  return {
    ...messageDetails,
    threadName,
    url: createMessageLink(messageDetails),
  };
}

// createMessageLink() builds the URL structure for a Discord message so we can
// easily add this into the SheetRow
export function createMessageLink(message: MessageDetails): string {
  return `https://www.discord.com/channels/${GUILD_ID}/${message.messageId}`;
}
