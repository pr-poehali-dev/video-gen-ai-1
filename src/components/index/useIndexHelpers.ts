import { 
  getRequestCount, 
  incrementRequestCount as incrementDeviceCount,
  isUserRegistered 
} from '@/utils/deviceFingerprint';

export const useIndexHelpers = (
  deviceId: string,
  setRequestCount: (count: number) => void,
  setIsAuthModalOpen: (open: boolean) => void,
  setIsMobileMenuOpen: (open: boolean) => void,
  toast: any
) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const checkRequestLimit = () => {
    if (isUserRegistered()) return true;

    const count = getRequestCount(deviceId);
    if (count >= 2) {
      setIsAuthModalOpen(true);
      toast({
        title: 'Лимит исчерпан',
        description: `Вы использовали все ${count} бесплатных запроса с этого устройства. Зарегистрируйтесь для продолжения!`,
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleIncrementRequest = () => {
    if (!isUserRegistered()) {
      const newCount = incrementDeviceCount(deviceId);
      setRequestCount(newCount);
      
      const remaining = 2 - newCount;
      if (remaining > 0) {
        toast({
          title: 'Запрос выполнен',
          description: `Осталось бесплатных запросов: ${remaining}`,
        });
      }
    }
  };

  return {
    scrollToSection,
    checkRequestLimit,
    handleIncrementRequest
  };
};
