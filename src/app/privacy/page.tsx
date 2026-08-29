import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Nichorr",
  description: "How Nichorr collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="August 29, 2026">
      <h2>Overview</h2>
      <p>
        This Privacy Policy explains how Nichorr (&ldquo;Nichorr&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects, uses, shares, and protects personal information when you use the Nichorr website and research
        tools (the &ldquo;Service&rdquo;). It applies to information we handle as a controller. By using the
        Service you agree to this Policy; where consent is legally required, we will ask for it separately.
      </p>

      <h2>Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Account information</strong> &mdash; your name, email address, and password, or the basic
          profile details (name, email, account identifier) shared by a third-party sign-in provider you choose
          (Google, Apple, or Facebook). We do not receive your password from those providers.
        </li>
        <li>
          <strong>Research content</strong> &mdash; the topics, questions, objectives, audience notes, and
          other Inputs you submit, and the research runs, briefs, saved sources, and history generated from
          them.
        </li>
        <li>
          <strong>Communications</strong> &mdash; messages you send us for support, feedback, or other
          requests.
        </li>
        <li>
          <strong>Billing information</strong> &mdash; if paid plans are introduced, payment is handled by a
          third-party payment processor; we receive transaction metadata (such as plan, amount, and status),
          not full card numbers.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Usage and log data</strong> &mdash; actions in the product (for example research runs
          started and features used), timestamps, pages viewed, referring pages, approximate location derived
          from IP address, device and browser type, and IP address, collected for security, debugging, and
          product analytics.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> &mdash; we use strictly necessary cookies to keep
          you signed in and to secure the Service, and limited analytics storage to understand product usage.
          You can control non-essential storage through your browser settings; disabling essential cookies will
          break sign-in.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>to provide, operate, and secure the Service and your account;</li>
        <li>to run research on the topics you submit and return results to you;</li>
        <li>to maintain your research history so you can find and reopen past runs;</li>
        <li>to monitor for abuse, enforce our <a href="/terms">Terms of Service</a>, and comply with legal obligations;</li>
        <li>to diagnose problems, measure performance, and improve features and model quality;</li>
        <li>to communicate with you about the Service, including changes, security notices, and (with any required consent) product updates.</li>
      </ul>
      <p>
        We do not use the content of your research Inputs or Outputs to train third-party foundation models,
        and we do not sell your personal information.
      </p>

      <h2>How research works and who processes your data</h2>
      <p>
        When you run research, the Service sends your topic and related text to third-party providers that act
        as our processors so they can perform search, retrieval, and language-model tasks, and it fetches
        publicly available material from the source websites and platforms identified during the run. We share
        only what is needed to perform the task. The providers we currently rely on are:
      </p>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase</td>
            <td>Authentication, database, and file storage for your account and research data</td>
          </tr>
          <tr>
            <td>Vercel</td>
            <td>Application hosting and content delivery</td>
          </tr>
          <tr>
            <td>Google (Gemini API)</td>
            <td>Language-model processing for claim extraction, analysis, and brief generation</td>
          </tr>
          <tr>
            <td>Google (YouTube Data API)</td>
            <td>Retrieving public video metadata, transcripts, and comments referenced in a run</td>
          </tr>
          <tr>
            <td>Search / retrieval API providers</td>
            <td>Running web and news queries to discover candidate sources</td>
          </tr>
        </tbody>
      </table>
      <p>
        This list may change as the Service evolves; we will keep this section current. Each provider processes
        data under its own security and privacy commitments and only on our instructions.
      </p>

      <h2>Legal bases (where the GDPR or similar laws apply)</h2>
      <ul>
        <li><strong>Performance of a contract</strong> &mdash; to create your account and deliver research results you request.</li>
        <li><strong>Legitimate interests</strong> &mdash; to secure the Service, prevent abuse, and improve the product, balanced against your rights.</li>
        <li><strong>Consent</strong> &mdash; for non-essential analytics storage and optional marketing messages, where required.</li>
        <li><strong>Legal obligation</strong> &mdash; to comply with applicable law and lawful requests.</li>
      </ul>

      <h2>Sharing and disclosure</h2>
      <ul>
        <li><strong>Service providers / processors</strong> &mdash; as described above, bound by contract to protect your data.</li>
        <li><strong>Legal and safety</strong> &mdash; when we believe disclosure is reasonably necessary to comply with law, enforce our Terms, or protect the rights, safety, or property of users, the public, or Nichorr.</li>
        <li><strong>Business transfers</strong> &mdash; in connection with a merger, acquisition, financing, or sale of assets, with notice to you of any change in control of your information.</li>
        <li><strong>With your direction</strong> &mdash; when you choose to export or share Outputs.</li>
      </ul>

      <h2>Data retention</h2>
      <p>
        We keep account information for as long as your account is active. We keep research runs and briefs
        until you delete them or delete your account. We keep security and operational logs for a limited
        period appropriate to their purpose. When you delete your account, we delete or de-identify your
        personal information within a reasonable period, except where we must retain it to comply with legal
        obligations, resolve disputes, or enforce agreements. Backups are purged on a rolling schedule.
      </p>

      <h2>Security</h2>
      <p>
        We use encryption in transit, access controls, database row-level security, and provider-level
        safeguards to protect your information. No method of transmission or storage is completely secure, so
        we cannot guarantee absolute security. If we become aware of a breach affecting your personal
        information, we will notify you and regulators as required by law.
      </p>

      <h2>Your rights and choices</h2>
      <ul>
        <li>
          <strong>Access, correction, deletion, portability</strong> &mdash; you can view and edit your
          account details in settings, delete individual research runs, and request a copy or deletion of your
          personal data by contacting us.
        </li>
        <li>
          <strong>Delete your account</strong> &mdash; contact <a href="mailto:privacy@nichorr.com">privacy@nichorr.com</a>{" "}
          and we will delete your account and associated research data, subject to the retention exceptions
          above.
        </li>
        <li>
          <strong>Object or restrict</strong> &mdash; where the GDPR or similar laws apply, you may object to
          or ask us to restrict certain processing, and withdraw consent at any time without affecting prior
          processing.
        </li>
        <li>
          <strong>Complaints</strong> &mdash; you may lodge a complaint with your local data protection
          authority. We ask that you contact us first so we can help.
        </li>
      </ul>
      <p>
        We will not discriminate against you for exercising these rights. We may need to verify your identity
        before acting on a request.
      </p>

      <h2>International transfers</h2>
      <p>
        Our providers may process data in countries other than yours, including the United States. Where
        required, we rely on appropriate safeguards such as standard contractual clauses for those transfers.
      </p>

      <h2>Children</h2>
      <p>
        The Service is not directed to children under 16, and we do not knowingly collect their personal
        information. If you believe a child has provided us information, contact us and we will delete it.
      </p>

      <h2>Third-party links</h2>
      <p>
        Outputs and pages may link to third-party websites and sources. We are not responsible for the privacy
        practices of those sites; review their policies before providing information to them.
      </p>

      <h2>Changes to this Policy</h2>
      <p>
        We may update this Policy from time to time. We will post the updated version with a new &ldquo;Last
        updated&rdquo; date and, for material changes, provide additional notice by email or in the product.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions or requests: <a href="mailto:privacy@nichorr.com">privacy@nichorr.com</a>.
      </p>
    </LegalPageShell>
  );
}
