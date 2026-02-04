import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
	component: TermsOfUsePage,
	head: () => ({
		meta: [
			{
				title: "Terms of Use | Papyr PDF",
			},
			{
				name: "description",
				content:
					"Terms of Use for Papyr PDF. By using the Service, you agree to these terms.",
			},
		],
	}),
});

function TermsOfUsePage() {
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
							Terms of Use for Papyr PDF
						</h1>
						<p className="text-muted-foreground text-sm">
							Last Updated: February 4, 2026
						</p>
					</div>
				</div>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
					<p className="leading-relaxed">
						By using Papyr PDF (the &quot;Service&quot;), you agree to the
						following terms. Please read them carefully.
					</p>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">
							1. Description of Service
						</h2>
						<p className="leading-relaxed">
							Papyr PDF provides advanced PDF export configurations for digital
							documents, allowing users to customize page breaks, fonts, styles,
							and layouts. The Service is provided as a client-side web
							application.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">2. No User Accounts</h2>
						<p className="leading-relaxed">
							Papyr PDF does not require registration, login, or the creation of
							a user account. You are responsible for maintaining the security
							of your own device and workspace.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">3. Intellectual Property</h2>
						<p className="leading-relaxed">
							<strong>The Service:</strong> All code, design, and branding
							associated with Papyr PDF are the property of the developer.
						</p>
						<p className="leading-relaxed">
							<strong>Your Content:</strong> We claim no ownership over the
							content you export using the Service. You retain all rights to
							your own documents and data.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">4. Acceptable Use</h2>
						<p className="leading-relaxed">
							You agree to use Papyr PDF only for lawful purposes. You may not
							use the Service to attempt to circumvent the security or terms of
							service of any third-party platforms.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">
							5. Disclaimer of Warranties
						</h2>
						<p className="leading-relaxed">
							Papyr PDF is provided on an &quot;as-is&quot; and
							&quot;as-available&quot; basis. We make no warranties, expressed
							or implied, regarding the accuracy, reliability, or availability
							of the Service.
						</p>
						<p className="leading-relaxed">
							Because the Service relies on the structure of third-party
							platforms, we cannot guarantee that the tool will function if
							those platforms change their underlying code or API.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">
							6. Limitation of Liability
						</h2>
						<p className="leading-relaxed">
							To the maximum extent permitted by law, the developer of Papyr PDF
							shall not be liable for any indirect, incidental, special, or
							consequential damages resulting from the use or inability to use
							the Service, including but not limited to data loss or formatting
							errors in exported documents.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">
							7. Changes to the Service
						</h2>
						<p className="leading-relaxed">
							We reserve the right to modify or discontinue the Service at any
							time without notice.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">8. Governing Law</h2>
						<p className="leading-relaxed">
							These terms are governed by the laws of [Your Country/State],
							without regard to its conflict of law principles.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="font-semibold text-xl">9. Contact</h2>
						<p className="leading-relaxed">
							For support or inquiries, please reach out via{" "}
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
								to="/privacy"
								className="text-primary underline underline-offset-4 hover:no-underline"
							>
								Privacy Policy
							</Link>
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
