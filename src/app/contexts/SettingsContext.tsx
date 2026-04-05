import {createContext} from "react";
import {AIStudioSettings} from "../../settings";

export const SettingsContext = createContext<AIStudioSettings>(undefined as unknown as AIStudioSettings);
