import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../../services/analitycs.service';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    analytics.initialize();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      analytics.trackPageView(
        `${location.pathname}${location.search}`,
        document.title,
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return null;
}

export default AnalyticsTracker;