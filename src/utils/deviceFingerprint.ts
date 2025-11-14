export const getDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  let fingerprint = '';

  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    fingerprint += canvas.toDataURL();
  }

  const navigator_info = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: 'ontouchstart' in window,
  };

  fingerprint += JSON.stringify(navigator_info);

  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `device_${Math.abs(hash).toString(36)}`;
};

export const getRequestCount = (deviceId: string): number => {
  const key = `request_count_${deviceId}`;
  return parseInt(localStorage.getItem(key) || '0');
};

export const incrementRequestCount = (deviceId: string): number => {
  const key = `request_count_${deviceId}`;
  const count = getRequestCount(deviceId);
  const newCount = count + 1;
  localStorage.setItem(key, newCount.toString());
  return newCount;
};

export const resetRequestCount = (deviceId: string): void => {
  const key = `request_count_${deviceId}`;
  localStorage.removeItem(key);
};

export const isUserRegistered = (): boolean => {
  return localStorage.getItem('user_registered') === 'true';
};
