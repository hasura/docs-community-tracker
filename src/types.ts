export type SheetRow = {
  link: string;
  createdAt: string;
  notes: string;
  outcome: string;
  status: string;
};

export type Issue = {
  id: string;
  title: string;
  body: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  state: string;
  author: {
    login: string;
  };
};

export type GraphQLIssueResponse = {
  repository: {
    issues: {
      nodes: Issue[];
    };
  };
};

export type Discussion = {
  id: string;
  title: string;
  body: string;
  url: string;
  createdAt: string;
  isAnswered: string;
};

export type GraphQLDiscussionResponse = {
  repository: {
    discussions: {
      nodes: Discussion[];
    };
  };
};
