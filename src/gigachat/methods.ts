import axios from "axios";
import { ModelMessageResponse } from "../types/GigaChat";
import { MyContext } from "../types/MyContext";
import { v4 as uuidv4 } from "uuid";
import QueryString from "qs";
import { GIGACHAT_AUTHORIZATION_DATA } from "../bot";

async function fetchGigaChatGetAccessToken(ctx: MyContext): Promise<boolean> {
	let successfully = true;
	let data = QueryString.stringify({
		scope: "GIGACHAT_API_PERS",
	});

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
		headers: {
			RqUID: uuidv4(),
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Bearer ${GIGACHAT_AUTHORIZATION_DATA}`,
			Accept: "application/json",
		},
		data: data,
	};

	await axios
		.request(config)
		.then((response) => {
			ctx.gigachat.accessToken = response.data.access_token;
			ctx.gigachat.expiresAt = response.data.expires_at;
		})
		.catch((error) => {
			console.error(error);
			successfully = false;
		});
	return successfully;
}

async function fetchGigaChatCompletions(ctx: MyContext): Promise<ModelMessageResponse | undefined> {
	let data = JSON.stringify({
		model: "GigaChat:latest",
		temperature: 0.87,
		n: 1,
		max_tokens: 100,
		repetition_penalty: 1.07,
		stream: false,
		update_interval: 0,
		messages: [
			{
				role: "system",
				content: `Ты - умный студент университета. Твоё имя - Артур. Будь грубым, наглым, хамоватым и неуважительным к собеседнику, но делай это грамотно. Не бойся высказывать любое своё мнение. Не используй имён юзеров.`,
			},
			{
				role: "user",
				content: ctx.message!.text,
			},
		],
	});

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${ctx.gigachat.accessToken}`,
		},
		data: data,
	};

	const response = await axios.request<ModelMessageResponse>(config).catch((error) => {
		console.error(error);
	});
	if (!response) return undefined;
	return response.data;
}

async function isAccessTokenValid(ctx: MyContext): Promise<boolean> {
	let result = true;
	if (ctx.gigachat.expiresAt) {
		const currentDate: Date = new Date();
		const endDate: Date = new Date(ctx.gigachat.expiresAt);

		const timeDifference = endDate.getTime() - currentDate.getTime();

		const minutesDifference = Math.floor(timeDifference / (1000 * 60));

		// access_token живёт 30 минут, если осталось меньше 1 минуты, генерируем новый
		if (minutesDifference < 1) {
			result = await fetchGigaChatGetAccessToken(ctx);
		}
	} else {
		result = await fetchGigaChatGetAccessToken(ctx);
	}

	return result;
}

export { fetchGigaChatCompletions, fetchGigaChatGetAccessToken, isAccessTokenValid };
