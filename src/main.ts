import {Plugin} from 'obsidian';
import {AIStudioSettings, AIStudioSettingTab, DEFAULT_SETTINGS} from "./settings";
import ChatView from "./app/ChatView";

export default class AIStudio extends Plugin {
	settings: AIStudioSettings;

	async onload() {
		await this.loadSettings();
		this.registerView("chat", (leaf) => new ChatView(leaf, this.settings))
		this.registerExtensions(["chat"], "chat");
		this.addSettingTab(new AIStudioSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem(item =>
					item.setTitle("New chat").setIcon("message").onClick(async () => {
						const path = file?.path ?? "";
						const newFile = await this.app.vault.create(`${path}/New Chat.chat`, JSON.stringify({
							messages: []
						}))

						await this.app.workspace.getLeaf().openFile(newFile)
					})
				)
			})
		)


	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<AIStudioSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
