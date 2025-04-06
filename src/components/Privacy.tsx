// src/components/PrivacyPolicy.tsx
const PrivacyPolicy = () => {
    return (
      <div className="max-w-4xl mx-auto p-6 prose prose-blue">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy for Quranify</h1>
        
        <p className="text-gray-600 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
  
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Data Collection</h2>
            <p>
              <strong>We collect:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Basic usage data (pages visited, time spent)</li>
              <li>Cookies for ad personalization (via Muslim Ad Network)</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Advertising</h2>
            <p>
              Quranify uses Muslim Ad Network to display Islamic-relevant ads. This service may:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use cookies to personalize ads</li>
              <li>Collect anonymized behavioral data</li>
              <li>Employ tracking pixels for conversion measurement</li>
            </ul>
            <p className="mt-2">
              You may opt-out through <a href="https://www.networkadvertising.org/choices/" className="text-blue-600">NAI</a> or <a href="https://www.youronlinechoices.com/" className="text-blue-600">Your Online Choices</a>.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Data Usage</h2>
            <p>
              Collected data helps us:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maintain service functionality</li>
              <li>Improve user experience</li>
              <li>Display relevant Islamic content and ads</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Third Parties</h2>
            <p>
              Data may be shared with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Muslim Ad Network (for advertising)</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">5. User Rights</h2>
            <p>
              You may:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use ad blockers to prevent tracking</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Policy Updates</h2>
            <p>
              Changes will be posted here. Continued use constitutes acceptance.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Contact</h2>
            <p>
              For privacy concerns: <a href="mailto:privacy@quranify.xyz" className="text-blue-600">privacy@quranify.xyz</a>
            </p>
          </section>
        </div>
  
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">Note for EU Users (GDPR):</h3>
          <p>
            Muslim Ad Network acts as a data processor. You may exercise GDPR rights by contacting them directly or through us.
          </p>
        </div>
      </div>
    );
  };
  
  export default PrivacyPolicy;