import { MailService } from '@sendgrid/mail';
import { 
  users, notifications,
  type User, type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

interface NotificationConfig {
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
}

interface NotificationData {
  userId: number;
  title: string;
  message: string;
  type: 'bid_notification' | 'auction_end' | 'outbid' | 'win_notification' | 'system' | 'welcome';
  auctionId?: number;
  config?: NotificationConfig;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class NotificationService {
  private mailService: MailService;
  private companyInfo = {
    name: "مزاد السعودية",
    phone: "00966505930648",
    whatsapp: "00966505930648",
    email: "info@mazadksa.com",
    address: "Al Bandariyah, Saeed Tower, Khobar, Saudi Arabia",
    website: "https://mazadksa.com"
  };

  constructor() {
    this.mailService = new MailService();
    if (process.env.SENDGRID_API_KEY) {
      this.mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      // Get user details
      const [user] = await db.select().from(users).where(eq(users.id, data.userId));
      if (!user) {
        console.error('User not found:', data.userId);
        return false;
      }

      // Store notification in database
      await this.storeNotification(data);

      // Send via different channels based on user preferences and config
      const results = await Promise.allSettled([
        this.sendEmailNotification(user, data),
        this.sendSMSNotification(user, data),
        this.sendWhatsAppNotification(user, data)
      ]);

      // Return true if at least one notification was sent successfully
      return results.some(result => result.status === 'fulfilled' && result.value === true);

    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  private async storeNotification(data: NotificationData): Promise<void> {
    await db.insert(notifications).values({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      auctionId: data.auctionId || null,
      isRead: false,
      emailSent: false
    });
  }

  private async sendEmailNotification(user: User, data: NotificationData): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured, skipping email');
      return false;
    }

    if (!user.emailNotifications || (data.config && !data.config.email)) {
      return false;
    }

    try {
      const template = this.getEmailTemplate(data);
      
      const msg = {
        to: user.email,
        from: {
          email: this.companyInfo.email,
          name: this.companyInfo.name
        },
        subject: template.subject,
        text: template.text,
        html: template.html
      };

      await this.mailService.send(msg);
      console.log('Email sent successfully to:', user.email);
      
      // Mark as email sent in database
      await this.markEmailSent(data.userId, data.type);
      
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  private async sendSMSNotification(user: User, data: NotificationData): Promise<boolean> {
    if (!user.smsNotifications || (data.config && !data.config.sms) || !user.phone) {
      return false;
    }

    // For demo purposes - would integrate with SMS provider like Twilio
    console.log(`SMS would be sent to ${user.phone}: ${data.message}`);
    return true;
  }

  private async sendWhatsAppNotification(user: User, data: NotificationData): Promise<boolean> {
    if (!user.whatsappNotifications || (data.config && !data.config.whatsapp) || !user.whatsappNumber && !user.phone) {
      return false;
    }

    const whatsappNumber = user.whatsappNumber || user.phone;
    // For demo purposes - would integrate with WhatsApp Business API
    console.log(`WhatsApp would be sent to ${whatsappNumber}: ${data.message}`);
    return true;
  }

  private async markEmailSent(userId: number, type: string): Promise<void> {
    await db.update(notifications)
      .set({ emailSent: true })
      .where(eq(notifications.userId, userId));
  }

  private getEmailTemplate(data: NotificationData): EmailTemplate {
    const baseStyle = `
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .rtl { direction: rtl; text-align: right; }
      </style>
    `;

    switch (data.type) {
      case 'welcome':
        return {
          subject: `مرحباً بك في ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>${this.companyInfo.name}</h1>
                <h2>مرحباً بك في منصة المزادات الرائدة</h2>
              </div>
              <div class="content">
                <h3>أهلاً وسهلاً!</h3>
                <p>نحن سعداء لانضمامك إلى منصة ${this.companyInfo.name}، المنصة الرائدة للمزادات في المملكة العربية السعودية.</p>
                <p><strong>ما يمكنك فعله الآن:</strong></p>
                <ul>
                  <li>تصفح المزادات النشطة</li>
                  <li>المشاركة في المزايدة</li>
                  <li>تتبع مزاداتك المفضلة</li>
                  <li>كسب نقاط المكافآت</li>
                </ul>
                <a href="${this.companyInfo.website}" class="button">ابدأ التصفح الآن</a>
              </div>
              <div class="footer">
                <p><strong>تواصل معنا:</strong></p>
                <p>📞 ${this.companyInfo.phone} | 📧 ${this.companyInfo.email}</p>
                <p>📍 ${this.companyInfo.address}</p>
              </div>
            </div>
          `,
          text: `مرحباً بك في ${this.companyInfo.name}!\n\nنحن سعداء لانضمامك إلى منصتنا.\n\nللتواصل: ${this.companyInfo.phone}\nالموقع: ${this.companyInfo.website}`
        };

      case 'bid_notification':
        return {
          subject: `مزايدة جديدة على المزاد - ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>مزايدة جديدة!</h1>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <p>لا تفوت الفرصة وتابع المزاد الآن!</p>
                <a href="${this.companyInfo.website}" class="button">عرض المزاد</a>
              </div>
              <div class="footer">
                <p>📞 ${this.companyInfo.phone} | 📧 ${this.companyInfo.email}</p>
              </div>
            </div>
          `,
          text: `${data.title}\n\n${data.message}\n\nللمتابعة: ${this.companyInfo.website}`
        };

      case 'auction_end':
        return {
          subject: `انتهى المزاد - ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>انتهى المزاد</h1>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <a href="${this.companyInfo.website}" class="button">عرض النتائج</a>
              </div>
              <div class="footer">
                <p>📞 ${this.companyInfo.phone} | 📧 ${this.companyInfo.email}</p>
              </div>
            </div>
          `,
          text: `${data.title}\n\n${data.message}`
        };

      case 'win_notification':
        return {
          subject: `🎉 مبروك! فزت بالمزاد - ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>🎉 مبروك!</h1>
                <h2>لقد فزت بالمزاد</h2>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
                <p><strong>الخطوات التالية:</strong></p>
                <ul>
                  <li>سيتم التواصل معك خلال 24 ساعة</li>
                  <li>تجهيز وسائل الدفع</li>
                  <li>ترتيب استلام المنتج</li>
                </ul>
                <a href="${this.companyInfo.website}" class="button">تفاصيل الفوز</a>
              </div>
              <div class="footer">
                <p><strong>للاستفسارات:</strong></p>
                <p>📞 ${this.companyInfo.phone} | 📧 ${this.companyInfo.email}</p>
                <p>📍 ${this.companyInfo.address}</p>
              </div>
            </div>
          `,
          text: `🎉 مبروك! فزت بالمزاد\n\n${data.title}\n\n${data.message}\n\nللتواصل: ${this.companyInfo.phone}`
        };

      default:
        return {
          subject: `إشعار من ${this.companyInfo.name}`,
          html: `
            ${baseStyle}
            <div class="container rtl">
              <div class="header">
                <h1>${this.companyInfo.name}</h1>
              </div>
              <div class="content">
                <h3>${data.title}</h3>
                <p>${data.message}</p>
              </div>
              <div class="footer">
                <p>📞 ${this.companyInfo.phone} | 📧 ${this.companyInfo.email}</p>
              </div>
            </div>
          `,
          text: `${data.title}\n\n${data.message}`
        };
    }
  }

  // Public methods for different notification types
  async sendWelcomeNotification(userId: number): Promise<boolean> {
    return this.sendNotification({
      userId,
      title: "مرحباً بك في مزاد السعودية",
      message: "تم إنشاء حسابك بنجاح. ابدأ الآن بتصفح المزادات والمشاركة في المزايدة!",
      type: 'welcome'
    });
  }

  async sendBidNotification(userId: number, auctionTitle: string, newBidAmount: string): Promise<boolean> {
    return this.sendNotification({
      userId,
      title: "مزايدة جديدة",
      message: `تم تسجيل مزايدة جديدة على "${auctionTitle}" بمبلغ ${newBidAmount} ريال سعودي.`,
      type: 'bid_notification'
    });
  }

  async sendWinNotification(userId: number, auctionTitle: string, finalAmount: string): Promise<boolean> {
    return this.sendNotification({
      userId,
      title: "مبروك! لقد فزت بالمزاد",
      message: `تهانينا! لقد فزت بمزاد "${auctionTitle}" بمبلغ ${finalAmount} ريال سعودي. سيتم التواصل معك قريباً لترتيب الاستلام والدفع.`,
      type: 'win_notification'
    });
  }

  async sendContactFormNotification(formData: any): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured for contact form');
      return false;
    }

    try {
      const msg = {
        to: this.companyInfo.email,
        from: {
          email: 'noreply@mazadksa.com',
          name: this.companyInfo.name
        },
        subject: `رسالة جديدة من النموذج: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>رسالة جديدة من موقع ${this.companyInfo.name}</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>الاسم:</strong> ${formData.name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
              <p><strong>الهاتف:</strong> ${formData.phone}</p>
              <p><strong>الموضوع:</strong> ${formData.subject}</p>
              <p><strong>الرسالة:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 5px;">${formData.message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              تم إرسال هذه الرسالة من نموذج التواصل في موقع ${this.companyInfo.name}
            </p>
          </div>
        `,
        text: `رسالة جديدة من ${formData.name}\nالبريد: ${formData.email}\nالهاتف: ${formData.phone}\nالموضوع: ${formData.subject}\nالرسالة: ${formData.message}`
      };

      await this.mailService.send(msg);
      console.log('Contact form email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending contact form email:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();