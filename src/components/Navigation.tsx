import { NavLink } from 'react-router-dom';
import { Home, User, Brain, List } from 'lucide-react';

export function Navigation() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/journey', icon: User, label: 'My Journey' },
    { to: '/habits', icon: Brain, label: 'AI Habits' },
    { to: '/techniques', icon: List, label: 'All Techniques' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors
                ${isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}