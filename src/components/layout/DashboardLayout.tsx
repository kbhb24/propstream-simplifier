import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  GitBranch,
  Map,
  FileText,
  Phone,
  List,
  Tag,
  ActivitySquare,
  CheckSquare,
  Mail,
  PlayCircle,
  Settings,
  Users,
  Upload,
  HelpCircle,
  CreditCard,
  Menu,
  X,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'SiftLine',
      href: '/dashboard/siftline',
      icon: <GitBranch className="h-5 w-5" />,
    },
    {
      name: 'SiftMap',
      href: '/dashboard/siftmap',
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: 'Records',
      href: '/dashboard/records',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Phonebook',
      href: '/dashboard/phonebook',
      icon: <Phone className="h-5 w-5" />,
    },
    {
      name: 'Lists',
      href: '/dashboard/lists',
      icon: <List className="h-5 w-5" />,
    },
    {
      name: 'Tags',
      href: '/dashboard/tags',
      icon: <Tag className="h-5 w-5" />,
    },
    {
      name: 'Statuses',
      href: '/dashboard/statuses',
      icon: <ActivitySquare className="h-5 w-5" />,
    },
    {
      name: 'Activity',
      href: '/dashboard/activity',
      icon: <ActivitySquare className="h-5 w-5" />,
    },
    {
      name: 'Tasks',
      href: '/dashboard/tasks',
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: 'Direct Mail',
      href: '/dashboard/direct-mail',
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: 'Sequences',
      href: '/dashboard/sequences',
      icon: <PlayCircle className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: 'Affiliate',
      href: '/dashboard/affiliate',
      icon: <Users className="h-5 w-5" />,
    }
  ];

  const actionItems = [
    {
      name: 'Upload File',
      href: '/dashboard/upload',
      icon: <Upload className="h-5 w-5" />,
    },
    {
      name: 'Need Help?',
      href: '/dashboard/help',
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      name: 'Upgrade Plan',
      href: '/pricing',
      icon: <CreditCard className="h-5 w-5" />,
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">Scale Pro</span>
            </Link>
            <button
              className="block lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {profile?.first_name?.[0] || 'U'}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      location.pathname === item.href
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Items */}
          <div className="border-t border-border p-4">
            <ul className="space-y-1">
              {actionItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      location.pathname === item.href
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-border p-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
          <button
            className="block lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Header Actions */}
          <div className="flex items-center space-x-4 ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link to="/pricing">Upgrade Plan</Link>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
