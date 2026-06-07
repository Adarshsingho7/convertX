// js/utils.js
const Utils = {
  // Generate simple UUID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // Format numbers based on precision and format type
  formatNumber(value, decimalPlaces = 4, formatType = 'comma') {
    if (value === null || value === undefined || isNaN(value)) return '';
    
    // Very small numbers or very large numbers to scientific notation
    if (value !== 0 && (Math.abs(value) < 1e-6 || Math.abs(value) > 1e15)) {
      return Number(value).toExponential(decimalPlaces);
    }
    
    let parts;
    
    // Strip trailing zeros after rounding
    const roundedStr = Number(value.toFixed(decimalPlaces)).toString();
    parts = roundedStr.split('.');

    let wholePart = parts[0];
    let decimalPart = parts.length > 1 ? parts[1] : '';

    if (formatType === 'comma') {
      wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return decimalPart ? `${wholePart}.${decimalPart}` : wholePart;
    } else if (formatType === 'period') {
      wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return decimalPart ? `${wholePart},${decimalPart}` : wholePart;
    } else { // 'none'
      return decimalPart ? `${wholePart}.${decimalPart}` : wholePart;
    }
  },

  // Format timestamp nicely
  formatTimeAgo(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hr ago`;
    
    return date.toLocaleDateString();
  },

  // Convert name to URL friendly slug (e.g., "US Dollar" -> "us-dollar")
  toSlug(name) {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove duplicate hyphens
  },

  // Find original name from slug using a list of objects or strings
  fromSlug(slug, list) {
    if (!slug || !list) return null;
    const match = list.find(item => {
      const name = typeof item === 'string' ? item : (item.name || item.code);
      return this.toSlug(name) === slug;
    });
    return match ? (typeof match === 'string' ? match : (match.name || match.code)) : null;
  }
};
