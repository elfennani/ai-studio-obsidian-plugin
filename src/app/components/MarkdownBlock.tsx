import {useEffect, useRef} from "react";
import {MarkdownRenderer} from "obsidian";
import {useApp} from "../contexts/AppContext";
import {useComponent} from "../contexts/ComponentContext";

interface MarkdownBlockProps {
	text: string;
}

export function MarkdownBlock({text}: MarkdownBlockProps) {
	const ref = useRef<HTMLDivElement>(null);
	const app = useApp()
	const component = useComponent()

	useEffect(() => {
		if (!ref.current || !app || !component) return;

		ref.current.empty();
		// Render the markdown string
		void MarkdownRenderer.render(app, text, ref.current, "", component)
	}, [text]);

	return <div ref={ref} className="markdown-block"></div>;
}
