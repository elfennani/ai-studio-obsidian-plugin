import {Component} from "obsidian";
import {createContext, useContext} from "react";

export const ComponentContext = createContext<Component | undefined>(undefined);

export const useComponent = (): Component | undefined => useContext(ComponentContext)
