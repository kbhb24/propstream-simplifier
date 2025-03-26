
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  CreditCard
} from 'lucide-react';

const SidebarItem = ({ icon, label, href, active }: { 
  icon: React.ReactNode; 
  label: string; 
  href: string; 
  active: boolean;
}) => (
  <Link
    to={href}
    className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-primary/10 ${
      active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

const DashboardSidebar = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'SiftLine',
      href: '/dashboard/siftline',
      icon: <GitBranch className="h-5 w-5" />,
    },
    {
      label: 'SiftMap',
      href: '/dashboard/siftmap',
      icon: <Map className="h-5 w-5" />,
    },
    {
      label: 'Records',
      href: '/dashboard/records',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: 'Phonebook',
      href: '/dashboard/phonebook',
      icon: <Phone className="h-5 w-5" />,
    },
    {
      label: 'Lists',
      href: '/dashboard/lists',
      icon: <List className="h-5 w-5" />,
    },
    {
      label: 'Tags',
      href: '/dashboard/tags',
      icon: <Tag className="h-5 w-5" />,
    },
    {
      label: 'Statuses',
      href: '/dashboard/statuses',
      icon: <ActivitySquare className="h-5 w-5" />,
    },
    {
      label: 'Activity',
      href: '/dashboard/activity',
      icon: <ActivitySquare className="h-5 w-5" />,
    },
    {
      label: 'Tasks',
      href: '/dashboard/tasks',
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      label: 'Direct Mail',
      href: '/dashboard/direct-mail',
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: 'Sequences',
      href: '/dashboard/sequences',
      icon: <PlayCircle className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: 'Affiliate',
      href: '/dashboard/affiliate',
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const actionItems = [
    {
      label: 'Upload File',
      href: '/dashboard/upload',
      icon: <Upload className="h-5 w-5" />,
    },
    {
      label: 'Need Help?',
      href: '/dashboard/help',
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      label: 'Upgrade Plan',
      href: '/pricing',
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
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

      {/* Main Menu */}
      <div className="flex-1 overflow-auto py-2 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="p-3 border-t border-border">
        <div className="space-y-1">
          {actionItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
