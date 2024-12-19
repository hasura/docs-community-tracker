import {
  fetchIssues,
  parseIssue,
  fetchDiscussions,
  parseDiscussion,
} from "./github/index.js";
import {
  summarizeIssueBody,
  updateIssueBody,
  updateDiscussionBody,
  summarizeDiscussionBody,
} from "./openai/index.js";
import { getRows, writeNewRow } from "./sheets/index.js";
import {
  eliminateExistingIssues,
  eliminateExistingDiscussions,
} from "./utils.js";

const main = async () => {
  // Get the issues and discussions from GitHub
  const issues = await fetchIssues();
  const discussions = await fetchDiscussions();

  // Get the list from the spreadsheet
  const currentRowsInSheet = await getRows();

  // Check the spreadsheet's current values against the issues array and see
  // if there's anything new.
  const newIssues = eliminateExistingIssues(issues, currentRowsInSheet);

  if (newIssues.length < 1) {
    console.log(`🍻 No new issues today`);
  } else {
    // For any issues that are new, summarize them using GPT and ship 'em
    for (const issue of newIssues) {
      let parsed = parseIssue(issue);
      const summary = await summarizeIssueBody(parsed.notes);
      updateIssueBody(parsed, summary);
      writeNewRow(parsed);
    }
  }

  const newDisucssions = eliminateExistingDiscussions(
    discussions,
    currentRowsInSheet,
  );

  if (newDisucssions.length < 1) {
    console.log(`🍻 No new discussions today`);
  } else {
    for (const discussion of newDisucssions) {
      let parsed = parseDiscussion(discussion);
      const summary = await summarizeDiscussionBody(parsed.notes);
      updateDiscussionBody(parsed, summary);
      writeNewRow(parsed);
    }
  }
};

main();
