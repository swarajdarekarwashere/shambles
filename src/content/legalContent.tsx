import type { ReactNode } from "react";

export type LegalType = "terms" | "privacy" | "refund" | "contact";

const LegalShell = ({ children }: { children: ReactNode }) => (
	<div className="space-y-6 text-[15px] leading-7 text-foreground/80">{children}</div>
);

const LegalIntro = ({ children }: { children: ReactNode }) => (
	<div className="rounded-[1.75rem] border border-primary/15 bg-white/75 p-5 shadow-[0_12px_30px_rgba(239,77,112,0.08)] backdrop-blur-sm sm:p-6">
		<p className="text-base leading-7 text-foreground/85">{children}</p>
	</div>
);

const LegalSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<section className="rounded-[1.75rem] border border-border/80 bg-background/80 p-5 shadow-[0_10px_24px_rgba(95,34,52,0.06)] sm:p-6">
		<h3 className="font-serif-d text-xl text-foreground sm:text-2xl">
			{title}
		</h3>
		<div className="mt-3 space-y-3 text-foreground/75">{children}</div>
	</section>
);

const LegalList = ({ items }: { items: ReactNode[] }) => (
	<ul className="space-y-2.5">
		{items.map((item, index) => (
			<li key={index} className="flex gap-3">
				<span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-romance" />
				<span>{item}</span>
			</li>
		))}
	</ul>
);

const LegalNote = ({ children }: { children: ReactNode }) => (
	<div className="rounded-[1.5rem] border border-accent/15 bg-accent/5 px-4 py-3 text-sm leading-6 text-foreground/70">
		{children}
	</div>
);

