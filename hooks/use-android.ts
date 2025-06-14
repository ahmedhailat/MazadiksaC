
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useAndroid() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Detect Android device
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));

    // Detect if app is installed (standalone mode)
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register service worker for Android features
    if ('serviceWorker' in navigator && isAndroid) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('SW registered for Android:', registration);
      }).catch((error) => {
        console.log('SW registration failed:', error);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isAndroid]);

  const installApp = async () => {
    if (!installPrompt) return false;

    try {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Install failed:', error);
      return false;
    }
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Send welcome notification
        new Notification('مزاد السعودية', {
          body: 'مرحباً بك! سنرسل لك إشعارات المزادات الجديدة',
          icon: '/generated-icon.png',
          tag: 'welcome',
          vibrate: [200, 100, 200]
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Notification request failed:', error);
      return false;
    }
  };

  const shareAuction = async (title: string, text: string, url: string) => {
    if (navigator.share && isAndroid) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
    
    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
        return true;
      } catch (error) {
        console.log('Clipboard failed:', error);
      }
    }
    
    return false;
  };

  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator && isAndroid) {
      navigator.vibrate(pattern);
    }
  };

  const addToHomeScreen = () => {
    if (isAndroid && !isStandalone) {
      // Show custom instructions for adding to home screen
      const instructions = `
        لإضافة التطبيق إلى الشاشة الرئيسية:
        1. اضغط على قائمة المتصفح (⋮)
        2. اختر "إضافة إلى الشاشة الرئيسية"
        3. اضغط "إضافة"
      `;
      alert(instructions);
    }
  };

  return {
    isAndroid,
    isStandalone,
    canInstall: !!installPrompt,
    notificationPermission,
    installApp,
    requestNotifications,
    shareAuction,
    vibrate,
    addToHomeScreen
  };
}

// Hook for Android-optimized gestures
export function useAndroidGestures() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(userAgent.includes('android'));
  }, []);

  const handleSwipeGesture = (element: HTMLElement, onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
    if (!isAndroid) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  };

  const enablePullToRefresh = (onRefresh: () => void) => {
    if (!isAndroid) return;

    let startY = 0;
    let pullDistance = 0;
    const maxPull = 100;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0) {
        pullDistance = e.touches[0].clientY - startY;
        
        if (pullDistance > 0 && pullDistance < maxPull) {
          e.preventDefault();
          // Visual feedback could be added here
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 50) {
        onRefresh();
      }
      startY = 0;
      pullDistance = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  };

  return {
    isAndroid,
    handleSwipeGesture,
    enablePullToRefresh
  };
}
