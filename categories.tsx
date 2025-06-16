import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import { Car, Smartphone, Gem, Wrench } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  itemCount?: number;
}

export default function CategoriesPage() {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json() as Promise<Category[]>;
    },
  });

  const getCategoryIcon = (categoryId: number) => {
    switch (categoryId) {
      case 1: return <Car className="h-8 w-8" />;
      case 2: return <Smartphone className="h-8 w-8" />;
      case 3: return <Gem className="h-8 w-8" />;
      case 4: return <Wrench className="h-8 w-8" />;
      default: return <Car className="h-8 w-8" />;
    }
  };

  const getCategoryColor = (categoryId: number) => {
    switch (categoryId) {
      case 1: return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case 2: return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
      case 3: return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case 4: return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('categories.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('categories.description')}
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category: Category) => (
              <Link key={category.id} href={`/auctions?category=${category.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${getCategoryColor(category.id)} group-hover:scale-110 transition-transform duration-300`}>
                        {getCategoryIcon(category.id)}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {currentLanguage.code === 'ar' ? category.nameAr : category.nameEn}
                      </h3>
                      
                      {category.descriptionAr && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {currentLanguage.code === 'ar' ? category.descriptionAr : category.descriptionEn}
                        </p>
                      )}
                      
                      <Badge variant="secondary" className="text-xs">
                        {category.itemCount || 0} {t('categories.itemsAvailable')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا توجد فئات متاحة
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يرجى المحاولة مرة أخرى لاحقاً
            </p>
          </div>
        )}

        {/* Popular Categories Stats */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            إحصائيات الفئات
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">125</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مزادات السيارات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">89</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مزادات الإلكترونيات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">67</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">مزادات العقارات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">43</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">معدات البناء</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}