import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTranslation, languages } from "@/lib/i18n";

export function LanguageToggle() {
  const { currentLanguage, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = currentLanguage.code === 'ar' ? languages.en : languages.ar;
    setLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
    >
      <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {currentLanguage.name}
      </span>
    </Button>
  );
}
