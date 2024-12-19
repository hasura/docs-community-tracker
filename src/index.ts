import { fetchIssues, parseIssue } from "./github/index.js";
import { summarizeBody, updateIssueBody } from "./openai/index.js";
import { getRows, writeNewRow } from "./sheets/index.js";
import { eliminateExistingIssues } from "./utils.js";

const main = async () => {
  // Get the issues from GitHub
  const issues = await fetchIssues();

  // Get the list from the spreadsheet
  const currentRowsInSheet = await getRows();

  // Check the spreadsheet's current values against the issues array and see
  // if there's anything new.
  const newIssues = eliminateExistingIssues(issues, currentRowsInSheet);

  if (newIssues.length < 1) {
    console.log(`🍻 No new issues or discussions today`);
  } else {
    // For any issues that are new, summarize them using GPT and ship 'em
    for (const issue of newIssues) {
      let parsed = parseIssue(issue);
      const summary = await summarizeBody(parsed.notes);
      updateIssueBody(parsed, summary);
      writeNewRow(parsed);
    }
  }
};

main();
