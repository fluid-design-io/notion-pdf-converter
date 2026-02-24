import { getServerEnv, isProductionEnv } from "@/server/env";

import { getSession, updateSession } from "@tanstack/react-start/server";

export type NotionConnection = {
	accessToken: string;
	refreshToken: string;
	botId: string;
	workspaceId: string;
	workspaceName?: string;
	workspaceIcon?: string;
	ownerType: "workspace" | "user";
	ownerUserId?: string;
	connectedAt: number;
};

export type PendingNotionOAuthState = {
	value: string;
	returnTo: string;
	createdAt: number;
};

export type AppSessionData = {
	notionConnection?: NotionConnection;
	notionOAuthState?: PendingNotionOAuthState;
};

export const appSessionConfig = {
	name: "papyr",
	password: getServerEnv().APP_SESSION_SECRET,
	maxAge: 60 * 60 * 24 * 30,
	cookie: {
		httpOnly: true,
		sameSite: "lax" as const,
		path: "/",
		secure: isProductionEnv(),
	},
};

export async function getAppSession() {
	return getSession<AppSessionData>(appSessionConfig);
}

export async function getNotionConnection() {
	const session = await getAppSession();
	return session.data.notionConnection;
}

export async function setNotionConnection(connection: NotionConnection) {
	await updateSession<AppSessionData>(appSessionConfig, (oldData) => ({
		...oldData,
		notionConnection: connection,
	}));
}

export async function clearNotionConnection() {
	await updateSession<AppSessionData>(appSessionConfig, (oldData) => ({
		...oldData,
		notionConnection: undefined,
	}));
}

export async function setPendingNotionOAuthState(
	value: string,
	returnTo: string,
) {
	await updateSession<AppSessionData>(appSessionConfig, (oldData) => ({
		...oldData,
		notionOAuthState: {
			value,
			returnTo,
			createdAt: Date.now(),
		},
	}));
}

export async function consumePendingNotionOAuthState() {
	const session = await getAppSession();
	const pending = session.data.notionOAuthState;

	await updateSession<AppSessionData>(appSessionConfig, (oldData) => ({
		...oldData,
		notionOAuthState: undefined,
	}));

	return pending;
}
