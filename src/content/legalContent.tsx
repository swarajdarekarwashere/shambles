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
						This document is an electronic record in terms of the Information Technology Act, 2000 and rules thereunder. It is published in accordance with Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011 and governs your use of the platform at{" "}
						<strong>https://turnontoday.vercel.app/</strong> ("Platform"), owned by{" "}
						<strong>turnontoday</strong>, registered at Arjun Nagar Complex, C-Wing 303, Dombivli – 421201, Maharashtra. By accessing or using the Platform, you enter into a binding contract with the Platform Owner and agree to these Terms of Use.
					</LegalIntro>

					<LegalSection title="1. Account and registration">
						<p>
							To access and use the Services, you agree to provide true, accurate, and complete information during and after registration. You shall be responsible for all acts done through your registered account. You are required to independently assess and ensure that the Services meet your requirements. Unauthorized use of the Platform may lead to action against you as per these Terms and/or applicable laws.
						</p>
					</LegalSection>

					<LegalSection title="2. Intellectual property">
						<p>
							The contents of the Platform and the Services are proprietary to us and are licensed to us. You will not have any authority to claim any intellectual property rights, title, or interest in its contents. The contents include, and are not limited to, the design, layout, look, and graphics of the Platform.
						</p>
					</LegalSection>

					<LegalSection title="3. Acceptable use">
						<p>
							You agree not to use the Platform and/or Services for any purpose that is unlawful, illegal, or forbidden by these Terms, or Indian or local laws that may apply to you. You agree to pay all charges associated with availing the Services. The Platform may contain links to third-party websites; on accessing these links, you will be governed by the terms and privacy policies of those third-party sites.
						</p>
					</LegalSection>

					<LegalSection title="4. Disclaimer and liability">
						<p>
							Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials offered through the Services for any specific purpose. Your use of our Services and the Platform is solely and entirely at your own risk and discretion, for which we shall not be liable to you in any manner.
						</p>
						<LegalNote>
							You shall indemnify and hold harmless the Platform Owner, its affiliates, and their respective officers, directors, agents, and employees from any claim, demand, or actions — including reasonable attorney's fees — made by any third party or penalty imposed due to or arising out of your breach of these Terms, Privacy Policy, or any applicable law.
						</LegalNote>
					</LegalSection>

					<LegalSection title="5. Governing law and disputes">
						<p>
							These Terms and any dispute or claim relating to them, or their enforceability, shall be governed by and construed in accordance with the laws of India. All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in India. The parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.
						</p>
					</LegalSection>

					<LegalSection title="Contact">
						<p>
							All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website. These Terms may be modified at any time without assigning any reason — it is your responsibility to periodically review them to stay informed of updates.
						</p>
						<LegalList
							items={[
								<>Authorized representative: <strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations</>,
								<>Company: <strong>MipoeInteractive Pvt. Ltd.</strong></>,
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
						This Privacy Policy describes how <strong>turnontoday</strong> and its affiliates collect, use, share, and protect your personal data through the Platform at{" "}
						<strong>https://turnontoday.vercel.app/</strong>. Your personal data will primarily be stored and processed in India. By visiting this Platform or availing any service offered on it, you expressly agree to be bound by the terms of this Privacy Policy and the applicable laws of India.
					</LegalIntro>

					<LegalSection title="1. Collection">
						<p>
							We collect your personal data when you use our Platform, services, or otherwise interact with us. This includes information provided during sign-up such as your name, date of birth, address, telephone/mobile number, and email ID. Sensitive personal data — such as bank account, credit/debit card, or other payment instrument information — may be collected with your consent in accordance with applicable law. We may also track your behaviour, preferences, and transaction-related information on the Platform. You always have the option to not provide information by choosing not to use a particular service or feature.
						</p>
					</LegalSection>

					<LegalSection title="2. Usage">
						<p>
							We use your personal data to provide the services you request — including assisting in handling and fulfilling orders, enhancing customer experience, resolving disputes, troubleshooting problems, informing you about offers, products, and updates, detecting and protecting against fraud and criminal activity, and enforcing our Terms of Use. To the extent we use your personal data for marketing, we will provide you the ability to opt out of such uses.
						</p>
					</LegalSection>

					<LegalSection title="3. Sharing">
						<p>
							We may share your personal data internally within our group entities and affiliates to provide access to their services and products. We may also disclose personal data to third parties such as sellers, business partners, logistics providers, and payment processors — including <strong>Razorpay</strong> — for the purpose of operating our services, complying with legal obligations, and preventing fraudulent or illegal activities. We may disclose data to government agencies or authorised law enforcement agencies if required by law or in good faith belief that such disclosure is necessary.
						</p>
					</LegalSection>

					<LegalSection title="4. Security, retention, and your rights">
						<p>
							We adopt reasonable security practices and procedures to protect your personal data from unauthorised access, loss, or misuse. However, transmission of data over the internet cannot always be guaranteed as completely secure, and users are responsible for protecting their own login credentials. You may access, rectify, and update your personal data directly through the Platform. You may also request account deletion by visiting your profile settings or writing to us — note that deletion will result in losing all information related to your account.
						</p>
						<LegalNote>
							You may withdraw consent for processing your personal data by writing to our Grievance Officer with the subject line "Withdrawal of consent for processing personal data." Please note that withdrawal of consent will not be retrospective and may result in restriction of certain services.
						</LegalNote>
					</LegalSection>

					<LegalSection title="Grievance officer and contact">
						<p>
							For privacy-related requests, data subject rights, or any concerns about how we handle personal data, please contact our team. Please include the email address used on your account when making requests.
						</p>
						<LegalList
							items={[
								<>Data controller: <strong>turnontoday / MipoeInteractive Pvt. Ltd.</strong></>,
								<>Contact person: <strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations</>,
								<>Phone: <strong>+91 9943532411</strong>, <strong>+91 8659045329</strong></>,
								<>Email: <strong>support@Mipoe.in</strong></>,
								<>Support hours: <strong>Monday – Friday, 9:00 – 18:00</strong></>,
							]}
						/>
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
							Cancellations are only considered within 1 day of placing the order.
						</p>
						<p className="mt-3 text-sm leading-7 text-foreground/75 sm:text-base">
							This policy outlines how you can cancel or seek a refund for a product or service purchased through the Platform, in accordance with applicable law.
						</p>
					</div>

					<LegalSection title="Cancellation">
						<p>
							Cancellations will only be considered if the request is made within <strong>1 day</strong> of placing the order. However, cancellation requests may not be entertained if the order has already been communicated to the relevant seller or merchant and they have initiated the process, or the product is already out for delivery — in such cases, you may choose to reject the product at the doorstep. turnontoday does not accept cancellation requests for perishable items such as flowers or eatables; however, a refund or replacement may be considered if the user establishes that the quality of the product delivered was not satisfactory.
						</p>
					</LegalSection>

					<LegalSection title="Damaged, defective, or incorrect items">
						<p>
							In case of receipt of damaged or defective items, please report the issue to our customer service team within <strong>1 day</strong> of receipt. The request will be entertained once the seller or merchant has checked and determined the same. If you feel the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 1 day of receiving the product; the team will then take an appropriate decision. For complaints regarding products that come with a manufacturer's warranty, please refer the issue directly to the manufacturer.
						</p>
						<LegalNote>
							In case of any refunds approved by turnontoday, it will take <strong>7 days</strong> for the refund to be processed to you. Payment processing is handled by <strong>Razorpay</strong>; refund decisions may require verification from the payment provider.
						</LegalNote>
					</LegalSection>

					<LegalSection title="Contact for payment issues and refund requests">
						<p>
							If a transaction fails but your account is charged, or if you believe a refund is due under applicable law, please contact our payments team for review with your order details and payment reference.
						</p>
						<LegalList
							items={[
								<>Payments and transaction queries: <strong>support@Mipoe.in</strong></>,
								<>Phone (support): <strong>+91 9943532411</strong>, <strong>+91 8659045329</strong></>,
								<>Authorized representative: <strong>Mr. Sandeep Kumar</strong>, Head of Customer Relations</>,
							]}
						/>
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
								<>Registered address: <strong>Arjun Nagar Complex, C-Wing 303, Dombivli – 421201, Maharashtra</strong></>,
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