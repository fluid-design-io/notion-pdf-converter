import { createServerFn } from "@tanstack/react-start";

export const getNotionConnectionStatus = createServerFn({ method: "GET" }).handler(
	async () => {
		const { readNotionConnectionStatus } = await import(
			"@/server/notion-client.server"
		);
		return readNotionConnectionStatus();
	},
);

export const disconnectNotion = createServerFn({ method: "POST" }).handler(
	async () => {
		const { disconnectNotionSession } = await import(
			"@/server/notion-client.server"
		);
		return disconnectNotionSession();
	},
);
