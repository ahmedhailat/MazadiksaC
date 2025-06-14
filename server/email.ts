import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SendGrid API key not configured');
    return false;
  }

  try {
    const msg = {
      to: params.to,
      from: params.from || 'noreply@mazadksa.com',
      subject: params.subject,
      content: [
        {
          type: 'text/plain',
          value: params.text || ''
        },
        {
          type: 'text/html',
          value: params.html || params.text || ''
        }
      ]
    };

    await mailService.send(msg);
    console.log('Email sent successfully to:', params.to);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateBidNotificationEmail(
  userName: string,
  auctionTitle: string,
  newBidAmount: string,
  currentPrice: string,
  auctionUrl: string,
  language: 'ar' | 'en' = 'ar'
) {
  if (language === 'ar') {
    return {
      subject: `تم تجاوز مزايدتك في ${auctionTitle}`,
      html: `
        <div dir="rtl" style="font-family: 'Noto Sans Arabic', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">مرحباً ${userName}</h2>
          <p>نأسف لإبلاغك أنه تم تجاوز مزايدتك في:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1f2937;">${auctionTitle}</h3>
            <p style="margin: 10px 0;">المزايدة الجديدة: <strong>${newBidAmount} ريال</strong></p>
            <p style="margin: 10px 0;">السعر الحالي: <strong>${currentPrice} ريال</strong></p>
          </div>
          <p>يمكنك المزايدة مرة أخرى لاستعادة موقعك في المقدمة!</p>
          <a href="${auctionUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">عرض المزاد</a>
          <p style="color: #6b7280; font-size: 14px;">شكراً لك لاختيارك مزاد KSA</p>
        </div>
      `,
      text: `مرحباً ${userName}, تم تجاوز مزايدتك في ${auctionTitle}. المزايدة الجديدة: ${newBidAmount} ريال. يمكنك المزايدة مرة أخرى: ${auctionUrl}`
    };
  } else {
    return {
      subject: `Your bid has been outbid on ${auctionTitle}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Hello ${userName}</h2>
          <p>We're sorry to inform you that your bid has been outbid on:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1f2937;">${auctionTitle}</h3>
            <p style="margin: 10px 0;">New bid: <strong>SAR ${newBidAmount}</strong></p>
            <p style="margin: 10px 0;">Current price: <strong>SAR ${currentPrice}</strong></p>
          </div>
          <p>You can bid again to regain your leading position!</p>
          <a href="${auctionUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">View Auction</a>
          <p style="color: #6b7280; font-size: 14px;">Thank you for choosing Mazad KSA</p>
        </div>
      `,
      text: `Hello ${userName}, your bid has been outbid on ${auctionTitle}. New bid: SAR ${newBidAmount}. You can bid again: ${auctionUrl}`
    };
  }
}

export function generateWinNotificationEmail(
  userName: string,
  auctionTitle: string,
  winningAmount: string,
  language: 'ar' | 'en' = 'ar'
) {
  if (language === 'ar') {
    return {
      subject: `مبروك! لقد فزت بالمزاد ${auctionTitle}`,
      html: `
        <div dir="rtl" style="font-family: 'Noto Sans Arabic', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #059669;">مبروك ${userName}!</h2>
          <p>نهنئك بفوزك في المزاد:</p>
          <div style="background: #ecfdf5; border: 2px solid #059669; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1f2937;">${auctionTitle}</h3>
            <p style="margin: 10px 0;">مبلغ الفوز: <strong>${winningAmount} ريال</strong></p>
          </div>
          <p>سنتواصل معك قريباً لتفاصيل التسليم والدفع.</p>
          <p style="color: #6b7280; font-size: 14px;">شكراً لك لاختيارك مزاد KSA</p>
        </div>
      `,
      text: `مبروك ${userName}! لقد فزت بالمزاد ${auctionTitle} بمبلغ ${winningAmount} ريال.`
    };
  } else {
    return {
      subject: `Congratulations! You won the auction for ${auctionTitle}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #059669;">Congratulations ${userName}!</h2>
          <p>We're pleased to inform you that you won the auction:</p>
          <div style="background: #ecfdf5; border: 2px solid #059669; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1f2937;">${auctionTitle}</h3>
            <p style="margin: 10px 0;">Winning amount: <strong>SAR ${winningAmount}</strong></p>
          </div>
          <p>We will contact you shortly with delivery and payment details.</p>
          <p style="color: #6b7280; font-size: 14px;">Thank you for choosing Mazad KSA</p>
        </div>
      `,
      text: `Congratulations ${userName}! You won the auction for ${auctionTitle} with SAR ${winningAmount}.`
    };
  }
}