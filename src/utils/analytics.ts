/**
 * Google Analytics Tracking Utility
 * Provides a type-safe wrapper for gtag.js events.
 */

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string,
      config?: ControlParams | EventParams | ConfigParams | CustomParams
    ) => void;
  }
}

// Simple types for GA4 events
type ControlParams = {
  groups?: string | string[];
  send_to?: string | string[];
  event_callback?: () => void;
  event_timeout?: number;
};

type EventParams = {
  checkout_option?: string;
  checkout_step?: number;
  content_id?: string;
  content_type?: string;
  coupon?: string;
  currency?: string;
  description?: string;
  fatal?: boolean;
  items?: any[];
  method?: string;
  number?: string;
  promotions?: any[];
  screen_name?: string;
  search_term?: string;
  shipping?: number;
  tax?: number;
  transaction_id?: string;
  value?: number;
  event_label?: string;
  event_category?: string;
  [key: string]: any;
};

type ConfigParams = {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  send_page_view?: boolean;
  [key: string]: any;
};

type CustomParams = {
  [key: string]: any;
};

/**
 * Track a custom event
 */
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number,
  params: CustomParams = {}
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }
};

/**
 * Track a page view
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-T8Z2LRL8SG', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

/**
 * Common App Events
 */
export const Analytics = {
  // Navigation
  trackTabChange: (tabId: string) => {
    trackEvent('tab_change', 'navigation', tabId);
    trackPageView(`/${tabId}`, `Resume Lab - ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  },

  // Resume Actions
  trackResumeUpload: (fileName?: string) => {
    trackEvent('resume_upload', 'resume', fileName);
  },
  
  trackResumeUpdate: () => {
    trackEvent('resume_update', 'resume');
  },

  trackPDFExport: () => {
    trackEvent('export_pdf', 'engagement');
  },

  trackJSONDownload: (isExample: boolean = false) => {
    trackEvent('download_json', 'engagement', isExample ? 'example' : 'user_data');
  },

  trackThemeChange: (themeId: string) => {
    trackEvent('theme_change', 'customization', themeId);
  },

  // Signature
  trackSignatureExport: () => {
    trackEvent('export_signature', 'engagement');
  },

  trackSignatureClear: () => {
    trackEvent('clear_signature', 'engagement');
  },

  // General
  trackDarkModeToggle: (isDark: boolean) => {
    trackEvent('dark_mode_toggle', 'ui', isDark ? 'dark' : 'light');
  },

  trackExternalLink: (url: string, name: string) => {
    trackEvent('external_link_click', 'outbound', name, undefined, { url });
  },
};
