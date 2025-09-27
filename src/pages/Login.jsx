import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Phone, Lock, GraduationCap, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import heroImg from "/tallaam_logo.png"
import { countries } from "../data/countriesPhone"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState({
    countryCode: "+963",
    countryName: "سوريا"
  })
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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
    phone: "",
    password: ""
  })
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.phone, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يُرجى التحقق من البريد الإلكتروني وكلمة المرور.');
      console.error("Login error:", err);
    }
  }

  const buttonClasses = `w-full !p-3 rounded-md text-base font-medium border text-white transition-colors duration-200 cursor-pointer !mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${loading ? 'opacity-60 cursor-not-allowed' : ''
    }`

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20" dir="rtl">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0);' }}>


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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block">رقم الهاتف</Label>
                  <div className="relative">
                    <div className="flex gap-2">
                      {/* Phone Input */}
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0000000000"
                        value={formData.phone || ''}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="pr-10 text-left"
                        dir="ltr"
                        required
                      />
                      {/* Country Code Selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center gap-2 px-3 py-2 h-10 rounded-md bg-secondary text-white border border-border hover:bg-secondary/80 transition-colors min-w-[90px] justify-center"
                        >
                          <span className="text-sm font-medium" dir="ltr">{selectedCountry.countryCode}</span>
                          <ChevronDown className="w-4 h-4 text-white" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            <div className="p-2 border-b">
                              <Input
                                type="text"
                                placeholder="ابحث عن دولة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="text-right"
                                autoFocus
                              />
                            </div>
                            <div className="p-2">
                              {countries
                                .filter(country =>
                                  country.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  country.countryCode.includes(searchTerm)
                                )
                                .map((country) => (
                                  <button
                                    key={country.countryCode}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country)
                                      setShowCountryDropdown(false)
                                      setSearchTerm("")
                                    }}
                                    className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 hover:bg-accent rounded-md transition-colors text-right"
                                  >
                                    <span className="text-sm text-muted-foreground flex-1">{country.countryName}</span>
                                    <span className="text-sm font-medium" dir="LTR">{country.countryCode}</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                  <p className={`text-sm text-center !mt-2 text-red-600`}>
                    {error}
                  </p>
                )}

                {/* Login Button */}
                <Button type="submit" className="w-full cursor-pointer">تسجيل الدخول</Button>
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
