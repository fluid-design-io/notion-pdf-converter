import { Spinner } from "@/components/ui/spinner";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { beginNotionOAuth } from "@/server/notion-auth-flow";

export const Route = createFileRoute("/oauth/start")({
	component: () => <StartOAuthLoading />,
	loader: async ({ params }) => {
		const { href } = await beginNotionOAuth({
			data: { returnTo: "/" },
		});

		throw redirect({
			href,
			statusCode: 302,
		});
	},
});

function StartOAuthLoading() {
	return (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	);
}
