import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically resets the window scroll position to the very top
 * whenever the route path or search parameters change.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Reset window and document scroll immediately to top
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    } catch {
      window.scrollTo(0, 0);
    }
    
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
}

