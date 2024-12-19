import { Issue, Discussion, SheetRow } from "./types.js";

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
