// Helper utility functions

// Copy text to clipboard with toast notification
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            return true;
        } catch {
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
};

// Format date based on locale
export const formatDate = (dateString, locale = 'en') => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', options);
};

// Get localized text from object
export const getLocalizedText = (textObj, language = 'en') => {
    if (typeof textObj === 'string') return textObj;
    if (textObj && typeof textObj === 'object') {
        return textObj[language] || textObj.en || '';
    }
    return '';
};

// Slugify text for URLs
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
export const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Check if element is in viewport
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Smooth scroll to element
export const scrollToElement = (elementId, offset = 80) => {
    const element = document.getElementById(elementId);
    if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
};

// Generate random ID
export const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

// Category colors mapping
export const getCategoryColor = (category) => {
    const colors = {
        'web-app': { bg: '#dbeafe', text: '#2563eb' },
        'mobile': { bg: '#ede9fe', text: '#7c3aed' },
        'open-source': { bg: '#d1fae5', text: '#059669' },
        'design': { bg: '#fef3c7', text: '#d97706' },
        'backend': { bg: '#fee2e2', text: '#dc2626' }
    };
    return colors[category] || colors['web-app'];
};

// Role colors mapping
export const getRoleColor = (role) => {
    const colors = {
        'frontend': { bg: '#dbeafe', text: '#2563eb' },
        'backend': { bg: '#fee2e2', text: '#dc2626' },
        'fullstack': { bg: '#d1fae5', text: '#059669' }
    };
    return colors[role] || colors['fullstack'];
};

// Category labels
export const getCategoryLabel = (category, language = 'en') => {
    const labels = {
        'web-app': { en: 'Web Application', id: 'Aplikasi Web' },
        'mobile': { en: 'Mobile App', id: 'Aplikasi Mobile' },
        'open-source': { en: 'Open Source', id: 'Open Source' },
        'design': { en: 'Design System', id: 'Sistem Desain' },
        'backend': { en: 'Backend API', id: 'Backend API' }
    };
    return labels[category]?.[language] || category;
};
