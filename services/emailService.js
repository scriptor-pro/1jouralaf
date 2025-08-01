import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(toEmail, token) {
  const resetUrl = `http://localhost:3000/auth/reset/${token}`;
  const { error } = await resend.emails.send({
    from: '1jouralaf@14.bvh.fyi',
    to: toEmail,
    subject: 'Réinitialisation de mot de passe',
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe.</p>
      <p><a href="\${resetUrl}">Clique ici pour le faire</a></p>
      <p>Ce lien expire dans 1 heure.</p>
    `
  });

  if (error) {
    console.error('Erreur envoi :', error);
    throw new Error('Échec envoi e-mail.');
  }
}
