import { graphql } from "@octokit/graphql";
import dotenv from "dotenv";
dotenv.config();

export const client = graphql.defaults({
  headers: { authorization: `token ${process.env.GH_TOKEN}` },
});

export const issueQuery = `
  query($owner: String!, $repo: String!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      issues(first: $first, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          id
          body
          url
          createdAt
          state
        }
      }
    }
  }
`;

export const discussionQuery = `
  query($owner: String!, $repo: String!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      discussions(first: $first, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          id
          title
          body
          url
          createdAt
          isAnswered
        }
      }
    }
  }
`;
