import nodemailer from "nodemailer";

// สร้างตัวส่งอีเมล (Transporter)
// ให้ผู้ใช้แก้ไขข้อมูล SMTP ในไฟล์ .env
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // อีเมลผู้ส่ง
    pass: process.env.MAIL_PASS, // รหัสผ่าน หรือ App Password
  },
});

export async function sendStatusEmail(to: string, studentName: string, complaintTitle: string, statusLabel: string, note?: string) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      to: to,
      subject: `อัปเดตสถานะคำร้อง: ${complaintTitle}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4f46e5;">RMUTI Care - อัปเดตคำร้องเรียน</h2>
          <p>เรียนคุณ <b>${studentName}</b>,</p>
          <p>ข้อร้องเรียนของคุณในหัวข้อ <b>"${complaintTitle}"</b> ได้รับการอัปเดตสถานะแล้ว:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">สถานะใหม่: <span style="color: #4f46e5;">${statusLabel}</span></p>
            ${note ? `<p style="margin: 10px 0 0 0; color: #64748b;">หมายเหตุจากเจ้าหน้าที่: ${note}</p>` : ""}
          </div>
          <p>ท่านสามารถตรวจสอบรายละเอียดเพิ่มเติมและโต้ตอบกับเจ้าหน้าที่ได้ผ่านระบบ RMUTI Care</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/student/login" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">เข้าสู่ระบบเพื่อดูรายละเอียด</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">นี่คือการแจ้งเตือนอัตโนมัติจากระบบ กรุณาอย่าตอบกลับอีเมลนี้</p>
        </div>
      `,
    });
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
