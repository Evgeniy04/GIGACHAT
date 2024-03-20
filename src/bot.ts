import { Bot, Composer, session } from "grammy";
import { ISession, MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import path from "path";
import { MyContext } from "./types/MyContext";
import { startCommand } from "./commands/start";
import { chatEvent } from "./events/chat";
dotenv.config();
process.env.NODE_EXTRA_CA_CERTS = path.resolve(__dirname, "dir", "with", "certs");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const BOT_TOKEN: string | undefined = process.env.BOT_TOKEN;
const GIGACHAT_AUTHORIZATION_DATA: string | undefined = process.env.GIGACHAT_AUTHORIZATION_DATA;

if (!BOT_TOKEN || !GIGACHAT_AUTHORIZATION_DATA) {
	throw new Error("BOT_TOKEN or GIGACHAT_AUTHORIZATION_DATA not found in .env file");
}
const bot = new Bot<MyContext>(BOT_TOKEN);

async function bootstrap() {
	const client = new MongoClient("mongodb://localhost:27017");
	const db = client.db("gigachat-bot");
	const sessions = db.collection<ISession>("session");

	bot.use(async (ctx, next) => {
		ctx.gigachat = {};
		await next();
	});
	bot.use(
		session({
			type: "multi",
			user: {
				storage: new MongoDBAdapter({ collection: sessions }),
				initial: () => ({}),
				getSessionKey(ctx) {
					if (ctx.chat?.type === "private") return ctx.from?.id.toString();
				},
			},
			chat: {
				storage: new MongoDBAdapter({ collection: sessions }),
				initial: () => ({
					numberPreviousMessages: 0,
					tokenBalance: 10000,
				}),
				getSessionKey(ctx) {
					if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup")
						return ctx.chat?.id.toString();
				},
			},
		})
	);
}
bootstrap();

// Initial commands and events
const commands: Composer<MyContext>[] = [startCommand];
for (const command of commands) {
	bot.use(command);
}

const events: Composer<MyContext>[] = [chatEvent];
for (const event of events) {
	bot.use(event);
}

bot.api.setMyCommands([
	{ command: "start", description: "Запустить бота" },
	{ command: "help", description: "Посмотреть информацию о боте" },
]);

bot.start();

export { GIGACHAT_AUTHORIZATION_DATA };
