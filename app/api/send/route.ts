import { WelcomeEmail } from '@/app/components/emails/welcome';
import ENV from '@/app/lib/config/ENV';
import { Resend } from 'resend';

const resend = new Resend(ENV.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, userName, userAvatar } = body;

    if (!userEmail) {
      return Response.json({ error: "Missing userEmail" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: `Klar-ai <${ENV.RESEND_EMAIL}>`,
      to: [userEmail],
      subject: `Welcome to Klar, ${userName || 'User'}`,
      react: WelcomeEmail({ firstName: userName || 'User', email: userEmail, avatar: userAvatar }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error: any) {
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}