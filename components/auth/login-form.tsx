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
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const loginSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  password: z.string().min(4, "كلمة المرور يجب أن تكون 4 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: currentLanguage.code === 'ar' ? "تم تسجيل الدخول بنجاح" : "Login Successful",
        description: currentLanguage.code === 'ar' 
          ? `مرحباً ${data.user.fullName}! استمتع بالمزادات المخصصة لك`
          : `Welcome ${data.user.fullName}! Enjoy your personalized auctions`,
      });
      
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: currentLanguage.code === 'ar' ? "خطأ في تسجيل الدخول" : "Login Error",
        description: error.message || (currentLanguage.code === 'ar' 
          ? "تعذر تسجيل الدخول، تحقق من البيانات"
          : "Failed to login, please check your credentials"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <LogIn className="h-6 w-6 text-blue-600" />
          {currentLanguage.code === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLanguage.code === 'ar' 
            ? 'ادخل للوصول إلى المزادات المخصصة لك'
            : 'Sign in to access your personalized auctions'
          }
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {currentLanguage.code === 'ar' ? 'اسم المستخدم' : 'Username'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={currentLanguage.code === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                      className={isRTL ? 'text-right' : 'text-left'}
                    />
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
                        className={isRTL ? 'text-right pr-10' : 'text-left pl-10'}
                      />
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

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  {currentLanguage.code === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                </div>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {currentLanguage.code === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Demo credentials helper */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {currentLanguage.code === 'ar' ? 'للتجربة السريعة:' : 'Quick Demo:'}
          </h4>
          <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <p>
              {currentLanguage.code === 'ar' ? 'اسم المستخدم: ' : 'Username: '}
              <code className="bg-white dark:bg-gray-800 px-1 rounded">demo</code>
            </p>
            <p>
              {currentLanguage.code === 'ar' ? 'كلمة المرور: ' : 'Password: '}
              <code className="bg-white dark:bg-gray-800 px-1 rounded">1234</code>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              form.setValue("username", "demo");
              form.setValue("password", "1234");
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {currentLanguage.code === 'ar' ? 'استخدم بيانات التجربة' : 'Use Demo Credentials'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}