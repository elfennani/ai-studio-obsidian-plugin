import {useFile} from "./contexts/FileContext";
import {MarkdownBlock} from "./components/MarkdownBlock";
import useFileListener from "./hooks/useFileListener";
import useSubmit from "./hooks/useSubmit";
import {useState} from "react";

const App = () => {
	const file = useFile()
	const {data: chat, isSuccess} = useFileListener()
	const {mutate, isPending} = useSubmit()
	const [message, setMessage] = useState<string>('')

	function handleSubmit() {
		mutate({
			message,
			chat: chat!
		})
	}

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
				<div key={index} className="chat-message">
					<MarkdownBlock text={item.content}/>
				</div>
			))}
			<div className="chat-footer">
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
	);
};
export default App;
