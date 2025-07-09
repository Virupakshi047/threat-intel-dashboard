import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Shield, Search } from 'lucide-react';

interface NavigationMenuProps {
  className?: string;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    title: 'Threats',
    href: '/threats',
    icon: Shield,
  },
  {
    title: 'Analysis',
    href: '/analysis',
    icon: Search,
  },
];

export const NavigationMenu = ({ className }: NavigationMenuProps) => {
  return (
    <nav className={cn('flex items-center space-x-6 text-sm font-medium', className)}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                isActive ? 'text-foreground' : 'text-foreground/60'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};