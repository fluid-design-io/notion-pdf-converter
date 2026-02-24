import { z } from "zod";

const envSchema = z.object({
	NOTION_OAUTH_CLIENT_ID: z.string().min(1, "Missing NOTION_OAUTH_CLIENT_ID"),
	NOTION_OAUTH_CLIENT_SECRET: z
		.string()
		.min(1, "Missing NOTION_OAUTH_CLIENT_SECRET"),
	NOTION_OAUTH_REDIRECT_URI: z
		.string()
		.url("NOTION_OAUTH_REDIRECT_URI must be a valid URL"),
	APP_SESSION_SECRET: z
		.string()
		.min(32, "APP_SESSION_SECRET must be at least 32 characters"),
	NODE_ENV: z.string().optional(),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getServerEnv() {
	if (cachedEnv) return cachedEnv;

	const parsed = envSchema.safeParse(process.env);
	if (!parsed.success) {
		const message = parsed.error.issues
			.map((issue) => issue.message)
			.join("; ");
		throw new Error(`Invalid server environment: ${message}`);
	}

	cachedEnv = parsed.data;
	return cachedEnv;
}

export function isLocalRequestHost(hostname: string) {
	return (
		hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
	);
}

export function getNotionOAuthRedirectUriForRequest() {
	const env = getServerEnv();
	return env.NOTION_OAUTH_REDIRECT_URI;
}

export function isProductionEnv() {
	return getServerEnv().NODE_ENV === "production";
}
