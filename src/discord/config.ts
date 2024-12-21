import dotenv from "dotenv";
dotenv.config();

export const headers = {
  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
};
