import {Bot} from "grammy";
import OpenAI from "openai";

export const {

    // Telegram bot token from t.me/BotFather
    TELEGRAM_BOT_TOKEN: token,

    // Secret token to validate incoming updates
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()

} = process.env;

// Default grammY bot instance
export const bot = new Bot(token);

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const safe = bot.errorBoundary(console.error)

safe.on(":text", async ctx => {
    const {results = []} = await openai.moderations.create({input: ctx.msg.text})
    if (results.some(({flagged} = {}) => flagged)) return ctx.react("🙈")
});
