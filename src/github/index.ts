import { client, issueQuery, discussionQuery } from "./client.js";
import * as config from "../constants.js";
import { SheetRow } from "../types.js";
import { getYesterdayInISO } from "../utils.js";
import {
  Issue,
  GraphQLIssueResponse,
  Discussion,
  GraphQLDiscussionResponse,
} from "../types.js";

const owner = config.OWNER;

// fetchIssues will grab the current open issues in the repo, limiting itself to the first 100.
export async function fetchIssues(repo: string): Promise<Issue[]> {
  const variables = {
    owner,
    repo,
    first: 100,
  };

  const sinceDate = getYesterdayInISO();

  try {
    const response = await client<GraphQLIssueResponse>(issueQuery, {
      ...variables,
    });

    // Filter issues based on the `createdAt` field
    const filteredIssues = response.repository.issues.nodes
      .filter((issue) => new Date(issue.createdAt) >= new Date(sinceDate))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    return filteredIssues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
}

// parseIssue takes a single issue and creates a SheetRow from it.
export function parseIssue(anIssue: Issue): SheetRow {
  let parsedIssue: SheetRow = {
    link: anIssue.url,
    createdAt: anIssue.createdAt,
    notes: anIssue?.body || "",
    outcome: "",
    status: anIssue.state || "OPEN",
  };

  return parsedIssue;
}

// fetchDiscussions will grab the current unanswered discussions in the the repo, limiting itself to the first 100.
export async function fetchDiscussions(repo: string): Promise<Discussion[]> {
  const variables = {
    owner,
    repo,
    first: 100,
  };

  const sinceDate = getYesterdayInISO();

  try {
    const response = await client<GraphQLDiscussionResponse>(discussionQuery, {
      ...variables,
    });

    // Filter discussions based on the `createdAt` field
    const filteredDiscussions = response.repository.discussions.nodes
      .filter(
        (discussion) => new Date(discussion.createdAt) >= new Date(sinceDate),
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    return filteredDiscussions;
  } catch (error) {
    console.error("Error fetching discussions:", error);
    throw error;
  }
}

// parseDiscssuion takes a single discussion and creates a SheetRow from it.
export function parseDiscussion(aDiscussion: Discussion): SheetRow {
  let parsedDiscussion: SheetRow = {
    link: aDiscussion.url,
    createdAt: aDiscussion.createdAt,
    notes: aDiscussion?.body || "",
    outcome: "",
    status: aDiscussion.isAnswered || "OPEN",
  };

  return parsedDiscussion;
}
