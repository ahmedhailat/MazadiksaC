import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTranslation } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserCheck, Phone, CreditCard, Upload, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const registrationSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  lastName: z.string().min(2, "اسم العائلة مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
  nationalId: z.string().min(10, "رقم الهوية يجب أن يكون 10 أرقام"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface AccountRegistrationProps {
  onComplete: (registrationData: any) => void;
  onCancel: () => void;
}

export function AccountRegistration({ onComplete, onCancel }: AccountRegistrationProps) {
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage.direction === 'rtl';
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
    },
  });

  const handlePersonalInfoSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register-personal-info", data);
      const result = await response.json();
      
      setRegistrationData({ ...data, userId: result.userId });
      setCurrentStep(2);
      
      toast({
        title: "تم حفظ البيانات الشخصية",
        description: "سيتم إرسال رمز التحقق إلى رقم هاتفك",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ البيانات",
        description: error.message || "حدث خطأ أثناء حفظ البيانات الشخصية",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "رمز التحقق غير صحيح",
        description: "يرجى إدخال رمز التحقق المكون من 6 أرقام",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/auth/verify-phone", {
        userId: registrationData.userId,
        verificationCode
      });
      
      setIsPhoneVerified(true);
      setCurrentStep(3);
      
      toast({
        title: "تم التحقق من الهاتف",
        description: "تم التحقق من رقم هاتفك بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "فشل في التحقق",
        description: error.message || "رمز التحقق غير صحيح",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentVerification = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/payments/create-registration-fee", {
        userId: registrationData.userId,
        amount: 100 // 100 SAR registration fee
      });
      const result = await response.json();
      
      // Redirect to payment or show payment form
      window.location.href = `/payment-verification?clientSecret=${result.clientSecret}&userId=${registrationData.userId}`;
    } catch (error: any) {
      toast({
        title: "خطأ في رسوم التسجيل",
        description: error.message || "حدث خطأ أثناء إنشاء رسوم التسجيل",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "البيانات الشخصية", icon: UserCheck },
    { number: 2, title: "التحقق من الهاتف", icon: Phone },
    { number: 3, title: "التحقق من الدفع", icon: CreditCard },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-16 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            الخطوة {currentStep} من {steps.length}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                البيانات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الأول</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="أدخل الاسم الأول" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العائلة</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="أدخل اسم العائلة" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="example@email.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="05xxxxxxxx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهوية الوطنية</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1xxxxxxxxx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                      إلغاء
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "جاري الحفظ..." : "التالي"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                التحقق من رقم الهاتف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
                تم إرسال رمز التحقق إلى {registrationData?.phone}
              </div>
              
              <div className="space-y-3">
                <Label>رمز التحقق</Label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                  maxLength={6}
                  className="text-center text-lg font-mono"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)} 
                  className="flex-1"
                >
                  السابق
                </Button>
                <Button 
                  onClick={handlePhoneVerification} 
                  disabled={isSubmitting || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isSubmitting ? "جاري التحقق..." : "تحقق"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                رسوم التسجيل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">100 ريال</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  رسوم تسجيل لمرة واحدة للتحقق من الحساب
                </div>
              </div>

              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="p-4">
                  <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <div className="font-medium">فوائد التسجيل المدفوع:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• التحقق من الهوية والحساب</li>
                      <li>• إمكانية المشاركة في جميع المزادات</li>
                      <li>• الحصول على شارة "عضو موثق"</li>
                      <li>• أولوية في خدمة العملاء</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(2)} 
                  className="flex-1"
                >
                  السابق
                </Button>
                <Button 
                  onClick={handlePaymentVerification} 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "جاري التحضير..." : "دفع رسوم التسجيل"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}