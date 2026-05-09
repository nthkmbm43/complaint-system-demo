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

export async function sendStatusEmail(
  to: string, 
  studentName: string, 
  complaintTitle: string, 
  statusLabel: string, 
  note?: string,
  statusCode?: number,
  complaintId?: string,
  attachmentUrl?: string
) {
  try {
    let statusDescription = "มีการอัปเดตสถานะใหม่สำหรับเรื่องร้องเรียนของคุณ";
    if (statusCode === 1) {
       statusDescription = "ทางเราได้รับเรื่องร้องเรียนของคุณแล้ว และเจ้าหน้าที่กำลังเร่งดำเนินการแก้ไขปัญหาเบื้องต้นครับ";
    } else if (statusCode === 2) {
       statusDescription = "เย้! 🎉 ปัญหาของคุณได้รับการแก้ไขและดำเนินการเสร็จสิ้นเรียบร้อยแล้ว หวังว่าคุณจะพึงพอใจกับการบริการของเรานะครับ";
    } else if (statusCode === 3) {
       statusDescription = "ขออภัยด้วยครับ 😔 เรื่องร้องเรียนของคุณถูกปฏิเสธ หากมีข้อสงสัยสามารถติดต่อเจ้าหน้าที่เพิ่มเติมได้ครับ";
    }

    const complaintLink = complaintId ? `${process.env.NEXTAUTH_URL}/student/complaints/${complaintId}` : `${process.env.NEXTAUTH_URL}/student/dashboard`;

    let attachmentHtml = "";
    if (attachmentUrl && attachmentUrl.startsWith("data:image")) {
       attachmentHtml = `
         <div style="margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
           <p style="margin: 0 0 10px 0; font-weight: bold; color: #4f46e5; font-size: 14px;">📸 หลักฐานการดำเนินงานจากเจ้าหน้าที่:</p>
           <img src="${attachmentUrl}" alt="Evidence" style="max-width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
         </div>
       `;
    }

    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      to: to,
      subject: `อัปเดตสถานะคำร้อง: ${complaintTitle}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4f46e5; margin-top: 0; text-align: center;">RMUTI Care - อัปเดตคำร้องเรียน</h2>
          <p>เรียนคุณ <b>${studentName}</b>,</p>
          <p>ข้อร้องเรียนของคุณในหัวข้อ <b>"${complaintTitle}"</b> ได้รับการอัปเดตสถานะแล้ว:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 5px solid #4f46e5; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 18px;">สถานะใหม่: <span style="color: #4f46e5;">${statusLabel}</span></p>
            <p style="margin: 0; color: #475569; font-size: 15px;">${statusDescription}</p>
            
            ${note ? `
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 14px;"><b>📝 หมายเหตุจากเจ้าหน้าที่:</b><br/>${note}</p>
              </div>
            ` : ""}
            
            ${attachmentHtml}
          </div>
          
          <p style="text-align: center; margin-bottom: 30px;">ท่านสามารถตรวจสอบรายละเอียดเพิ่มเติมได้ผ่านระบบออนไลน์</p>
          
          <div style="text-align: center;">
            <a href="${complaintLink}" style="background: #4f46e5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">เข้าสู่ระบบเพื่อดูรายละเอียดเคสนี้</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">นี่คือการแจ้งเตือนอัตโนมัติจากระบบ กรุณาอย่าตอบกลับอีเมลนี้</p>
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
