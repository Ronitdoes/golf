import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Common sender for all platform emails
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DigitalHero <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[RESEND_API_ERROR]', { error, to, subject });
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email exception:', err);
    return { success: false, error: err };
  }
}

/**
 * Base template wrapper to ensure brand consistency
 */
export function emailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin-bottom: 30px; }
        .content { font-size: 16px; line-height: 1.6; color: #a3a3a3; }
        h1 { color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 20px; }
        .cta { display: inline-block; background-color: #22C55E; color: #000000; font-weight: 800; padding: 16px 32px; border-radius: 12px; text-decoration: none; margin-top: 30px; }
        .footer { margin-top: 50px; font-size: 12px; color: #525252; border-top: 1px solid #1a1a1a; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">DIGITALHERO</div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} DigitalHero Golf Platform. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
