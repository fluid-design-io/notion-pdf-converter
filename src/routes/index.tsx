import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { parsePageId } from "@/lib/notion/utils";

import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	disconnectNotion,
	getNotionConnectionStatus,
} from "@/server/notion-client";

type IndexSearch = {
	notionAuth?: string;
	reason?: string;
	returnTo?: string;
};

export const Route = createFileRoute("/")({
	validateSearch: (search): IndexSearch => ({
		notionAuth:
			typeof search.notionAuth === "string" ? search.notionAuth : undefined,
		reason: typeof search.reason === "string" ? search.reason : undefined,
		returnTo: typeof search.returnTo === "string" ? search.returnTo : undefined,
	}),
	loader: async () => getNotionConnectionStatus(),
	component: App,
});

function App() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const connection = Route.useLoaderData();
	const [isDisconnecting, setIsDisconnecting] = useState(false);
	const safeReturnTo = sanitizeReturnToPath(search.returnTo);
	const connectHref =
		safeReturnTo === "/"
			? "/oauth/start"
			: `/oauth/start?returnTo=${encodeURIComponent(safeReturnTo)}`;
	const form = useForm({
		defaultValues: {
			url: "",
		},
		validators: {
			onSubmit: ({ value }) => {
				if (value.url.trim().length === 0) {
					return "Please provide a Notion URL.";
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			const trimmed = value.url.trim();
			if (!trimmed) return;
			const pageId = parsePageId(trimmed);
			if (!pageId) return;
			navigate({
				to: `/editor/${pageId}`,
			});
		},
	});

	const statusMessage = getAuthStatusMessage(search.notionAuth, search.reason);

	return (
		<div className="min-h-screen bg-background px-6 py-12 text-foreground">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
				<div className="space-y-2">
					<h1 className="font-semibold text-2xl">Notion to PDF</h1>
					<p className="text-muted-foreground text-sm">
						Connect your Notion workspace, then paste a page link to generate a
						PDF preview and customize export settings.
					</p>
				</div>

				{statusMessage ? (
					<Card size="sm">
						<CardContent className="flex items-center justify-between gap-3 py-1">
							<div className="flex items-center gap-2">
								<Badge
									variant={
										search.notionAuth === "error" ? "destructive" : "outline"
									}
								>
									Notion
								</Badge>
								<p className="text-xs">{statusMessage}</p>
							</div>
							{(search.notionAuth === "required" ||
								search.notionAuth === "reconnect_required") && (
								<Link
									to={connectHref}
									className="underline underline-offset-4 hover:text-foreground"
								>
									Connect now
								</Link>
							)}
						</CardContent>
					</Card>
				) : null}

				<Card>
					<CardHeader>
						<CardTitle>
							{connection.connected ? "Notion Page" : "Connect to Notion"}
						</CardTitle>
						<CardDescription>
							{connection.connected ? (
								<>
									Use a shared Notion page link like{" "}
									<span className="font-medium">
										yourspace.notion.site/page-title-123
									</span>
								</>
							) : (
								"Authorize the public integration to access pages you share during the Notion OAuth flow."
							)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{connection.connected ? (
							<div className="space-y-4">
								<div className="flex items-center justify-between gap-3 border px-3 py-2">
									<div className="flex min-w-0 items-center gap-3">
										{connection.workspaceIcon ? (
											<img
												src={connection.workspaceIcon}
												alt=""
												className="size-5 shrink-0"
											/>
										) : null}
										<div className="min-w-0">
											<p className="truncate font-medium text-xs">
												{connection.workspaceName ?? "Connected workspace"}
											</p>
											<p className="truncate text-muted-foreground text-xs">
												{connection.workspaceId}
											</p>
										</div>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={isDisconnecting}
										onClick={async () => {
											setIsDisconnecting(true);
											try {
												await disconnectNotion();
												navigate({ to: "/" });
											} finally {
												setIsDisconnecting(false);
											}
										}}
									>
										{isDisconnecting ? "Disconnecting..." : "Disconnect"}
									</Button>
								</div>

								<form
									onSubmit={(event) => {
										event.preventDefault();
										form.handleSubmit();
									}}
								>
									<FieldGroup>
										<form.Field name="url">
											{(field) => {
												const isInvalid =
													field.state.meta.isTouched &&
													field.state.meta.errors.length > 0;

												return (
													<Field data-invalid={isInvalid}>
														<FieldLabel htmlFor={field.name}>
															Notion URL
														</FieldLabel>
														<Input
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(event) =>
																field.handleChange(event.target.value)
															}
															placeholder="https://yourspace.notion.site/page-title-123"
															aria-invalid={isInvalid}
														/>
														<FieldDescription>
															This link is stored in the URL for easy sharing.
														</FieldDescription>
														<FieldError
															errors={field.state.meta.errors.map((error) => ({
																message: String(error),
															}))}
														/>
													</Field>
												);
											}}
										</form.Field>

										<Button type="submit">Continue to editor</Button>
									</FieldGroup>
								</form>
							</div>
						) : (
							<div className="space-y-3">
								<p className="text-muted-foreground text-xs">
									You will choose which pages/databases to share with this
									integration during the Notion permission flow.
								</p>
								<Link
									to={connectHref}
									className="inline-flex h-8 items-center justify-center border bg-primary px-3 font-medium text-primary-foreground text-xs hover:bg-primary/80"
								>
									Connect to Notion
								</Link>
							</div>
						)}
					</CardContent>
				</Card>

				<footer className="text-center text-muted-foreground text-sm">
					<Link
						to="/privacy"
						className="underline underline-offset-4 hover:text-foreground"
					>
						Privacy Policy
					</Link>
					{" · "}
					<Link
						to="/terms"
						className="underline underline-offset-4 hover:text-foreground"
					>
						Terms of Use
					</Link>
				</footer>
			</div>
		</div>
	);
}

function sanitizeReturnToPath(input: unknown) {
	if (typeof input !== "string") return "/";
	if (!input.startsWith("/")) return "/";
	if (input.startsWith("//")) return "/";
	return input;
}

function getAuthStatusMessage(status?: string, reason?: string) {
	switch (status) {
		case "connected":
			return "Notion connected successfully.";
		case "required":
			return "Connect Notion before opening the editor.";
		case "denied":
			return "Notion authorization was canceled.";
		case "reconnect_required":
			return "Your Notion connection expired. Reconnect to continue.";
		case "error":
			if (reason === "invalid_state") {
				return "The OAuth callback state was invalid. Please try connecting again.";
			}
			if (reason === "missing_code") {
				return "Notion did not return an authorization code.";
			}
			return "Notion authorization failed. Please try again.";
		default:
			return null;
	}
}
