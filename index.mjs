import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DISCORD_API_BASE = 'https://discord.com/api';
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.JOB_POST_CHANNEL_ID;
const JOB_PINGS_CHANNEL_ID = process.env.JOB_PINGS_CHANNEL_ID;

const timestampFilePath = path.resolve('/tmp/var.json');

const readLastTimestamp = () => {
  try {
    const data = fs.readFileSync(timestampFilePath, 'utf8');
    return JSON.parse(data).lastCheckedTimestamp;
  } catch (err) {
    console.warn('No existing timestamp file, using current time as default');
    return Date.now();
  }
};

const writeLastTimestamp = (timestamp) => {
  fs.writeFileSync(timestampFilePath, JSON.stringify({ lastCheckedTimestamp: timestamp }), 'utf8');
};

export const handler = async () => {
  try {
    const lastCheckedTimestamp = readLastTimestamp();

    if (lastCheckedTimestamp !== 0){
        // Fetch active threads in the channel
        const response = await axios.get(`${DISCORD_API_BASE}/channels/${CHANNEL_ID}/threads/active`, {
        headers: {
            Authorization: `Bot ${BOT_TOKEN}`,
        },
        });

        const newThreads = response.data.threads.filter(thread => {
        const createdAt = new Date(thread.timestamp).getTime();
        return createdAt > lastCheckedTimestamp;
        });

        // Notify job-pings channel for each new thread
        for (const thread of newThreads) {
        await axios.post(`${DISCORD_API_BASE}/channels/${JOB_PINGS_CHANNEL_ID}/messages`, {
            content: `New thread created: [${thread.name}](${thread.url})`,
        }, {
            headers: {
            Authorization: `Bot ${BOT_TOKEN}`,
            },
        });
        }
    }

    // Update the timestamp in the file
    writeLastTimestamp(Date.now());

    return { status: 'Success', message: 'Checked for new threads and updated timestamp.' };
  } catch (error) {
    console.error('Error polling Discord API:', error);
    return { status: 'Error', error: error.message };
  }
};
