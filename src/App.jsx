import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppSettingsProvider } from "./contexts/AppSettingsContext"
import { AuthProvider } from "./contexts/AuthContext"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoute"


import Login from "./pages/Login"
import CourseManagement from "./pages/CourseManagement"
import NotFound from "./pages/NotFound"
import Dashboard from "./pages/Dashboard"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppSettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CourseManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </AuthProvider>
        </AppSettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App