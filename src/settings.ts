import {App, PluginSettingTab, Setting} from "obsidian";
import AIStudio from "./main";

export interface AIStudioSettings {
	apiKey: string;
}

export const DEFAULT_SETTINGS: AIStudioSettings = {
	apiKey: '',
}

export class AIStudioSettingTab extends PluginSettingTab {
	plugin: AIStudio;

	constructor(app: App, plugin: AIStudio) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setName('Google Gemini API Key')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));
	}
}
