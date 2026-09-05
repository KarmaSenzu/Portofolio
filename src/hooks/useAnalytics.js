import { useCallback } from 'react';
import { trackDemoClick, trackRepoClick, trackPageView, getAnalyticsSummary } from '../utils/analytics';

// Custom hook for analytics tracking
export const useAnalytics = () => {
    // Track demo link click
    const onDemoClick = useCallback((projectId, url) => {
        trackDemoClick(projectId);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }, []);

    // Track repo link click
    const onRepoClick = useCallback((projectId, url) => {
        trackRepoClick(projectId);
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }, []);

    // Track page view
    const onPageView = useCallback((pageName) => {
        trackPageView(pageName);
    }, []);

    // Get analytics summary
    const getSummary = useCallback(() => {
        return getAnalyticsSummary();
    }, []);

    return {
        onDemoClick,
        onRepoClick,
        onPageView,
        getSummary
    };
};

export default useAnalytics;
