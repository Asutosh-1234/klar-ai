import { WelcomeEmail } from '@/app/components/emails/welcome';
import ENV from '@/app/lib/config/ENV';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailSendingRequest extends Request {
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
}

export async function POST(req: EmailSendingRequest) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Klar-ai <${ENV.RESEND_EMAIL}>`,
      to: [req.userEmail!],
      subject: `Welcome to Klar, ${req.userName}`,
      react: WelcomeEmail({ firstName: req.userName!, email: req.userEmail!, avatar: req.userAvatar }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}