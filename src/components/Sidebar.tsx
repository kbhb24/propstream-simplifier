import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  Tags,
  List,
  Activity,
  Mail,
  Phone,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Records', href: '/dashboard/records', icon: FileText },
  { name: 'Lists', href: '/dashboard/lists', icon: List },
  { name: 'Tags', href: '/dashboard/tags', icon: Tags },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Direct Mail', href: '/dashboard/direct-mail', icon: Mail },
  { name: 'Phone Book', href: '/dashboard/phonebook', icon: Phone },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold">PropStream</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="p-4">
          <Button asChild className="w-full justify-start" variant="outline">
            <Link to="/dashboard/records/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Record
            </Link>
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
} 