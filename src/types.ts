// Google Sheets
export type SheetRow = {
  link: string;
  createdAt: string;
  notes: string;
  outcome: string;
  status: string;
};

// GitHub
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

// Discord
export type Channel = {
  id: string;
  type: number;
  name: string;
  topic?: string;
  guild_id?: string;
};

export type Thread = {
  id: string;
  guild_id?: string;
  parent_id: string;
  owner_id: string;
  name: string;
  type: number;
  last_message_id?: string;
  message_count?: number;
  member_count?: number;
  rate_limit_per_user?: number;
  archived: boolean;
  locked?: boolean;
  create_timestamp?: string;
  auto_archive_duration: number;
  thread_metadata?: {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: string;
    create_timestamp: string;
    locked?: boolean;
  };
  member?: {
    id?: string;
    user_id?: string;
    join_timestamp: string;
    flags: number;
  };
};

export type MessageDetails = {
  channelId: string;
  messageId: string;
  content: string;
  threadName?: string;
  url?: string;
  createdAt?: string;
};

export type Message = {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  };
  content: string;
  timestamp: string;
  edited_timestamp?: string;
  mention_roles?: string[];
  mentions: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
  }[];
  attachments: {
    id: string;
    filename: string;
    url: string;
    proxy_url: string;
    size: number;
  }[];
  embeds: {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: { text: string; icon_url?: string };
    image?: { url: string };
    thumbnail?: { url: string };
    author?: { name: string; url?: string; icon_url?: string };
    fields?: { name: string; value: string; inline?: boolean }[];
  }[];
  reactions?: {
    emoji: {
      id?: string;
      name: string;
    };
    count: number;
    me: boolean;
  }[];
  pinned: boolean;
  type: number;
};
