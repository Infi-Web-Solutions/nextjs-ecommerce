export default function PrivacyPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Privacy Policy</h1>

      <p>
        <strong>Last updated:</strong> July 8, 2025
      </p>

      <p>
        This privacy policy explains how we collect, use, and protect your information when
        you use our application.
      </p>

      <h3>1. Information We Collect</h3>
      <ul>
        <li>Basic profile information (name, email) from third-party providers like LinkedIn, Google, etc.</li>
        <li>Login activity for security and analytics purposes.</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>To log you in securely via third-party authentication providers.</li>
        <li>To improve and personalize your experience.</li>
      </ul>

      <h3>3. Data Storage & Security</h3>
      <p>
        Your data is stored securely in our database and is never sold or shared with third parties.
        Passwords (if collected) are hashed using industry-standard encryption.
      </p>

      <h3>4. Third-Party Services</h3>
      <p>
        We use third-party services such as:
      </p>
      <ul>
        <li>LinkedIn OAuth for login</li>
        <li>Google, Facebook, and GitHub authentication (if enabled)</li>
      </ul>

      <h3>5. Your Rights</h3>
      <ul>
        <li>You can request access to, or deletion of, your personal data.</li>
        <li>To make a request, please contact us at: <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></li>
      </ul>

      <h3>6. Contact Us</h3>
      <p>
        If you have any questions about this privacy policy, feel free to email us at
        <a href="mailto:support@yourdomain.com"> support@yourdomain.com</a>.
      </p>
    </div>
  );
}
