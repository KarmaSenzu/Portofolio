// Analytics utility for tracking clicks and engagement

const ANALYTICS_KEY = 'portfolio-analytics';

// Get analytics data from localStorage
export const getAnalytics = () => {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return createEmptyAnalytics();
        }
    }
    return createEmptyAnalytics();
};

// Create empty analytics object
const createEmptyAnalytics = () => ({
    pageViews: {},
    demoClicks: {},
    repoClicks: {},
    totalDemoClicks: 0,
    totalRepoClicks: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
});

// Save analytics to localStorage
const saveAnalytics = (analytics) => {
    analytics.lastUpdated = new Date().toISOString();
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
};

// Track a page view
export const trackPageView = (pageName) => {
    const analytics = getAnalytics();
    const today = new Date().toISOString().split('T')[0];

    if (!analytics.pageViews[pageName]) {
        analytics.pageViews[pageName] = {};
    }

    if (!analytics.pageViews[pageName][today]) {
        analytics.pageViews[pageName][today] = 0;
    }

    analytics.pageViews[pageName][today]++;
    saveAnalytics(analytics);
};

// Track demo button click
export const trackDemoClick = (projectId) => {
    const analytics = getAnalytics();

    if (!analytics.demoClicks[projectId]) {
        analytics.demoClicks[projectId] = 0;
    }

    analytics.demoClicks[projectId]++;
    analytics.totalDemoClicks++;
    saveAnalytics(analytics);

    console.log(`📊 Demo click tracked for: ${projectId}`);
};

// Track repo button click
export const trackRepoClick = (projectId) => {
    const analytics = getAnalytics();

    if (!analytics.repoClicks[projectId]) {
        analytics.repoClicks[projectId] = 0;
    }

    analytics.repoClicks[projectId]++;
    analytics.totalRepoClicks++;
    saveAnalytics(analytics);

    console.log(`📊 Repo click tracked for: ${projectId}`);
};

// Get total clicks for a project
export const getProjectClicks = (projectId) => {
    const analytics = getAnalytics();
    return {
        demo: analytics.demoClicks[projectId] || 0,
        repo: analytics.repoClicks[projectId] || 0,
        total: (analytics.demoClicks[projectId] || 0) + (analytics.repoClicks[projectId] || 0)
    };
};

// Get analytics summary
export const getAnalyticsSummary = () => {
    const analytics = getAnalytics();

    // Calculate total page views
    let totalPageViews = 0;
    Object.values(analytics.pageViews).forEach(page => {
        Object.values(page).forEach(count => {
            totalPageViews += count;
        });
    });

    // Get top projects by clicks
    const projectClicks = {};
    Object.entries(analytics.demoClicks).forEach(([id, count]) => {
        projectClicks[id] = (projectClicks[id] || 0) + count;
    });
    Object.entries(analytics.repoClicks).forEach(([id, count]) => {
        projectClicks[id] = (projectClicks[id] || 0) + count;
    });

    const topProjects = Object.entries(projectClicks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, clicks]) => ({ id, clicks }));

    return {
        totalPageViews,
        totalDemoClicks: analytics.totalDemoClicks || 0,
        totalRepoClicks: analytics.totalRepoClicks || 0,
        topProjects,
        lastUpdated: analytics.lastUpdated
    };
};

// Clear all analytics
export const clearAnalytics = () => {
    localStorage.removeItem(ANALYTICS_KEY);
};
