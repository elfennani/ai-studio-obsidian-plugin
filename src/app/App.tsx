import {useFile} from "./contexts/FileContext";
import useFileListener from "./hooks/useFileListener";
import useSubmit from "./hooks/useSubmit";
import {useEffect, useState} from "react";
import ChatMessage from "./components/ChatMessage";
import {Notice} from "obsidian";

const App = () => {
	const file = useFile()
	const {data: chat, isSuccess} = useFileListener()
	const {mutate, isPending} = useSubmit()
	const [message, setMessage] = useState<string>('')

	function handleSubmit() {
		if (!message.trim()) {
			new Notice("Message cannot be empty!")
			return;
		}
		mutate({
			message: message.trim(),
			chat: chat!
		})
		setMessage('')
	}

	useEffect(() => {
		const lastUserMessage = chat?.messages?.filter(m => m.role == "user")?.last()
		if (lastUserMessage)
			document
				.getElementById(`chat-message-${lastUserMessage.id}`)
				?.scrollIntoView({behavior: "auto"})
	}, [chat])

	if (!isSuccess)
		return (
			<div className="container chat-view">
				Loading...
			</div>
		)

	return (
		<div className="container chat-view">
			<h1>{file?.basename}</h1>

			{chat?.messages.map((item, index) => (
				<ChatMessage key={item.id} message={item}/>
			))}
			<div className="chat-footer ">
				<div className="container">
					<textarea
						className="chat-input"
						placeholder="Type something..."
						disabled={isPending}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button className="primary-action-button" disabled={isPending} onClick={handleSubmit}>
						{isPending ? "Loading..." : "Send"}
					</button>
				</div>
			</div>
		</div>
	);
};
export default App;
