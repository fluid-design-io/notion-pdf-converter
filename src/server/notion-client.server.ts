import {
	APIErrorCode,
	Client,
	isNotionClientError,
	type NotionClientError,
} from "@notionhq/client";

import { refreshNotionTokens } from "@/server/notion-oauth";
import {
	clearNotionConnection,
	getNotionConnection,
} from "@/server/notion-session";
import { setNotionConnection } from "@/server/notion-session";

export const NOTION_RECONNECT_REQUIRED_MESSAGE =
	"Your Notion connection expired. Reconnect Notion and try again.";

function isUnauthorizedError(error: unknown): error is NotionClientError {
	return isNotionClientError(error) && error.code === APIErrorCode.Unauthorized;
}

export async function withNotionClient<T>(
	run: (client: Client) => Promise<T>,
): Promise<T> {
	const connection = await getNotionConnection();
	if (!connection) {
		throw new Error("Notion is not connected. Connect Notion and try again.");
	}

	const execute = async (authToken: string) => {
		const client = new Client({ auth: authToken });
		return run(client);
	};

	try {
		return await execute(connection.accessToken);
	} catch (error) {
		if (!isUnauthorizedError(error)) {
			throw error;
		}

		try {
			const refreshed = await refreshNotionTokens(connection);
			await setNotionConnection(refreshed);
			return await execute(refreshed.accessToken);
		} catch {
			await clearNotionConnection();
			throw new Error(NOTION_RECONNECT_REQUIRED_MESSAGE);
		}
	}
}

export async function readNotionConnectionStatus() {
	const connection = await getNotionConnection();
	return {
		connected: Boolean(connection),
		workspaceName: connection?.workspaceName,
		workspaceIcon: connection?.workspaceIcon,
		workspaceId: connection?.workspaceId,
		ownerType: connection?.ownerType,
	};
}

export async function disconnectNotionSession() {
	await clearNotionConnection();
	return { ok: true as const };
}
