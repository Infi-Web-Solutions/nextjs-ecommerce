// src/app/api/superadmin/invite-user/route.js

import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📨 Backend received invite payload:", body);

    const { name, email, contact, role, roleid, organizationId } = body;

    const token = jwt.sign(
      { name, email, contact, role, roleid, organizationId },
      process.env.INVITE_SECRET,
      { expiresIn: "7d" }
    );

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/en/accept-invite?token=${token}`;

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "vandanayadav0163@gmail.com",
      subject: "You're Invited!",
      html: `<p>Hello ${name},</p>
             <p>You’ve been invited to join. Click the link below to accept:</p>
             <a href="${inviteLink}">${inviteLink}</a>`,
    });

    console.log("📩 Resend email response:", result);

    return new Response(JSON.stringify({ message: "Invite sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error sending invite:", err);
    return new Response(JSON.stringify({ message: "Failed to send invite" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
