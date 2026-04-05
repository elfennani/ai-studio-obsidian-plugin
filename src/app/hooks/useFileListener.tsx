import {useFile} from "../contexts/FileContext";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import {useApp} from "../contexts/AppContext";
import {Chat} from "../types/Chat";
import {TAbstractFile} from "obsidian";

const useFileListener = () => {
	const file = useFile()
	const app = useApp()
	const query = useQuery({
		queryKey: ["file", file?.path],
		queryFn: async () => {
			const content = await app!.vault.read(file!)

			return JSON.parse(content) as Chat
		},
		enabled: !!file && !!app
	})

	useEffect(() => {
		if (!app || !file) return;
		const modifyEvent = app.vault.on("modify", async (f: TAbstractFile) => {
			if (f.path == file.path) {
				await query.refetch()
			}
		})
		const renamedEvent = app.vault.on("rename", async (f: TAbstractFile) => {
			if (f.path == file.path) {
				await query.refetch()
			}
		})

		return () => {
			app.vault.offref(modifyEvent)
			app.vault.offref(renamedEvent)
		}
	}, [file, app])

	return query
}

export default useFileListener;
