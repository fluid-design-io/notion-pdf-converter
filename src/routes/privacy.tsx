import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPolicyPage,
	head: () => ({
		meta: [
			{
				title: "Privacy Policy | Papyr PDF",
			},
			{
				name: "description",
				content:
					"Privacy Policy for Papyr PDF. Learn how we handle your data when you use our web application.",
			},
		],
	}),
});

function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-background px-6 py-12">
			<div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
				<div className="flex flex-col gap-4">
					<Link
						to="/"
						className={cn(
							buttonVariants({ variant: "ghost", size: "sm" }),
							"w-fit",
						)}
					>
						← Back to Papyr PDF
					</Link>
					<div className="space-y-1">
						<h1 className="font-semibold text-3xl">
							Privacy Policy for Papyr PDF
						</h1>
						<p className="text-muted-foreground text-sm">
							Last Updated: February 4, 2026
						</p>
					</div>
				</div>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
					<p className="leading-relaxed">
						At Papyr PDF, we believe that your data belongs to you. This Privacy
						Policy explains our approach to privacy and how we handle
						information when you use our web application.
					</p>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">1. No Data Collection</h2>
						<p className="leading-relaxed">
							Papyr PDF is designed as a client-side tool. We do not collect,
							store, or process any personal information, including but not
							limited to:
						</p>
						<ul className="list-disc space-y-1 pl-6">
							<li>Names, email addresses, or contact details.</li>
							<li>Login credentials or account information.</li>
							<li>Payment or billing information.</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">2. Client-Side Processing</h2>
						<ul className="list-disc space-y-1 pl-6">
							<li>
								All application functionalities—including document fetching,
								formatting, and PDF generation—happen entirely within your web
								browser.
							</li>
							<li>Your workspace data is never uploaded to our servers.</li>
							<li>
								We do not have access to the content of the documents you
								export.
							</li>
							<li>No data is transmitted to third parties by Papyr PDF.</li>
						</ul>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">
							3. Cookies and Local Storage
						</h2>
						<p className="leading-relaxed">
							Papyr PDF may use your browser&apos;s local storage to save your
							preferred configurations (such as font choices, margins, and theme
							settings) so that they persist between sessions. This data remains
							on your device and is not shared with us. We do not use tracking
							cookies or third-party analytics.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">4. Third-Party Services</h2>
						<p className="leading-relaxed">
							While Papyr PDF interacts with your digital workspace to
							facilitate exports, we are not affiliated with, endorsed by, or
							sponsored by any third-party workspace platforms. Please refer to
							the privacy policies of the platforms you use to understand how
							they handle your data.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">5. Changes to This Policy</h2>
						<p className="leading-relaxed">
							We may update this Privacy Policy from time to time. Any changes
							will be posted on this page with an updated &quot;Last
							Updated&quot; date.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">6. Contact Us</h2>
						<p className="leading-relaxed">
							If you have any questions about this Privacy Policy, please
							contact us at{" "}
							<a
								href="https://github.com/fluid-design-io/notion-pdf-converter"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline underline-offset-4 hover:no-underline"
							>
								GitHub
							</a>
							.
						</p>
						<p className="leading-relaxed">
							<Link
								to="/terms"
								className="text-primary underline underline-offset-4 hover:no-underline"
							>
								Terms of Use
							</Link>
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
