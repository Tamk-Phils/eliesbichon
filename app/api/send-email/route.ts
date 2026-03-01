import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// SMTP transporter using your Spaceship email credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? "465"),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, htmlBody } = await req.json();

    if (!name || !email || (!message && !htmlBody)) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const sentAt = new Date().toLocaleString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    const html = message ? `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#FCFBF8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FCFBF8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(62,39,35,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4E342E 0%,#3E2723 100%);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C2B280;font-weight:600;">Ellie's Bichon Frise Sanctuary</p>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#FCFBF8;line-height:1.3;">New Contact Message</h1>
              <p style="margin:10px 0 0;font-size:13px;color:#C2B280;">📬 Someone reached out via the website</p>
            </td>
          </tr>

          <!-- Sender card -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%" cellpadding="16" cellspacing="0" style="background:#F9F6EE;border:1px solid #F1EBD8;border-radius:12px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#A89B6D;font-weight:600;">From</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#3E2723;">${escapeHtml(name)}</p>
                    <a href="mailto:${escapeHtml(email)}" style="color:#A89B6D;font-size:14px;text-decoration:none;">${escapeHtml(email)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subject -->
          <tr>
            <td style="padding:20px 40px 0;">
              <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#A89B6D;font-weight:600;">Subject</p>
              <p style="margin:0;font-size:16px;font-weight:600;color:#4E342E;">${escapeHtml(subject || "No subject")}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 40px;">
              <hr style="border:none;border-top:1px solid #F1EBD8;margin:0;" />
            </td>
          </tr>

          <!-- Message body -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#A89B6D;font-weight:600;">Message</p>
              <div style="font-size:15px;line-height:1.7;color:#4E342E;white-space:pre-wrap;">${escapeHtml(message)}</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9F6EE;border-top:1px solid #F1EBD8;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#A89B6D;">
                Received ${sentAt}<br/>
                Sent from the contact form at <strong>eliesbichon.com</strong>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>` : "";

    // Verify connection before sending
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("SMTP Verification failed:", verifyError);
      throw new Error("SMTP Configuration error");
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: subject ? `📬 ${subject} — from ${name}` : `📬 New enquiry from ${name}`,
      html: htmlBody ?? html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
