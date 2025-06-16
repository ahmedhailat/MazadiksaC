
import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Smartphone, Download, Wifi, Bell } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function AndroidFeatures() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Detect Android
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));

    // Detect standalone mode (installed PWA)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('مزاد السعودية', {
          body: 'سيتم إرسال إشعارات المزادات الجديدة إليك!',
          icon: '/generated-icon.png',
          tag: 'welcome'
        });
      }
    }
  };

  if (!isAndroid || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg border-0">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">
              تثبيت التطبيق على Android
            </h3>
            <p className="text-xs opacity-90 mb-3">
              احصل على تجربة تطبيق أصلي مع إشعارات فورية ووصول سريع
            </p>
            
            <div className="flex gap-2">
              {deferredPrompt && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={handleInstallClick}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  تثبيت
                </Button>
              )}
              
              {notificationPermission !== 'granted' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={requestNotificationPermission}
                  className="text-xs border-white/30 text-white hover:bg-white/10"
                >
                  <Bell className="h-3 w-3 mr-1" />
                  الإشعارات
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Android Features List */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              <span>يعمل بدون إنترنت</span>
            </div>
            <div className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              <span>إشعارات فورية</span>
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              <span>تجربة أصلية</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>تثبيت سريع</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook for Android-specific features
export function useAndroidFeatures() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handleBeforeInstallPrompt = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return { isAndroid, isStandalone, canInstall };
}
