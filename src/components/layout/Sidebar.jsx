// src\components\layout\Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import {  LogOut, X, ChevronUp, ChevronDown} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { sidebarItems, mainItems } from "@/data/sidebarItems"

// إضافة الـ CSS للمحتوى الرئيسي في الشاشات الصغيرة
const styles = `
  @media (max-width: 767px) {
    .mobile-sidebar-padding {
      padding-bottom: 70px !important;
    }
    
    /* تأكيد أن المحتوى الرئيسي لا يختفي خلف الشريط السفلي */
    main, .main-content, #root > div {
      padding-bottom: 5px;
    }
  }
`

// إضافة الـ styles للـ head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  if (!document.head.querySelector('[data-sidebar-mobile-styles]')) {
    styleElement.setAttribute('data-sidebar-mobile-styles', 'true')
    document.head.appendChild(styleElement)
  }
}



export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const navigate = useNavigate()

  // إضافة class للـ body في الشاشات الصغيرة لإضافة padding-bottom
  useEffect(() => {
    const body = document.body
    const isMobile = window.innerWidth < 768
    
    if (isMobile) {
      body.classList.add('mobile-sidebar-padding')
    } else {
      body.classList.remove('mobile-sidebar-padding')
    }

    // تنظيف عند إزالة المكون
    return () => {
      body.classList.remove('mobile-sidebar-padding')
    }
  }, [])

  // إضافة مستمع لتغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      const body = document.body
      const isMobile = window.innerWidth < 768
      
      if (isMobile) {
        body.classList.add('mobile-sidebar-padding')
      } else {
        body.classList.remove('mobile-sidebar-padding')
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const logout = () =>{
    navigate('/login')
  } 

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "bg-card border-l border-border transition-all duration-300 flex flex-col fixed top-0 right-0 h-screen z-50",
          "hidden md:flex", // إخفاء في الشاشات الصغيرة
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header - Fixed */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!collapsed && (
                <>
                  <img
                    src="/tallaam_logo2.png"
                    alt="تعلّم"
                    className="w-10 h-10 object-contain"
                  />
                  <span className="font-bold text-xl text-primary block">تعلّم</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hover:bg-accent"
            >
              {collapsed ? (
                <img
                  src="/tallaam_logo2.png"
                  alt="تعلّم"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <X className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-primary max-h-[calc(100vh-150px)]">
          {sidebarItems.map(item => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="block">{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer - Fixed */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full cursor-pointer justify-start gap-3 bg-secondary text-white hover:text-foreground hover:bg-accent",
              collapsed && "justify-center"
            )}
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="block">تسجيل الخروج</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-around px-2 py-2.5">
          {mainItems.map(item => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs font-medium min-w-0 flex-1",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate text-center w-full">{item.title}</span>
              </Link>
            )
          })}
          
          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs font-medium min-w-0",
              "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {mobileExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
            <span className="text-xs">المزيد</span>
          </Button>
        </div>

        {/* Expanded Menu */}
        {mobileExpanded && (
          <div className="border-t border-border bg-card max-h-80 overflow-y-auto">
            <div className="p-4">
              {/* Logo and Title */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <img
                  src="/tallaam_logo2.png"
                  alt="تعلّم"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-lg text-primary">تعلّم</span>
              </div>

              {/* All Menu Items */}
              <div className="grid grid-cols-2 gap-2">
                {sidebarItems.map(item => {
                  const isActive = location.pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileExpanded(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-sm font-medium",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  className="flex cursor-pointer items-center gap-3 px-3 py-3 text-sm font-medium bg-secondary text-white hover:text-foreground hover:bg-accent justify-start"
                  onClick={() => logout()}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {mobileExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileExpanded(false)}
        />
      )}
    </>
  )
}