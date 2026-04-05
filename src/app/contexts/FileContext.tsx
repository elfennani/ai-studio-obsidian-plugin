import {createContext, useContext} from 'react';
import {TFile} from 'obsidian';

export const FileContext = createContext<TFile | undefined>(undefined);
export const useFile = (): TFile | undefined => {
	return useContext(FileContext);
};
