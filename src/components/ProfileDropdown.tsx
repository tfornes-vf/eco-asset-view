import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut, Sun, Moon, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(profile?.display_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">
            {profile?.display_name || 'Usuario'}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {profile?.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('profile.settings')}</span>
        </DropdownMenuItem>
        
        {(profile?.role === 'superuser' || profile?.role === 'admin') && (
          <DropdownMenuItem onClick={() => navigate('/users')}>
            <Users className="mr-2 h-4 w-4" />
            <span>{t('profile.users') || 'Usuarios'}</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center">
            {theme === 'dark' ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span className="text-sm">
              {theme === 'dark' ? t('profile.darkMode') : t('profile.lightMode')}
            </span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
            className="scale-75"
          />
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('auth.signout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;