import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

const ONBOARDING_STORAGE_KEY = "mazad-onboarding-completed";

export function useOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has completed onboarding
      const completedOnboarding = localStorage.getItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`);
      
      if (!completedOnboarding) {
        setIsFirstTime(true);
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, user]);

  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`, "true");
      setShowOnboarding(false);
      setIsFirstTime(false);
    }
  };

  const skipOnboarding = () => {
    if (user) {
      localStorage.setItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`, "skipped");
      setShowOnboarding(false);
    }
  };

  const resetOnboarding = () => {
    if (user) {
      localStorage.removeItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`);
      setShowOnboarding(true);
      setIsFirstTime(true);
    }
  };

  const forceShowOnboarding = () => {
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    isFirstTime,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    forceShowOnboarding,
  };
}