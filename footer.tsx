import { Link } from "wouter";
import { Gavel, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { key: 'nav.auctions', href: '/auctions' },
    { key: 'nav.categories', href: '/categories' },
    { label: 'كيف تعمل', href: '/how-it-works' },
    { label: 'الشروط والأحكام', href: '/terms' },
    { label: 'سياسة الخصوصية', href: '/privacy' },
  ];

  const supportLinks = [
    { label: 'مركز المساعدة', href: '/help' },
    { label: 'اتصل بنا', href: '/contact' },
    { label: 'الأسئلة الشائعة', href: '/faq' },
    { label: 'دليل المزايدة', href: '/guide' },
    { label: 'تقديم شكوى', href: '/complaint' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Gavel className="h-6 w-6 text-primary" />
              <h4 className="text-xl font-bold">{t('brand.name')}</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">{t('footer.quick-links')}</h5>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.key ? t(link.key) : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-lg font-semibold mb-4">{t('footer.support')}</h5>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-lg font-semibold mb-4">{t('footer.contact-info')}</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">+966 11 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@mazadksa.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  الرياض، المملكة العربية السعودية<br />
                  حي الملك فهد
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
