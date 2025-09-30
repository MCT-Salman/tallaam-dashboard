import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import heroImg from "/tallaam_logo.png"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  // لم يعد هناك اختيار دولة/كود
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate()
  const location = useLocation();

  // منع المستخدمين المسجلين من الوصول إلى صفحة تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  })
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    // Prevent default form submission immediately
    e.preventDefault();
    e.stopPropagation();
    
    // Clear previous errors
    setError('');
    
    // Validate form data
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    try {
      console.log('Starting login process...');
      // The login function will handle the loading state
      await login(formData.identifier, formData.password);
      console.log('Login successful, navigation will be handled by useEffect');
      // Navigation will be handled by the useEffect hook when isAuthenticated changes
    } catch (err) {
      console.error('Login error caught in handleSubmit:', err);
      // Display detailed error message
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message ||
                         'فشل تسجيل الدخول. يُرجى التحقق من اسم المستخدم وكلمة المرور.';
      setError(errorMessage);
      console.error("Full error details:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
      }
    }
  }

  const buttonClasses = `w-full !p-3 rounded-md text-base font-medium border text-white transition-colors duration-200 cursor-pointer !mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${loading ? 'opacity-60 cursor-not-allowed' : ''
    }`

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20" dir="rtl">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">


        {/* Right form panel */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/60 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center">
                <img src="/tallaam_logo2.png" alt="تعلّم" className="h-16 object-contain" />
              </div>
              <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
              <CardDescription>أدخل بياناتك للوصول إلى حسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                onKeyDown={(e) => {
                  // Prevent form submission on Enter key in input fields
                  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    // You can optionally trigger the submit manually here
                    // handleSubmit(e);
                  }
                }}
              >
                {/* Identifier Field */}
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-right block">اسم المستخدم أو الهاتف</Label>
                  <div className="relative">
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="ايميل / اسم المستخدم"
                      value={formData.identifier || ''}
                      onChange={e => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                      className="pr-3"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10 pl-10"
                      required
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={loading}
                      className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-accent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex items-center justify-between gap-4">
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-hover transition-colors">
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 !mt-4">
                    <p className="text-sm text-center text-red-700 font-medium">
                      {error}
                    </p>
                  </div>
                )}

                {/* Login Button */}
                <Button 
                  type="button" 
                  className="w-full cursor-pointer"
                  disabled={loading}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Create a synthetic event to pass to handleSubmit
                    const syntheticEvent = {
                      preventDefault: () => {},
                      stopPropagation: () => {}
                    };
                    await handleSubmit(syntheticEvent);
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      جاري تسجيل الدخول...
                    </span>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Left hero panel */}
        <div className="relative bg-primary hidden md:block">
          <div
            className="absolute inset-0 bg-center bg-no-repeat -top-90"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000]/70 to-background/20" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-12">
            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20">
              <GraduationCap className="w-10 h-10 text-white" />
            </div> */}
            <h1 className="text-3xl font-bold text-white mb-3">مرحباً بك في منصة تعلّم</h1>
            <p className="text-white/80 max-w-md">سجل دخولك للوصول إلى لوحة التحكم وإدارة المنصة بسهولة.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
