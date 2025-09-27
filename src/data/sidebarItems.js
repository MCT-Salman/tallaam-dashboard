import { Home, BookOpen, Users, Settings, User, BarChart3, Bell, DollarSign, Megaphone, Percent, UserCheck, MessageSquare, Link as LinkIcon, Image} from "lucide-react"

export const sidebarItems = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: Home
  },
  {
    title: "إدارة الدورات",
    href: "/courses",
    icon: BookOpen
  },
  {
    title: "إدارة الطلاب",
    href: "/students",
    icon: Users
  },
  {
    title: "إدارة المبيعات",
    href: "/sales",
    icon: DollarSign
  },
  {
    title: "الإدارة المالية",
    href: "/financial",
    icon: BarChart3
  },
  {
    title: "إدارة الإعلانات",
    href: "/ads",
    icon: Megaphone
  },
  {
    title: "كوبونات الخصم",
    href: "/coupons",
    icon: Percent
  },
  {
    title: "إدارة القصص",
    href: "/stories",
    icon: Image
  },
  {
    title: "المدراء الفرعيين",
    href: "/sub-admins",
    icon: UserCheck
  },
  {
    title: "المقترحات",
    href: "/suggestions",
    icon: MessageSquare
  },
  {
    title: "التحقق من الروابط",
    href: "/link-verification",
    icon: LinkIcon
  },
  {
    title: "الإشعارات",
    href: "/notifications",
    icon: Bell
  },
  {
    title: "إعدادات الإدارة",
    href: "/settings",
    icon: Settings
  },
  {
    title: "الملف الشخصي",
    href: "/profile",
    icon: User
  },
//   {
//     title: "الإعدادات",
//     href: "/settings",
//     icon: Settings
//   }
]

// العناصر الأساسية للعرض في الشاشات الصغيرة
export const mainItems = [
  { title: "الرئيسية", href: "/dashboard", icon: Home },
  { title: "الدورات", href: "/admin/courses", icon: BookOpen },
  { title: "الطلاب", href: "/admin/students", icon: Users },
  { title: "المبيعات", href: "/admin/sales", icon: DollarSign }
]