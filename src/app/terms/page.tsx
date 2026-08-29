import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service — Nichorr",
  description: "The terms that govern your use of Nichorr.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="August 29, 2026">
      <h2>1. Agreement to these Terms</h2>
      <p>
        These Terms of Service (the &ldquo;Terms&rdquo;) are a binding agreement between you and Nichorr
        (&ldquo;Nichorr&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) governing your access to and use of the Nichorr
        website, applications, and research tools (together, the &ldquo;Service&rdquo;). By creating an account,
        clicking &ldquo;I agree&rdquo;, or otherwise using the Service, you accept these Terms and our{" "}
        <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the Service.
      </p>
      <p>
        If you use the Service on behalf of an organization, you represent that you are authorized to bind that
        organization to these Terms, and &ldquo;you&rdquo; refers to that organization.
      </p>

      <h2>2. What Nichorr does</h2>
      <p>
        Nichorr is an evidence-first research assistant for technology content creators. Given a topic you
        provide, the Service retrieves publicly available material &mdash; such as web pages, published
        benchmarks, specification sheets, forum discussions, and publicly accessible video transcripts and
        comments &mdash; extracts factual claims from that material, checks those claims against multiple
        sources, flags where sources disagree, assigns confidence indicators, and assembles a structured
        research brief.
      </p>
      <p>
        Nichorr is a research aid, not an editorial authority, a legal or financial adviser, or a substitute
        for your own judgment. See Section 7 (Accuracy and editorial responsibility).
      </p>

      <h2>3. Eligibility and accounts</h2>
      <ul>
        <li>You must be at least 16 years old (or the age of digital consent in your country, if higher) to use the Service.</li>
        <li>
          You must provide accurate account information and keep it current. You may sign in with an email and
          password or through a supported third-party provider (for example Google, Apple, or Facebook).
        </li>
        <li>
          You are responsible for all activity under your account and for keeping your credentials secure.
          Notify us promptly at <a href="mailto:security@nichorr.com">security@nichorr.com</a> if you suspect
          unauthorized use.
        </li>
        <li>You may not share your account, or resell or sublicense access to the Service, without our written permission.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to, and not to help anyone else:</p>
      <ul>
        <li>use the Service to break the law, infringe intellectual property or privacy rights, or produce defamatory or knowingly false content;</li>
        <li>submit topics or prompts designed to generate content that is unlawful, harassing, hateful, or that facilitates harm;</li>
        <li>attempt to access accounts, data, or systems that are not yours, or probe, scan, or test the vulnerability of the Service without authorization;</li>
        <li>circumvent rate limits, usage quotas, or access controls, or place an unreasonable load on the Service or its providers;</li>
        <li>scrape, crawl, or bulk-export the Service other than through features we provide for that purpose;</li>
        <li>reverse engineer or attempt to extract source code or models from the Service, except to the extent this restriction is prohibited by applicable law;</li>
        <li>misrepresent Nichorr output as having been independently verified by us, or imply that Nichorr endorses your content.</li>
      </ul>
      <p>
        We may suspend or limit access to investigate suspected violations or to protect the Service, its
        users, or third parties.
      </p>

      <h2>5. Your inputs and research outputs</h2>
      <p>
        &ldquo;Inputs&rdquo; means the topics, questions, objectives, and other material you submit.
        &ldquo;Outputs&rdquo; means the briefs, claim lists, source references, and other results the Service
        generates from your Inputs.
      </p>
      <ul>
        <li>
          <strong>You keep ownership of your Inputs.</strong> You grant us a worldwide, non-exclusive license
          to host, process, and transmit your Inputs solely to operate, secure, and improve the Service and to
          provide the Outputs to you.
        </li>
        <li>
          <strong>As between you and us, you own the Outputs generated for your account</strong> and may use
          them for your own content, subject to these Terms and to the rights of the underlying source
          material (see Section 6).
        </li>
        <li>
          Outputs are generated from third-party sources and automated models. Similar or identical Outputs may
          be generated for other users, and we retain the right to operate the Service for everyone.
        </li>
        <li>
          If you send us feedback or suggestions, you grant us a perpetual, royalty-free license to use them
          without restriction.
        </li>
      </ul>

      <h2>6. Third-party sources and services</h2>
      <p>
        The Service surfaces and quotes material from third-party sources that we do not own or control.
        Source material remains the property of its rights holders and may be subject to its own terms,
        copyright, and licensing. You are responsible for using quotations, data, and references from Outputs
        in a manner consistent with fair use / fair dealing and with those third-party rights &mdash; for
        example, by attributing sources in your published content.
      </p>
      <p>
        The Service also relies on third-party providers for hosting, authentication, search, and
        language-model processing. Your use of features that depend on those providers is also subject to their
        terms, and we are not responsible for their acts or omissions. Our <a href="/privacy">Privacy Policy</a>{" "}
        lists the providers that process data on our behalf.
      </p>

      <h2>7. Accuracy and editorial responsibility</h2>
      <p>
        Nichorr is designed to reduce research errors, not to eliminate them. Automated retrieval and claim
        extraction can miss context, misread a source, surface outdated information, or reflect errors in the
        original material. Confidence indicators and conflict flags are estimates, not guarantees.
      </p>
      <p>
        <strong>
          You are solely responsible for reviewing Outputs and for any content you publish based on them.
        </strong>{" "}
        Before you rely on a claim &mdash; especially a specification, benchmark figure, price, safety
        statement, or comparison &mdash; verify it against the cited primary source. Nichorr does not warrant
        that Outputs are accurate, complete, current, or fit for any particular use.
      </p>

      <h2>8. Our intellectual property</h2>
      <p>
        The Service, including its software, design, text, and branding (excluding your Inputs, your Outputs,
        and third-party source material), is owned by Nichorr and protected by intellectual property laws. We
        grant you a limited, non-exclusive, non-transferable, revocable license to use the Service in
        accordance with these Terms. No other rights are granted.
      </p>

      <h2>9. Early access</h2>
      <p>
        The Service is offered on an early-access basis. Features may change, break, or be removed, and
        availability, quotas, and performance may vary without notice. We may contact you about your usage to
        improve the product.
      </p>

      <h2>10. Plans and fees</h2>
      <p>
        Some features may be free during early access. If we introduce paid plans, pricing, billing terms, and
        any usage limits will be presented to you before you purchase, and additional plan terms may apply.
        Except where required by law, fees are non-refundable.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        You may stop using the Service and delete your account at any time. We may suspend or terminate your
        access if you materially breach these Terms, if required by law, or if your use poses a risk to the
        Service or others. On termination, your license to use the Service ends. We will handle any data
        associated with your account as described in the <a href="/privacy">Privacy Policy</a>. Sections that
        by their nature should survive termination (including Sections 5&ndash;8 and 12&ndash;16) will survive.
      </p>

      <h2>12. Disclaimers</h2>
      <p>
        THE SERVICE AND ALL OUTPUTS ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
        WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ANY WARRANTY THAT
        OUTPUTS WILL BE ACCURATE OR RELIABLE. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN
        WARRANTIES, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NICHORR AND ITS SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA,
        GOODWILL, OR REPUTATION, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICE OR
        ANY OUTPUTS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>
      <p>
        OUR TOTAL LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICE IN ANY 12-MONTH PERIOD WILL NOT EXCEED THE
        GREATER OF (A) THE AMOUNT YOU PAID US FOR THE SERVICE DURING THAT PERIOD, OR (B) USD 100. THESE LIMITS
        DO NOT APPLY TO LIABILITY THAT CANNOT BE LIMITED UNDER APPLICABLE LAW.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You will defend, indemnify, and hold harmless Nichorr from claims, damages, and costs (including
        reasonable legal fees) arising from your Inputs, your published content, your use of Outputs, or your
        breach of these Terms, except to the extent the claim results from our own violation of law.
      </p>

      <h2>15. Changes</h2>
      <p>
        We may update these Terms from time to time. If a change is material, we will give notice by posting
        the updated Terms with a new &ldquo;Last updated&rdquo; date and, where appropriate, by email or an
        in-product notice. Changes take effect when posted unless stated otherwise. Your continued use after
        the effective date means you accept the updated Terms.
      </p>

      <h2>16. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which Nichorr has its principal place of
        business, without regard to conflict-of-laws rules, and the courts of that jurisdiction will have
        exclusive jurisdiction over disputes, except where mandatory consumer-protection law in your country of
        residence provides otherwise. Nothing in these Terms limits any statutory rights you have as a
        consumer that cannot be waived by agreement.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:legal@nichorr.com">legal@nichorr.com</a>.
      </p>
    </LegalPageShell>
  );
}
