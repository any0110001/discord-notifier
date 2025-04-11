import axios from 'axios';

const DISCORD_API_BASE = 'https://discord.com/api';
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.JOB_POST_CHANNEL_ID;
const JOB_PINGS_CHANNEL_ID = process.env.JOB_PINGS_CHANNEL_ID;
const SERVER_ID = process.env.SERVER_ID;

export const handler = async () => {
  try {
    // Calculate the timestamp for 5 minutes ago
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    // Fetch active threads in the channel
    const response = await axios.get(`${DISCORD_API_BASE}/channels/${CHANNEL_ID}/threads/active`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    // Filter threads created in the last 5 minutes
    const newThreads = response.data.threads.filter(thread => {
      const createdAt = new Date(thread.thread_metadata.create_timestamp).getTime();
      return createdAt > fiveMinutesAgo;
    });

    // Notify the job-pings channel for each new thread
    for (const thread of newThreads) {
      await axios.post(`${DISCORD_API_BASE}/channels/${JOB_PINGS_CHANNEL_ID}/messages`, {
        content: `New thread created: https://discord.com/channels/${SERVER_ID}/${thread.id}`,
      }, {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      });
    }

    return { status: 'Success', newThreads: newThreads.length };
  } catch (error) {
    console.error('Error polling Discord API:', error);
    return { status: 'Error', error: error.message };
  }
}