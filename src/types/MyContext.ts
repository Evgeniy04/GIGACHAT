import { Context, SessionFlavor } from "grammy";
import { GigaChat } from "./GigaChat";
import { SessionData } from "./SessionData";

type MyContext = Context & SessionFlavor<SessionData> & GigaChat;

export type { MyContext };
