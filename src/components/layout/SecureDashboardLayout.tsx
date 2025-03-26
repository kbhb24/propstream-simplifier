
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
} from 'lucide-react';

interface SecureDashboardLayoutProps {
  children: React.ReactNode;
}

const SecureDashboardLayout: React.FC<SecureDashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:block lg:w-64">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="absolute inset-y-0 left-0 w-64 bg-background">
          <button
            className="absolute right-4 top-4 text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <DashboardSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background border-b border-border px-4 sm:px-6">
          <button
            className="block lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center flex-1">
            <h1 className="text-lg font-semibold hidden md:block">Scale Pro Data Flow</h1>
          </div>

          {/* Search */}
          <div className="mx-4 flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                asChild
              >
                <Link to="/dashboard/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SecureDashboardLayout;