export const legalContent: Record<LegalType, { title: string; text: ReactNode }> =
	{
		terms: {
			title: "Terms & Conditions",
			text: (
				<LegalShell>
					<LegalIntro>
						Welcome to <strong>Turn on</strong>. By creating an account,
						purchasing a Day Pass, or using the platform, you agree to these terms.
					</LegalIntro>

					<LegalSection title="1. Eligibility and account use">
						<LegalList
							items={[
								<>The platform is intended for users who are at least 18 years old.</>,
								<>You are responsible for keeping your sign-in details secure and for activity under your account.</>,
								<>You agree to provide accurate information when creating or using your account.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="2. Access to paid content">
						<LegalList
							items={[
								<>A Day Pass gives one account access to eligible premium content for 24 hours from activation.</>,
								<>Day Pass access is personal, non-transferable, and not a subscription.</>,
								<>We may update, improve, rotate, or temporarily limit specific games and features from time to time.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="3. Acceptable use">
						<LegalList
							items={[
								<>Use the platform only for lawful, personal entertainment.</>,
								<>Do not copy, reverse engineer, disrupt, scrape, resell, or misuse any part of the service.</>,
								<>We may suspend or restrict access if the platform is used in a way that harms the service or other users.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="4. Intellectual property">
						<p>
							All platform content, including artwork, branding, game logic, copy,
							and software, belongs to Turn on or its licensors. You may not
							reproduce, distribute, or commercially use any part of the platform
							without permission.
						</p>
					</LegalSection>

					<LegalSection title="5. Service disclaimer">
						<p>
							Turn on is provided for entertainment purposes on an "as
							available" basis. We do not guarantee uninterrupted availability or
							that every feature will always be error-free.
						</p>
						<LegalNote>
							Nothing in these terms is meant to limit rights that cannot be
							excluded under applicable law.
						</LegalNote>
					</LegalSection>

					<LegalSection title="Company information and contact">
						<p>
							These Terms are issued by MipoeInteractive Pvt. Ltd. For
							questions about these Terms or to provide legal notices, contact the
							company using the details below.
						</p>
						<LegalList
							items={[
								<>Authorized representative: <strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations.</>,
								<>Company: <strong>Mipoe</strong></>,
								<>Phone: <strong>+91 9943532411</strong>, <strong>+91 8659045329</strong></>,
								<>Support email: <strong>support@Mipoe.in</strong></>,
								<>Registered address: <strong>Mumbai, Maharashtra, India</strong></>,
							]}
						/>
					</LegalSection>
				</LegalShell>
			),
		},

		privacy: {
			title: "Privacy Policy",
			text: (
				<LegalShell>
					<LegalIntro>
						We collect only the information needed to run the platform, unlock
						paid access, and improve gameplay for our digital entertainment
						service.
					</LegalIntro>

					<LegalSection title="1. Information we collect">
						<LegalList
							items={[
								<>Your email address and account details used for sign-in and account management.</>,
								<>Gameplay-related data such as session scores, progress, and feedback submitted through the platform.</>,
								<>Purchase and access status needed to confirm Day Pass availability.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="2. How we use information">
						<LegalList
							items={[
								<>To authenticate users and maintain account access.</>,
								<>To unlock paid content, verify purchases, and prevent misuse.</>,
								<>To understand how the games are used and improve the experience over time.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="3. Payments and third parties">
						<p>
							Payments are processed by <strong>Razorpay</strong>. We do not store
							your full card or bank details on our own servers. Authentication and
							related account services may also rely on trusted infrastructure
							providers that help us operate the product.
						</p>
					</LegalSection>

					<LegalSection title="4. Sharing, retention, and security">
						<LegalList
							items={[
								<>We do not sell your personal data.</>,
								<>Information may be shared only with service providers involved in authentication, payments, hosting, or where required by law.</>,
								<>We keep data for as long as reasonably needed to operate the service, maintain records, and meet legal obligations.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="Data controller and contact">
						<p>
							The data controller for the platform is Mipoe.
							If you have questions about how we handle personal data, want to
							exercise data subject rights, or need further information, contact our
							team:
						</p>
						<LegalList
							items={[
								<>Data controller: <strong>Mipoe</strong></>,
								<>Contact person: <strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations.</>,
								<>Phone: <strong>+91 9943532411</strong>, <strong>+91 8659045329</strong></>,
								<>Email for privacy requests: <strong>support@shambles.in</strong></>,
							]}
						/>
						<LegalNote>
							Where required by local law, you may have rights to access, correct,
							or request deletion of your personal data. Please include the email
							address used on your account when making requests.
						</LegalNote>
					</LegalSection>
				</LegalShell>
			),
		},

		refund: {
			title: "Cancellation & Refund Policy",
			text: (
				<LegalShell>
					<div className="rounded-[2rem] border border-primary/20 bg-gradient-blush p-6 text-center shadow-[0_18px_45px_rgba(239,77,112,0.14)] sm:p-8">
						<p className="text-xs font-semibold uppercase tracking-[0.32em] text-foreground/55">
							Digital purchase
						</p>
						<h3 className="mt-3 font-serif-d text-4xl text-foreground sm:text-5xl">
							Refunds
						</h3>
						<p className="mt-4 text-lg font-semibold text-foreground">
							Refunds are generally not applicable once access is granted.
						</p>
						<p className="mt-3 text-sm leading-7 text-foreground/75 sm:text-base">
							A Day Pass is a low-cost digital access purchase that becomes
							available immediately after successful payment, so completed
							purchases are treated as final.
						</p>
					</div>

					<LegalSection title="When the policy applies">
						<LegalList
							items={[
								<>The Day Pass unlocks digital content for 24 hours and is delivered instantly.</>,
								<>Because access is activated right away, the purchase cannot usually be cancelled, returned, or refunded.</>,
								<>This policy applies unless a refund is required under applicable law.</>,
							]}
						/>
					</LegalSection>

					<LegalSection title="Payment issues">
						<p>
							If a transaction fails but your account is charged, or if there is a
							duplicate billing issue, the matter should be reviewed against the
							payment record before any refund decision is made.
						</p>
						<LegalNote>
							Payment processing is handled through Razorpay, so transaction
							verification may depend on payment provider records.
						</LegalNote>
					</LegalSection>

					<LegalSection title="Contact for payment issues and refund requests">
						<p>
							If a transaction fails but your account is charged, or if you believe a
							refund is due under applicable law, please contact our payments team
							for review.
						</p>
						<LegalList
							items={[
								<>Payments and transaction queries: <strong>support@shambles.in</strong></>,
								<>Phone (support): <strong>+91 9943532411</strong>, <strong>+91 8659045329</strong></>,
								<>Authorized representative: <strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations.</>,
							]}
						/>
						<LegalNote>
							Payment processing is handled by third-party providers; refund decisions
							may require verification from the payment provider.
						</LegalNote>
					</LegalSection>
				</LegalShell>
			),
		},

		contact: {
			title: "Contact Us",
			text: (
				<LegalShell>
					<LegalIntro>
						Turn on is a digital entertainment project designed for lightweight
						social play, couple activities, and premium 24-hour access to selected
						game experiences. If you need help with account access, payments, or
						general support, please reach out using the details below.
					</LegalIntro>

					<LegalSection title="Support details">
						<LegalList
							items={[
								<>Phone: <strong>+91 9943532411</strong></>,
								<>Alternate phone: <strong>+91 8659045329</strong></>,
								<>Support email: <strong>support@shambles.in</strong></>,
								<>Operating address: <strong>Mumbai, Maharashtra</strong></>,
							]}
						/>
					</LegalSection>

					<LegalSection title="How we can help">
						<LegalList
							items={[
								<>Questions about account sign-in or Day Pass access.</>,
								<>Payment-related issues such as duplicate charges or failed access activation.</>,
								<>General support, platform feedback, and compliance-related inquiries.</>,
							]}
						/>
						<LegalNote>
							For faster resolution, please include the email address used on your
							account and a short description of the issue when contacting support.
							Our authorized contact for escalations is{" "}
							<strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations.
						</LegalNote>
					</LegalSection>
				</LegalShell>
			),
		},
	};
