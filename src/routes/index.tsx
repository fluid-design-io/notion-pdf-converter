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
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const navigate = useNavigate();
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

	return (
		<div className="min-h-screen bg-background px-6 py-12 text-foreground">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
				<div className="space-y-2">
					<h1 className="font-semibold text-2xl">Notion to PDF</h1>
					<p className="text-muted-foreground text-sm">
						Paste a public Notion page link to generate a PDF preview and
						customize export settings.
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Notion Page</CardTitle>
						<CardDescription>
							Use a public share link like{" "}
							<span className="font-medium">
								yourspace.notion.site/page-title-123
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent>
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
												<FieldLabel htmlFor={field.name}>Notion URL</FieldLabel>
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
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
