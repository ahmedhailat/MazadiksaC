import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, Gavel, Menu, X, User, Heart, ShoppingCart as CartIcon, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { key: 'all', href: '/' },
  { key: 'cars', href: '/category/cars' },
  { key: 'electronics', href: '/category/electronics' },
  { key: 'jewelry', href: '/category/jewelry' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];

export function Header() {
  const { t, currentLanguage } = useTranslation();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const { user, isAuthenticated, isLoading } = useAuth();
  const { forceShowOnboarding } = useOnboarding();

  const isRTL = currentLanguage.direction === 'rtl';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Refresh the page to clear user state
      window.location.reload();
      toast({
        title: currentLanguage.code === 'ar' ? "تم تسجيل الخروج" : "Logged Out",
        description: currentLanguage.code === 'ar' ? "تم تسجيل خروجك بنجاح" : "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', searchQuery);
  };

  return (
    <>
      {/* Top Language Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {currentLanguage.code === 'ar' ? 'مرحباً بكم في مزاد السعودية' : 'Welcome to Mazad KSA'}
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="text-gray-600 dark:text-gray-400">
                {currentLanguage.code === 'ar' ? 'دعم العملاء: 920012345' : 'Support: 920012345'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 text-[#3c445c] text-center">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Gavel className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('brand.name')}
              </h1>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/auctions" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                {t('nav.auctions')}
              </Link>
              <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                {t('nav.categories')}
              </Link>
              <Link href="/my-auctions" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                {t('nav.my-auctions')}
              </Link>

              {/* Rewards Widget */}
              <Link href="/rewards" className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">2,450</span>
                  <span className="text-yellow-500">⭐</span>
                </div>
              </Link>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Cultural Tour Trigger */}
              {isAuthenticated && (
                <OnboardingTrigger onClick={forceShowOnboarding} />
              )}

              {/* Auth Buttons */}
              {isLoading ? (
                <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLanguage.code === 'ar' ? 'مرحباً' : 'Welcome'} {user?.fullName || user?.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {currentLanguage.code === 'ar' ? 'خروج' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <LogIn className="h-4 w-4 mr-2" />
                    {currentLanguage.code === 'ar' ? 'دخول' : 'Login'}
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>
      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                  location === category.href
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                }`}
              >
                {t(`category.${category.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2`}
              />
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-gray-400`} />
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              <Link href="/auctions" className="text-gray-700 dark:text-gray-300 hover:text-primary py-2">
                {t('nav.auctions')}
              </Link>
              <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-primary py-2">
                {t('nav.categories')}
              </Link>
              <Link href="/my-auctions" className="text-gray-700 dark:text-gray-300 hover:text-primary py-2">
                {t('nav.my-auctions')}
              </Link>
            </div>

            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                <Button className="bg-primary hover:bg-blue-700 text-white">
                  {t('auth.login')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
