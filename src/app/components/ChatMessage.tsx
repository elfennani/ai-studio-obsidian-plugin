import {Message} from "../types/Message";
import {MarkdownBlock} from "./MarkdownBlock";
import {useState} from "react";

type Props = {
	message: Message
};
const ChatMessage = ({message}: Props) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	if (isEditing)
		return <ChatMessageEditor message={message} onStopEditing={() => setIsEditing(false)}/>

	function handleEditing() {
		setIsEditing(true);
		setIsHovered(false)
	}

	return (
		<div
			id={`chat-message-${message.id}`}
			className="chat-message"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<span className="chat-message-role">{message.role}</span>
			{isHovered && (
				<div className="chat-message-action-list">
					<button onClick={handleEditing}>
						Edit
					</button>
					<button>
						Rerun
					</button>
					<button>
						Delete
					</button>
				</div>
			)}
			<MarkdownBlock text={message.content || "..."}/>
		</div>
	);
};

interface ChatMessageEditorProps {
	message: Message
	onStopEditing: () => void
}

const ChatMessageEditor = ({message, onStopEditing}: ChatMessageEditorProps) => {
	const [content, setContent] = useState(message.content);

	function handleEdit(){
		onStopEditing()
	}

	function handleRerun(){
		onStopEditing()
	}

	return (
		<div id={`chat-message-${message.id}`} className="chat-message chat-message-editor">
			<textarea
				className="chat-message-edit-area"
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<div className="chat-message-editor-footer">
				<button onClick={onStopEditing}>
					Cancel
				</button>
				<div className="spacer" />
				<button onClick={handleRerun}>
					Rerun
				</button>
				<button onClick={handleEdit}>
					Confirm
				</button>
			</div>
		</div>
	)
}

export default ChatMessage;
