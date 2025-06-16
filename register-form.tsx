import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const registerSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  fullName: z.string().min(2, "الاسم الكامل يجب أن يكون حرفين على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data;
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: currentLanguage.code === 'ar' ? "تم إنشاء الحساب بنجاح" : "Account Created Successfully",
        description: currentLanguage.code === 'ar' 
          ? `مرحباً ${data.user.fullName}! يمكنك الآن الاستمتاع بالمزادات المخصصة لك`
          : `Welcome ${data.user.fullName}! You can now enjoy personalized auctions`,
      });
      
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: currentLanguage.code === 'ar' ? "خطأ في إنشاء الحساب" : "Registration Error",
        description: error.message || (currentLanguage.code === 'ar' 
          ? "تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى"
          : "Failed to create account, please try again"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <UserPlus className="h-6 w-6 text-green-600" />
          {currentLanguage.code === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLanguage.code === 'ar' 
            ? 'انضم إلينا واحصل على توصيات مزادات مخصصة'
            : 'Join us and get personalized auction recommendations'
          }
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentLanguage.code === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        placeholder={currentLanguage.code === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        className={isRTL ? 'text-right pr-10' : 'text-left pl-10'}
                      />
                      <User className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentLanguage.code === 'ar' ? 'اسم المستخدم' : 'Username'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        placeholder={currentLanguage.code === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                        className={isRTL ? 'text-right pr-10' : 'text-left pl-10'}
                      />
                      <User className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentLanguage.code === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="email"
                        placeholder={currentLanguage.code === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        className={isRTL ? 'text-right pr-10' : 'text-left pl-10'}
                      />
                      <Mail className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentLanguage.code === 'ar' ? 'كلمة المرور' : 'Password'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={currentLanguage.code === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                        className={isRTL ? 'text-right px-10' : 'text-left px-10'}
                      />
                      <Lock className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                          isRTL ? 'left-3' : 'right-3'
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentLanguage.code === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={currentLanguage.code === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                        className={isRTL ? 'text-right px-10' : 'text-left px-10'}
                      />
                      <Lock className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                          isRTL ? 'left-3' : 'right-3'
                        }`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  {currentLanguage.code === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating Account...'}
                </div>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {currentLanguage.code === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}