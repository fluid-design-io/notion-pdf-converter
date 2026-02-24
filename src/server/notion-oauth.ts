import type { NotionConnection } from "@/server/notion-session";
import { getServerEnv } from "@/server/env";

const NOTION_AUTHORIZE_ENDPOINT = "https://api.notion.com/v1/oauth/authorize";
const NOTION_TOKEN_ENDPOINT = "https://api.notion.com/v1/oauth/token";

const MAX_CONNECTION_JSON_BYTES = 2800;

type NotionOwnerResponse =
	| { workspace: true }
	| {
			type?: "user";
			id?: string;
	  };

type NotionTokenResponse = {
	access_token: string;
	refresh_token: string;
	bot_id: string;
	owner: NotionOwnerResponse;
	workspace_id: string;
	workspace_name?: string | null;
	workspace_icon?: string | null;
};

type NotionOAuthErrorResponse = {
	error?: string;
	error_description?: string;
	message?: string;
};

export class NotionOAuthError extends Error {
	constructor(
		message: string,
		public readonly code:
			| "invalid_state"
			| "missing_code"
			| "token_exchange"
			| "refresh_failed"
			| "session_too_large",
	) {
		super(message);
		this.name = "NotionOAuthError";
	}
}

export function sanitizeReturnTo(input: unknown) {
	if (typeof input !== "string") return "/";
	if (!input.startsWith("/")) return "/";
	if (input.startsWith("//")) return "/";
	return input;
}

export function buildAuthStatusHref(
	status: "connected" | "required" | "denied" | "error" | "reconnect_required",
	options?: {
		reason?: string;
		returnTo?: string;
	},
) {
	const url = new URL("http://localhost/");
	url.searchParams.set("notionAuth", status);
	if (options?.reason) url.searchParams.set("reason", options.reason);
	if (options?.returnTo) url.searchParams.set("returnTo", sanitizeReturnTo(options.returnTo));
	return `${url.pathname}${url.search}`;
}

export function buildNotionAuthorizeUrl(params: {
	state: string;
	redirectUri: string;
}) {
	const env = getServerEnv();
	const url = new URL(NOTION_AUTHORIZE_ENDPOINT);
	url.searchParams.set("owner", "user");
	url.searchParams.set("client_id", env.NOTION_OAUTH_CLIENT_ID);
	url.searchParams.set("redirect_uri", params.redirectUri);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("state", params.state);
	return url.toString();
}

function getBasicAuthHeader() {
	const env = getServerEnv();
	const encoded = Buffer.from(
		`${env.NOTION_OAUTH_CLIENT_ID}:${env.NOTION_OAUTH_CLIENT_SECRET}`,
	).toString("base64");
	return `Basic ${encoded}`;
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
	try {
		return (await response.json()) as T;
	} catch {
		return null;
	}
}

function normalizeNotionConnection(
	payload: NotionTokenResponse,
	existing?: NotionConnection,
): NotionConnection {
	const owner = payload.owner;
	const ownerType: "workspace" | "user" = owner
		? owner && typeof owner === "object" && "workspace" in owner
			? "workspace"
			: "user"
		: (existing?.ownerType ?? "workspace");

	const ownerUserId =
		ownerType === "user" && owner && typeof owner === "object" && "id" in owner
			? (owner.id ?? existing?.ownerUserId)
			: existing?.ownerUserId;

	const connection: NotionConnection = {
		accessToken: payload.access_token,
		refreshToken: payload.refresh_token,
		botId: payload.bot_id ?? existing?.botId ?? "",
		workspaceId: payload.workspace_id ?? existing?.workspaceId ?? "",
		workspaceName: payload.workspace_name ?? existing?.workspaceName ?? undefined,
		workspaceIcon: payload.workspace_icon ?? existing?.workspaceIcon ?? undefined,
		ownerType,
		ownerUserId,
		connectedAt: existing?.connectedAt ?? Date.now(),
	};

	const bytes = new TextEncoder().encode(JSON.stringify(connection)).byteLength;
	if (bytes > MAX_CONNECTION_JSON_BYTES) {
		throw new NotionOAuthError(
			"Stored Notion connection is too large for cookie session storage. Migrate to database-backed token storage.",
			"session_too_large",
		);
	}

	return connection;
}

export async function exchangeCodeForTokens(params: {
	code: string;
	redirectUri: string;
}) {
	const response = await fetch(NOTION_TOKEN_ENDPOINT, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: getBasicAuthHeader(),
		},
		body: JSON.stringify({
			grant_type: "authorization_code",
			code: params.code,
			redirect_uri: params.redirectUri,
		}),
	});

	if (!response.ok) {
		const errorBody = await parseJsonResponse<NotionOAuthErrorResponse>(response);
		const errorMessage =
			errorBody?.error_description ?? errorBody?.message ?? errorBody?.error;
		throw new NotionOAuthError(
			errorMessage
				? `Notion token exchange failed: ${errorMessage}`
				: "Notion token exchange failed.",
			"token_exchange",
		);
	}

	const data = await parseJsonResponse<NotionTokenResponse>(response);
	if (!data?.access_token || !data.refresh_token) {
		throw new NotionOAuthError(
			"Notion token exchange returned an invalid response.",
			"token_exchange",
		);
	}

	return normalizeNotionConnection(data);
}

export async function refreshNotionTokens(existing: NotionConnection) {
	const response = await fetch(NOTION_TOKEN_ENDPOINT, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: getBasicAuthHeader(),
		},
		body: JSON.stringify({
			grant_type: "refresh_token",
			refresh_token: existing.refreshToken,
		}),
	});

	if (!response.ok) {
		const errorBody = await parseJsonResponse<NotionOAuthErrorResponse>(response);
		const errorMessage =
			errorBody?.error_description ?? errorBody?.message ?? errorBody?.error;
		throw new NotionOAuthError(
			errorMessage
				? `Notion token refresh failed: ${errorMessage}`
				: "Notion token refresh failed.",
			"refresh_failed",
		);
	}

	const data = await parseJsonResponse<NotionTokenResponse>(response);
	if (!data?.access_token || !data.refresh_token) {
		throw new NotionOAuthError(
			"Notion token refresh returned an invalid response.",
			"refresh_failed",
		);
	}

	return normalizeNotionConnection(data, existing);
}
