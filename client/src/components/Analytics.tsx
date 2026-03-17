import { useEffect } from 'react';
import { useLocation } from 'wouter';

const GA_MEASUREMENT_ID = 'G-YTSTNS4SXQ';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location,
      });
    }
  }, [location]);

  return null;
}
