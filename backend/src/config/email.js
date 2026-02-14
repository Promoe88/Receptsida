// ============================================
// Email Service — Resend integration
// All email sending for Nisse
// ============================================

import { Resend } from 'resend';
import { config } from './env.js';

const resend = new Resend(config.RESEND_API_KEY);

const FROM = config.EMAIL_FROM || 'Nisse <noreply@matkompass.se>';
const APP_URL = config.CORS_ORIGIN.split(',')[0].trim();

// ──────────────────────────────────────────
// Verification email
// ──────────────────────────────────────────

export async function sendVerificationEmail(user, token) {
  const verifyUrl = `${APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'Verifiera din e-postadress — Nisse',
    html: layoutWrap(`
      <h1 style="font-family: 'DM Serif Display', Georgia, serif; color: #3D3529; font-size: 28px; margin-bottom: 8px;">
        Välkommen till Nisse!
      </h1>
      <p style="color: #6B6155; font-size: 16px; line-height: 1.6;">
        Tack för att du skapade ett konto${user.name ? `, ${user.name}` : ''}.
        Verifiera din e-post för att komma igång.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="
          display: inline-block;
          background-color: #7C9A82;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        ">Verifiera e-postadress</a>
      </div>
      <p style="color: #9C9488; font-size: 13px; line-height: 1.5;">
        Länken är giltig i 24 timmar. Om du inte skapade detta konto kan du ignorera detta mail.
      </p>
      <p style="color: #C4C0BB; font-size: 12px; margin-top: 16px;">
        Fungerar inte knappen? Kopiera denna länk:<br/>
        <a href="${verifyUrl}" style="color: #7C9A82; word-break: break-all;">${verifyUrl}</a>
      </p>
    `),
  });
}

// ──────────────────────────────────────────
// Welcome email (sent after verification)
// ──────────────────────────────────────────

export async function sendWelcomeEmail(user) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'Välkommen till Nisse! 🍳',
    html: layoutWrap(`
      <h1 style="font-family: 'DM Serif Display', Georgia, serif; color: #3D3529; font-size: 28px; margin-bottom: 8px;">
        Du är redo att börja laga mat!
      </h1>
      <p style="color: #6B6155; font-size: 16px; line-height: 1.6;">
        Hej${user.name ? ` ${user.name}` : ''}! Ditt konto är verifierat och redo att användas.
      </p>

      <div style="background-color: #F3F0EB; border-radius: 16px; padding: 24px; margin: 24px 0;">
        <h3 style="color: #3D3529; font-size: 16px; margin: 0 0 16px 0;">Kom igång på 3 steg:</h3>
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 8px 0; color: #6B6155; font-size: 14px;">
              <strong style="color: #7C9A82;">1.</strong> Sök med ingredienser du har hemma
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B6155; font-size: 14px;">
              <strong style="color: #7C9A82;">2.</strong> Välj recept och skapa inköpslista
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B6155; font-size: 14px;">
              <strong style="color: #7C9A82;">3.</strong> Laga mat med vår röststyrda kokassistent
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${APP_URL}" style="
          display: inline-block;
          background-color: #7C9A82;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        ">Sök ditt första recept</a>
      </div>
    `),
  });
}

// ──────────────────────────────────────────
// Password reset email
// ──────────────────────────────────────────

export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'Återställ ditt lösenord — Nisse',
    html: layoutWrap(`
      <h1 style="font-family: 'DM Serif Display', Georgia, serif; color: #3D3529; font-size: 28px; margin-bottom: 8px;">
        Återställ ditt lösenord
      </h1>
      <p style="color: #6B6155; font-size: 16px; line-height: 1.6;">
        Vi fick en förfrågan om att återställa lösenordet för ditt Nisse-konto.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="
          display: inline-block;
          background-color: #C4704B;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        ">Välj nytt lösenord</a>
      </div>
      <p style="color: #9C9488; font-size: 13px; line-height: 1.5;">
        Länken är giltig i 1 timme. Om du inte begärde detta kan du ignorera mailet — ditt lösenord ändras inte.
      </p>
      <p style="color: #C4C0BB; font-size: 12px; margin-top: 16px;">
        Fungerar inte knappen? Kopiera denna länk:<br/>
        <a href="${resetUrl}" style="color: #C4704B; word-break: break-all;">${resetUrl}</a>
      </p>
    `),
  });
}

// ──────────────────────────────────────────
// Recipe share email
// ──────────────────────────────────────────

export async function sendRecipeShareEmail(fromUser, toEmail, recipe) {
  const recipeUrl = `${APP_URL}?recipe=${recipe.id}`;

  const ingredientsList = (recipe.ingredients || [])
    .slice(0, 8)
    .map((i) => `<li style="color: #6B6155; padding: 4px 0;">${i.amount} ${i.name}</li>`)
    .join('');

  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${fromUser.name || 'Någon'} delade ett recept med dig — ${recipe.title}`,
    html: layoutWrap(`
      <h1 style="font-family: 'DM Serif Display', Georgia, serif; color: #3D3529; font-size: 28px; margin-bottom: 8px;">
        ${recipe.title}
      </h1>
      <p style="color: #6B6155; font-size: 16px; line-height: 1.6;">
        ${fromUser.name || 'En Nisse-användare'} tyckte att du borde testa detta recept!
      </p>

      <div style="background-color: #F3F0EB; border-radius: 16px; padding: 24px; margin: 24px 0;">
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
          ${recipe.timeMinutes ? `<span style="color: #7C9A82; font-size: 14px; font-weight: 600;">${recipe.timeMinutes} min</span>` : ''}
          ${recipe.difficulty ? `<span style="color: #C4704B; font-size: 14px; font-weight: 600;">${recipe.difficulty}</span>` : ''}
          ${recipe.servings ? `<span style="color: #6B6155; font-size: 14px;">${recipe.servings} portioner</span>` : ''}
        </div>
        ${ingredientsList ? `
          <h3 style="color: #3D3529; font-size: 14px; margin: 0 0 8px 0;">Ingredienser:</h3>
          <ul style="padding-left: 16px; margin: 0;">${ingredientsList}</ul>
          ${(recipe.ingredients || []).length > 8 ? '<p style="color: #9C9488; font-size: 12px; margin-top: 8px;">+ fler ingredienser...</p>' : ''}
        ` : ''}
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${recipeUrl}" style="
          display: inline-block;
          background-color: #7C9A82;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        ">Visa hela receptet</a>
      </div>
    `),
  });
}

// ──────────────────────────────────────────
// Shared HTML layout wrapper
// ──────────────────────────────────────────

function layoutWrap(content) {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nisse</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFBF7;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-family: 'DM Serif Display', Georgia, serif; font-size: 24px; color: #7C9A82; font-weight: 700;">
                Nisse
              </span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 24px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(61,53,41,0.06);">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="color: #C4C0BB; font-size: 12px; line-height: 1.5; margin: 0;">
                Nisse — Från kylskåp till middagsbord<br/>
                Du får detta mail eftersom du har ett konto hos Nisse.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
