import { Resend } from 'resend';
import { SERVER_ENV } from '@sve/env';

const resendKey = SERVER_ENV.RESEND_API_KEY || ''
const resend = new Resend(resendKey);

export interface EmailArgs {
  to: string[]
  subject: string
  reactTemplate: any
}

const sendEmail = async ({ to, subject, reactTemplate }: EmailArgs) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject,
    react: reactTemplate,
  });

  if (error) {
    return error;
  }
  return data;
}

export default sendEmail;
