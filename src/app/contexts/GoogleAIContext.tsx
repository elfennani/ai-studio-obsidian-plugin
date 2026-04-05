import {createContext, use} from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import {GoogleGenAI} from "@google/genai";
import {SettingsContext} from "./SettingsContext";

export const GoogleAIContext = createContext<GoogleGenAI>(undefined as unknown as GoogleGenAI)

export const GoogleAIProvider = ({children}) => {
	const settings = use(SettingsContext)
	const apiKey = settings.apiKey
	const googleGenAi = new GoogleGenAI({apiKey})

	return (
		<GoogleAIContext value={googleGenAi}>
			{children}
		</GoogleAIContext>
	)
}
