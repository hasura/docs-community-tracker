import axios from "axios";
import { Message, MessageDetails, Thread } from "../types.js";
import { headers } from "./config.js";
import { CHANNEL_IDs, GUILD_ID, API_BASE } from "../constants.js";
import { sortThreads } from "../utils.js";

// fetchThreads() grabs all the active threads in our server
export async function fetchThreads(): Promise<Thread[]> {
  const response = await axios.get(
    `${API_BASE}/guilds/${GUILD_ID}/threads/active`,
    {
      headers,
    },
  );

  if (response.status !== 200) {
    throw new Error("Error retrieving guild threads");
  }

  return response.data.threads as Thread[];
}

// filterThreads() returns only the threads that are in the channels list (v2 and v3 help forums and promptql)
// and also ensures we're only grabbing the last 30 days
export async function filterThreads(threads: Thread[]): Promise<Thread[]> {
  let thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentThreads = threads.filter((thread) => {
    const isInChannel = CHANNEL_IDs.includes(thread.parent_id);
    const createdAt = thread.thread_metadata?.create_timestamp
      ? new Date(thread.thread_metadata.create_timestamp)
      : null;
    const isRecent = createdAt ? createdAt >= thirtyDaysAgo : false;

    return isInChannel && isRecent;
  });

  sortThreads(recentThreads);

  return recentThreads;
}

// fetchFirstMessage() gets the first message in the thread
export async function fetchFirstMessage(
  parentId: string,
  threadId: string,
): Promise<MessageDetails> {
  try {
    const response = await axios.get(
      `${API_BASE}/channels/${threadId}/messages`,
      {
        headers,
      },
    );

    if (response.status !== 200) {
      throw new Error(`Error retrieving messages for thread ${threadId}`);
    }

    const messages: Message[] = response.data;
    // Order is backwards...we need the last item in the array
    const content = messages[messages.length - 1].content;
    const messageId = messages[messages.length - 1].id;
    const createdAt = messages[messages.length - 1].timestamp;

    return {
      channelId: parentId,
      messageId,
      content,
      createdAt,
    };
  } catch (error) {
    console.error(
      `Error fetching first message for thread ${threadId}:`,
      error,
    );
    throw error;
  }
}
