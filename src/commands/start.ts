import { Composer, InlineKeyboard } from "grammy";
import { MyContext } from "../types/MyContext";

const textStart = `<b>Привет, меня зовут Артур.</b>\n\nЯ тот парень, который всегда готов поднять тебе настроение, даже если для этого придется немного похулиганить. Не боюсь высказать свое мнение, даже если оно может кого-то задеть. Но я не из тех, кто любит ссориться или обижать людей. Просто я такой, какой есть, и мне нравится быть самим собой.\n\n[в чатах]\n - Чтобы я ответил, достаточно обратиться ко мне по имени.\n - Иногда я сам отвечаю на сообщения в чате, если там нахожусь.\n\n<b><i>Начиная работу с ботом, вы берете на себя ответственность за соблюдение законодательства РФ и общепризнанных правил этики.</i>\nИспользование бота допускается только лицами, достигшими совершеннолетнего возраста. <i>(18+)</i></b>`;

const startCommand = new Composer<MyContext>();
const inlineKeyboardTokenInformation = new InlineKeyboard().text(
	"Почему я долго не отвечаю?",
	"token-information"
);
const inlineKeyboardBackToHelp = new InlineKeyboard().text("Назад", "back-to-start");

startCommand.command(["start", "help"], async (ctx) => {
	await ctx.reply(textStart, {
		parse_mode: "HTML",
		reply_markup: inlineKeyboardTokenInformation,
	});
});

startCommand.callbackQuery("token-information", async (ctx) => {
	await ctx.editMessageText(
		`Ну, братан, ты же знаешь, что я не особо люблю всякие там токены и прочую хрень. Но, блин, жизнь такая штука, что приходится подстраиваться под неё.\n\nМои сообщения, сгенерированные нейросетью - <b>платные</b>. Каждое сообщение, в среднем, забирает от <b>100</b> до <b>150</b> токенов. Так вот, если у меня их не будет, я превращусь в овоща.\n\n<b>Проще говоря, токены - моя энергия. На каждый чат выделено 10к бесплатных токенов.</b>`,
		{ parse_mode: "HTML", reply_markup: inlineKeyboardBackToHelp }
	);
});
startCommand.callbackQuery("back-to-start", async (ctx) => {
	await ctx.editMessageText(textStart, {
		parse_mode: "HTML",
		reply_markup: inlineKeyboardTokenInformation,
	});
});

export { startCommand };
