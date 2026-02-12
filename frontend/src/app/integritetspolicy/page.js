// ============================================
// Integritetspolicy — GDPR Privacy Policy
// ============================================

import { Shield, Mail } from 'lucide-react';

export const metadata = {
  title: 'Integritetspolicy — Nisse / MatKompass',
  description: 'Vår integritetspolicy beskriver hur vi samlar in, använder och skyddar dina personuppgifter.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-warm-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-warm-600" />
        </div>
        <h1 className="font-display text-3xl text-warm-800">Integritetspolicy</h1>
        <p className="text-warm-500 mt-2">Senast uppdaterad: 2025-01-01</p>
      </div>

      <div className="card p-6 sm:p-8 space-y-8 text-warm-700 leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">1. Personuppgiftsansvarig</h2>
          <p>
            Nisse / MatKompass (&quot;vi&quot;, &quot;oss&quot;, &quot;vår&quot;) är personuppgiftsansvarig
            för behandlingen av dina personuppgifter. Vi behandlar dina uppgifter i enlighet med EU:s
            dataskyddsförordning (GDPR) och svensk dataskyddslagstiftning.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">2. Vilka uppgifter vi samlar in</h2>
          <p className="mb-2">Vi samlar in följande personuppgifter:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Kontouppgifter:</strong> E-postadress, namn (valfritt), lösenord (krypterat)</li>
            <li><strong>Användningsdata:</strong> Sökhistorik, sparade recept, hushållsstorlek</li>
            <li><strong>Platsdata:</strong> GPS-position (endast med ditt samtycke) för att hitta butiker nära dig</li>
            <li><strong>Teknisk data:</strong> IP-adress, webbläsartyp (för säkerhet och felsökning)</li>
            <li><strong>Inloggningsdata:</strong> Google- eller Apple-ID vid social inloggning</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">3. Hur vi använder dina uppgifter</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Tillhandahålla och förbättra vår receptsöktjänst</li>
            <li>Autentisera dig och skydda ditt konto</li>
            <li>Visa butiker nära dig (med ditt samtycke)</li>
            <li>Skicka transaktionsmeddelanden (verifiering, lösenordsåterställning)</li>
            <li>Förebygga missbruk och upprätthålla säkerhet</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">4. Rättslig grund</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Avtal (Art. 6.1b):</strong> Nödvändig behandling för att tillhandahålla tjänsten</li>
            <li><strong>Samtycke (Art. 6.1a):</strong> Platsdata, cookies, marknadsföring</li>
            <li><strong>Berättigat intresse (Art. 6.1f):</strong> Säkerhet, missbruksskydd, förbättring av tjänsten</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">5. Lagring och säkerhet</h2>
          <p>
            Dina uppgifter lagras säkert med kryptering. Lösenord hashas med bcrypt (kostnadsfaktor 12).
            All kommunikation sker via HTTPS. Vi lagrar data så länge du har ett aktivt konto.
            Efter kontoradering raderas all data permanent inom 30 dagar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">6. Delning med tredje part</h2>
          <p>
            Vi säljer aldrig dina personuppgifter. Vi delar data med:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
            <li><strong>Google Maps:</strong> Din plats (med samtycke) för att hitta butiker</li>
            <li><strong>Google/Apple:</strong> Autentiseringsdata vid social inloggning</li>
            <li><strong>E-posttjänst (Resend):</strong> Din e-post för transaktionsmeddelanden</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">7. Dina rättigheter (GDPR)</h2>
          <p className="mb-2">Du har rätt att:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Tillgång (Art. 15):</strong> Begära ut alla uppgifter vi lagrar om dig</li>
            <li><strong>Rättelse (Art. 16):</strong> Korrigera felaktiga uppgifter</li>
            <li><strong>Radering (Art. 17):</strong> Begära att all din data raderas permanent</li>
            <li><strong>Dataportabilitet (Art. 20):</strong> Exportera dina uppgifter i maskinläsbart format</li>
            <li><strong>Återkalla samtycke:</strong> Återkalla samtycke till platsdata och cookies</li>
            <li><strong>Klaga:</strong> Inge klagomål till IMY (Integritetsskyddsmyndigheten)</li>
          </ul>
          <p className="mt-2 text-sm">
            Du kan utöva dina rättigheter under <strong>Inställningar &gt; Min data</strong> i appen,
            eller genom att kontakta oss.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">8. Cookies</h2>
          <p>
            Vi använder enbart nödvändiga cookies för att appen ska fungera (autentisering, sessionshantering).
            Vi använder inga tredjepartscookies för reklam eller spårning. Analyscookies används endast
            med ditt uttryckliga samtycke.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-warm-800 mb-3">9. Kontakt</h2>
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-sage-500" />
            <span>integritet@matkompass.se</span>
          </p>
        </section>
      </div>
    </div>
  );
}
