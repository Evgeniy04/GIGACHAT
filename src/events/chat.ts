import { Composer } from "grammy";
import { MyContext } from "../types/MyContext";
import { fetchGigaChatCompletions, isAccessTokenValid } from "../gigachat/methods";

const chatEvent = new Composer<MyContext>();
chatEvent.hears(/(Артур|Артура|Артуру|Артуром|Артуре)/i, async (ctx: MyContext) => {
	if (ctx.chat && ctx.chat.type !== "supergroup" && ctx.chat.type !== "group") return;

	if (!(await isAccessTokenValid(ctx))) {
		return console.error("Access Token is't valid!");
	}
	if (ctx.session.chat.tokenBalance < 100) {
		return await ctx.reply("Я проголодался и хочу жрать! 😒");
	}

	const data = await fetchGigaChatCompletions(ctx);
	if (!data) {
		return;
	}

	await ctx.reply(data.choices[0].message.content, {
		reply_parameters: { message_id: ctx.message!.message_id },
	});

	ctx.session.chat.tokenBalance -= data.usage.total_tokens;
});

chatEvent.on("message:text", async (ctx: MyContext) => {
	if (ctx.chat && ctx.chat.type !== "supergroup" && ctx.chat.type !== "group") return;

	const numberPreviousMessages = ++ctx.session.chat.numberPreviousMessages;

	if (
		numberPreviousMessages > 5 + Math.floor(Math.random() * 10) &&
		ctx.message!.text!.length > 7
	) {
		if (!(await isAccessTokenValid(ctx))) {
			return console.error("Access Token is't valid!");
		}
		if (ctx.session.chat.tokenBalance < 100) {
			return await ctx.reply("Я проголодался и хочу жрать! 😒");
		}

		const data = await fetchGigaChatCompletions(ctx);
		if (!data) {
			return;
		}

		await ctx.reply(data.choices[0].message.content, {
			reply_parameters: { message_id: ctx.message!.message_id },
		});

		ctx.session.chat.tokenBalance -= data.usage.total_tokens;
		ctx.session.chat.numberPreviousMessages = 0;
		return;
	}
});

export { chatEvent };
