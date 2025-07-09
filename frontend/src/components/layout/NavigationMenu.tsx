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
  }
];

export const NavigationMenu = ({ className }: NavigationMenuProps) => {
  return (
    <nav className={cn('flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-6 md:space-y-0 text-sm font-medium', className)}>
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