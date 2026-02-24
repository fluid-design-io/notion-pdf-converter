import { createServerFn } from "@tanstack/react-start";
import { getNotionOAuthRedirectUriForRequest } from "@/server/env";
import {
	buildAuthStatusHref,
	buildNotionAuthorizeUrl,
	exchangeCodeForTokens,
	NotionOAuthError,
	sanitizeReturnTo,
} from "@/server/notion-oauth";
import {
	consumePendingNotionOAuthState,
	setNotionConnection,
	setPendingNotionOAuthState,
} from "@/server/notion-session";

export const beginNotionOAuth = createServerFn({ method: "GET" })
	.inputValidator((input: { returnTo?: string } | undefined) => ({
		returnTo:
			input && typeof input.returnTo === "string" ? input.returnTo : undefined,
	}))
	.handler(async ({ data }) => {
		const state = crypto.randomUUID();
		const returnTo = sanitizeReturnTo(data.returnTo);
		const redirectUri = getNotionOAuthRedirectUriForRequest();

		await setPendingNotionOAuthState(state, returnTo);

		return {
			href: buildNotionAuthorizeUrl({
				state,
				redirectUri,
			}),
		};
	});

export const completeNotionOAuth = createServerFn({ method: "GET" })
	.inputValidator(
		(
			input:
				| {
						code?: string;
						state?: string;
						error?: string;
				  }
				| undefined,
		) => ({
			code: input && typeof input.code === "string" ? input.code : undefined,
			state: input && typeof input.state === "string" ? input.state : undefined,
			error: input && typeof input.error === "string" ? input.error : undefined,
		}),
	)
	.handler(async ({ data }) => {
		console.log("[completeNotionOAuth] data", data);
		if (data.error) {
			await consumePendingNotionOAuthState();
			return { href: buildAuthStatusHref("denied") };
		}

		const pending = await consumePendingNotionOAuthState();

		if (!data.code) {
			return { href: buildAuthStatusHref("error", { reason: "missing_code" }) };
		}

		if (!pending || !data.state || pending.value !== data.state) {
			return {
				href: buildAuthStatusHref("error", { reason: "invalid_state" }),
			};
		}

		try {
			const redirectUri = getNotionOAuthRedirectUriForRequest();
			const connection = await exchangeCodeForTokens({
				code: data.code,
				redirectUri,
			});

			await setNotionConnection(connection);

			const successTarget = new URL(
				`http://localhost${sanitizeReturnTo(pending.returnTo)}`,
			);
			successTarget.searchParams.set("notionAuth", "connected");

			return {
				href: `${successTarget.pathname}${successTarget.search}${successTarget.hash}`,
			};
		} catch (error) {
			const reason =
				error instanceof NotionOAuthError ? error.code : "token_exchange";
			return {
				href: buildAuthStatusHref("error", { reason }),
			};
		}
	});
