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
  summarizeDiscordThreadContent,
} from "./openai/index.js";
import { getRows, writeNewRow } from "./sheets/index.js";
import {
  eliminateExistingIssues,
  eliminateExistingDiscussions,
  shapeDiscordRow,
  eliminateExistingThreads,
} from "./utils.js";
import * as config from "./constants.js";
import {
  fetchThreads,
  filterThreads,
  fetchFirstMessage,
} from "./discord/index.js";
import { MessageDetails } from "./types.js";

const main = async () => {
  // Get the issues and discussions from GitHub
  const allIssues = await Promise.all(
    config.REPOS.map((repo) => fetchIssues(repo)),
  );
  const issues = allIssues.flat();
  const allDiscussions = await Promise.all(
    config.REPOS.map((repo) => fetchDiscussions(repo)),
  );
  const discussions = allDiscussions.flat();

  // Get the list from the spreadsheet
  const currentRowsInSheet = await getRows();

  // Check the spreadsheet's current values against the issues array and see
  // if there's anything new.
  const newIssues = eliminateExistingIssues(issues, currentRowsInSheet);

  if (newIssues.length < 1) {
    console.log(`🍻 No new GitHub issues`);
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
    console.log(`🍻 No new GitHub discussion`);
  } else {
    for (const discussion of newDisucssions) {
      let parsed = parseDiscussion(discussion);
      const summary = await summarizeDiscussionBody(parsed.notes);
      updateDiscussionBody(parsed, summary);
      writeNewRow(parsed);
    }
  }

  const threads = await fetchThreads();
  const filteredThreads = await filterThreads(threads);
  const shapedMessages: MessageDetails[] = await Promise.all(
    filteredThreads.map(async (thread) => {
      const messageDetails = await fetchFirstMessage(
        thread.parent_id,
        thread.id,
      );
      return shapeDiscordRow(thread.name, messageDetails);
    }),
  );

  const newThreads = eliminateExistingThreads(
    shapedMessages,
    currentRowsInSheet,
  );

  if (newThreads.length < 1) {
    console.log(`🍻 No new threads from Discord`);
  } else {
    for (const thread of newThreads) {
      writeNewRow({
        link: thread.url || "",
        createdAt: thread.createdAt || "",
        notes: await summarizeDiscordThreadContent(
          thread.threadName || "",
          thread.content,
        ),
        outcome: "",
        status: "OPEN",
      });
    }
  }
};

main();
