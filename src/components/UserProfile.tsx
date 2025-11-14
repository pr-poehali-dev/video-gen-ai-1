import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';

interface UserData {
  email: string;
  name: string;
  provider: string;
  registeredAt: string;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const registered = localStorage.getItem('user_registered') === 'true';
    const data = localStorage.getItem('user_data');

    setIsRegistered(registered);
    if (registered && data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_registered');
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    localStorage.setItem('request_count', '0');
    window.location.reload();
  };

  if (!isRegistered || !userData) {
    return null;
  }

  const getProviderIcon = (provider: string) => {
    if (provider === 'google') return '🌐';
    if (provider === 'github') return '⚡';
    return '✉️';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold"
        >
          {getInitials(userData.name)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {getProviderIcon(userData.provider)} {userData.provider}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icon name="User" className="mr-2" size={16} />
          Профиль
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon name="Settings" className="mr-2" size={16} />
          Настройки
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <Icon name="LogOut" className="mr-2" size={16} />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
