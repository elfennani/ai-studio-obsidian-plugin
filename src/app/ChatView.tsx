import {Component, ItemView, TFile, ViewStateResult, WorkspaceLeaf} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {StrictMode} from "react";
import App from "./App";
import {AppContext} from "./contexts/AppContext";
import {FileContext} from "./contexts/FileContext";
import {ComponentContext} from "./contexts/ComponentContext";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./contexts/tanstack-query";
import {AIStudioSettings} from "../settings";
import {SettingsContext} from "./contexts/SettingsContext";
import {GoogleAIProvider} from "./contexts/GoogleAIContext";


type State = {
	file: string | null
}

class ChatView extends ItemView {
	root: Root | null = null;
	settings: AIStudioSettings;
	file: TFile | null;
	component: Component | null = null;

	constructor(leaf: WorkspaceLeaf, settings: AIStudioSettings) {
		super(leaf);
		this.settings = settings;
	}

	async setState(state: State, result: ViewStateResult) {
		await super.setState(state, result);

		if (state.file) {
			const f = this.app.vault.getAbstractFileByPath(state.file);
			if (f instanceof TFile) this.file = f;
		}

		this.render()
	}

	getViewType() {
		return "chat";
	}

	getState(): State {
		return {file: this.file?.path ?? null};
	}

	getDisplayText() {
		return this.file?.basename ?? "Chat";
	}

	onload() {
		super.onload();

		if (!this.file) {
			const state = this.leaf.getViewState().state as { file?: string };

			if (state?.file) {
				const f = this.app.vault.getAbstractFileByPath(state.file);
				if (f instanceof TFile) this.file = f;
			}
		}

		this.setComponent()
		this.render()
	}

	onunload() {
		super.onunload();
		this.component?.unload()
	}

	setComponent() {
		if (!this.component) {
			this.component = new Component();
			this.component?.load()
		}
	}

	async onOpen() {
		if (!this.file) {
			const state = this.leaf.getViewState().state as { file?: string };
			if (state?.file) {
				const f = this.app.vault.getAbstractFileByPath(state.file);
				if (f instanceof TFile) this.file = f;
			}
		}

		this.registerEvent(
			this.app.vault.on("rename", (file) => {
				if (file.path == this.file?.path) {
					// eslint-disable-next-line obsidianmd/no-tfile-tfolder-cast
					this.file = file as TFile;
					this.render()
				}
			})
		)

		this.render()
	}

	render() {
		if (!this.root)
			this.root = createRoot(this.contentEl);

		this.root.render(
			<StrictMode>
				<AppContext value={this.app}>
					<FileContext value={this.file ?? undefined}>
						<ComponentContext value={this.component ?? undefined}>
							<SettingsContext value={this.settings}>
								<GoogleAIProvider>
									<QueryClientProvider client={queryClient}>
										<App/>
									</QueryClientProvider>
								</GoogleAIProvider>
							</SettingsContext>
						</ComponentContext>
					</FileContext>
				</AppContext>
			</StrictMode>,
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}

export default ChatView;
