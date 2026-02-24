import { createFileRoute, redirect } from "@tanstack/react-router";
import { completeNotionOAuth } from "@/server/notion-auth-flow";

export const Route = createFileRoute("/oauth/callback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const search = new URL(request.url).searchParams;
				const code = search.get("code") ?? undefined;
				const state = search.get("state") ?? undefined;
				const error = search.get("error") ?? undefined;
				const { href } = await completeNotionOAuth({
					data: { code, state, error },
				});
				throw redirect({
					href,
					statusCode: 302,
				});
			},
		},
	},
});
