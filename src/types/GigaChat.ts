interface GigaChat {
	gigachat: {
		accessToken?: string;
		expiresAt?: number;
	};
}

interface ModelMessageResponse {
	choices: [
		{
			message: {
				role: string;
				content: string;
			};
			index: number;
			finish_reason: "stop" | "length" | "blacklist";
		}
	];
	created: number;
	model: string;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
		system_tokens: number;
	};
	object: string;
}
export { GigaChat, ModelMessageResponse };
