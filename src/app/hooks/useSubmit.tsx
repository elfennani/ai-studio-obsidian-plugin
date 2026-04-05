import {use} from "react";
import {GoogleAIContext} from "../contexts/GoogleAIContext";
import {useMutation} from "@tanstack/react-query";
import {Chat} from "../types/Chat";
import {useFile} from "../contexts/FileContext";
import {useApp} from "../contexts/AppContext";
import {v4} from "uuid";

type SubmitParams = {
	chat: Chat,
	message: string,
}

const useSubmit = () => {
	const ai = use(GoogleAIContext)
	const file = useFile()
	const app = useApp()

	return useMutation({
		mutationFn: async ({chat: {messages}, message}: SubmitParams) => {
			const chat = ai.chats.create({
				model: "gemini-3.1-pro-preview",
				history: messages.map(msg => ({
					role: msg.role,
					parts: [{text: msg.content}]
				})),
			});

			let newChat: Chat = {
				messages: [
					...messages,
					{
						id: v4(),
						role: "user",
						content: message,
						createdAt: new Date().toISOString(),
					},
				]
			}

			// Create response message
			let responseMessage = {
				id: v4(),
				role: "model",
				content: "",
				createdAt: new Date().toISOString(),
			}

			void app!.vault.modify(file!, JSON.stringify({
				...newChat,
				messages: [...newChat.messages, responseMessage]
			}))

			const stream = await chat.sendMessageStream({
				message,
			});

			let lastUpdate = 0
			for await (const chunk of stream) {
				responseMessage = {
					...responseMessage,
					content: responseMessage.content + chunk.text
				}

				if (Date.now() - lastUpdate > 100) {
					lastUpdate = Date.now()
					void app!.vault.modify(file!, JSON.stringify({
						...newChat,
						messages: [...newChat.messages, responseMessage]
					}))
				}
			}

			void app!.vault.modify(file!, JSON.stringify({
				...newChat,
				messages: [...newChat.messages, responseMessage]
			}))
		}
	})
}

export default useSubmit;
