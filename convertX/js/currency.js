// js/currency.js
const Currency = {
  rates: {},
  baseCurrency: 'USD',
  timestamp: null,
  
  currencyNames: {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'INR': 'Indian Rupee',
    'JPY': 'Japanese Yen',
    'CAD': 'Canadian Dollar',
    'AUD': 'Australian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'SGD': 'Singapore Dollar',
    'AED': 'UAE Dirham',
    'SAR': 'Saudi Riyal',
    'MYR': 'Malaysian Ringgit',
    'HKD': 'Hong Kong Dollar',
    'NZD': 'New Zealand Dollar',
    'SEK': 'Swedish Krona',
    'NOK': 'Norwegian Krone',
    'DKK': 'Danish Krone',
    'ZAR': 'South African Rand',
    'BRL': 'Brazilian Real',
    'MXN': 'Mexican Peso',
    'KRW': 'South Korean Won',
    'THB': 'Thai Baht',
    'IDR': 'Indonesian Rupiah',
    'PKR': 'Pakistani Rupee',
    'BDT': 'Bangladeshi Taka',
    'EGP': 'Egyptian Pound',
    'TRY': 'Turkish Lira',
    'PLN': 'Polish Zloty',
    'PHP': 'Philippine Peso',
    'CZK': 'Czech Koruna',
    'RON': 'Romanian Leu',
    'HUF': 'Hungarian Forint',
    'ILS': 'Israeli Shekel',
    'CLP': 'Chilean Peso',
    'ARS': 'Argentine Peso',
    'COP': 'Colombian Peso',
    'VND': 'Vietnamese Dong',
    'NGN': 'Nigerian Naira',
    'KES': 'Kenyan Shilling',
    'QAR': 'Qatari Riyal',
    'KWD': 'Kuwaiti Dinar',
    'BHD': 'Bahraini Dinar',
    'OMR': 'Omani Rial',
    'LKR': 'Sri Lankan Rupee',
    'NPR': 'Nepalese Rupee',
    'MAD': 'Moroccan Dirham',
    'UAH': 'Ukrainian Hryvnia',
    'RUB': 'Russian Ruble'
  },

  flagMap: {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'INR': '🇮🇳', 'JPY': '🇯🇵',
    'CAD': '🇨🇦', 'AUD': '🇦🇺', 'CHF': '🇨🇭', 'CNY': '🇨🇳', 'SGD': '🇸🇬',
    'AED': '🇦🇪', 'SAR': '🇸🇦', 'MYR': '🇲🇾', 'HKD': '🇭🇰', 'NZD': '🇳🇿',
    'SEK': '🇸🇪', 'NOK': '🇳🇴', 'DKK': '🇩🇰', 'ZAR': '🇿🇦', 'BRL': '🇧🇷',
    'MXN': '🇲🇽', 'KRW': '🇰🇷', 'THB': '🇹🇭', 'IDR': '🇮🇩', 'PKR': '🇵🇰',
    'BDT': '🇧🇩', 'EGP': '🇪🇬', 'TRY': '🇹🇷', 'PLN': '🇵🇱', 'PHP': '🇵🇭',
    'CZK': '🇨🇿', 'RON': '🇷🇴', 'HUF': '🇭🇺', 'ILS': '🇮🇱', 'CLP': '🇨🇱',
    'ARS': '🇦🇷', 'COP': '🇨🇴', 'VND': '🇻🇳', 'NGN': '🇳🇬', 'KES': '🇰🇪',
    'QAR': '🇶🇦', 'KWD': '🇰🇼', 'BHD': '🇧🇭', 'OMR': '🇴🇲', 'LKR': '🇱🇰',
    'NPR': '🇳🇵', 'MAD': '🇲🇦', 'UAH': '🇺🇦', 'RUB': '🇷🇺'
  },

  async init() {
    this.loadFromStorage();
    this.populateUnitData();
    await this.fetchRates(); // Always fetch on load as requested
  },

  loadFromStorage() {
    const rates = localStorage.getItem('convertx_rates');
    const ts = localStorage.getItem('convertx_rates_time');
    if (rates && ts) {
      this.rates = JSON.parse(rates);
      this.timestamp = parseInt(ts, 10);
    } else {
      this.rates = { 'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'INR': 83.0 };
      this.timestamp = Date.now();
    }
  },

  populateUnitData() {
    // Generate units.js compatible array
    UnitData.currencyUnits = Object.keys(this.currencyNames).map(code => {
      return {
        name: code,
        fullName: this.currencyNames[code],
        symbol: this.flagMap[code] || '💵'
      };
    });
  },

  async fetchRates() {
    try {
      // Switched to open.er-api.com because Frankfurter API was timing out
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      this.rates = data.rates;
      this.rates['USD'] = 1.0; // base is 1
      
      // Add fallbacks for currencies not supported by Frankfurter API
      const fallbacks = {
        'AED': 3.67, 'SAR': 3.75, 'PKR': 278.5, 'BDT': 117.5, 'EGP': 47.9, 
        'NGN': 1500.0, 'KES': 130.0, 'QAR': 3.64, 'KWD': 0.31, 'BHD': 0.38, 
        'OMR': 0.38, 'LKR': 300.0, 'NPR': 133.0, 'MAD': 10.0, 'UAH': 39.5, 
        'ARS': 880.0, 'COP': 3900.0, 'VND': 25400.0, 'CLP': 900.0, 'ILS': 3.7,
        'RON': 4.6, 'CZK': 22.8, 'PHP': 58.0, 'TRY': 32.2, 'THB': 36.8, 'KRW': 1360.0,
        'MXN': 16.5, 'ZAR': 18.5, 'DKK': 6.9, 'NOK': 10.5, 'SEK': 10.5, 'HKD': 7.8,
        'MYR': 4.7, 'SGD': 1.35, 'CNY': 7.2, 'CHF': 0.91, 'AUD': 1.5, 'CAD': 1.36,
        'JPY': 155.0, 'GBP': 0.79, 'INR': 83.5, 'EUR': 0.92, 'RUB': 90.0, 'PLN': 3.9,
        'HUF': 355.0, 'NZD': 1.6, 'BRL': 5.1, 'IDR': 16000.0
      };
      
      for (const [code, rate] of Object.entries(fallbacks)) {
        if (!this.rates[code]) {
          this.rates[code] = rate;
        }
      }
      
      console.log('Live rates loaded:', this.rates);
      
      // Use the API provider's exact update time if available, otherwise fallback to Date.now()
      this.timestamp = data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now();
      
      localStorage.setItem('convertx_rates', JSON.stringify(this.rates));
      localStorage.setItem('convertx_rates_time', this.timestamp);
      
      this.populateUnitData();
      
      // Remove offline banner if it exists
      const banner = document.getElementById('offlineBanner');
      if (banner) banner.remove();
      
      return true;
    } catch (e) {
      console.error('Currency fetch failed:', e);
      this.showOfflineBanner();
      return false;
    }
  },

  showOfflineBanner() {
    let banner = document.getElementById('offlineBanner');
    const dateStr = this.timestamp ? new Date(this.timestamp).toLocaleDateString() : 'unknown date';
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offlineBanner';
      banner.className = 'offline-banner';
      banner.innerHTML = `⚠️ Using cached rates from ${dateStr}. Connect to internet for live rates.`;
      const main = document.querySelector('.page-layout');
      if(main) main.insertBefore(banner, main.firstChild);
    } else {
      banner.innerHTML = `⚠️ Using cached rates from ${dateStr}. Connect to internet for live rates.`;
    }
  },

  convert(value, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return value;
    
    const fromRate = this.rates[fromCurrency];
    const toRate = this.rates[toCurrency];
    
    if (!fromRate || !toRate) return 0;
    
    // Formula specified by user
    return value * (toRate / fromRate);
  },

  async fetchHistorical(from, to) {
    if (from === to || from === 'USD' && to === 'USD') return null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      
      const sDate = start.toISOString().split('T')[0];
      const eDate = end.toISOString().split('T')[0];
      
      const res = await fetch(`https://api.frankfurter.app/${sDate}..${eDate}?from=${from}&to=${to}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) return null;
      const data = await res.json();
      
      if (!data.rates) return null;
      const dates = Object.keys(data.rates).sort();
      const rates = dates.map(d => data.rates[d][to]);
      return rates;
    } catch (e) {
      console.log('Historical fetch skipped or failed', e.message);
      return null;
    }
  }
};
