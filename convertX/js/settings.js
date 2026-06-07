// js/settings.js
const Settings = {
  defaults: {
    theme: 'dark',
    accentColor: 'blue',
    defaultCategory: 'Currency',
    decimalPlaces: 4,
    numberFormat: 'comma',
    currencyUpdateFrequency: '1h'
  },

  get() {
    return {
      theme: localStorage.getItem('convertx_theme') || this.defaults.theme,
      accentColor: localStorage.getItem('convertx_accentColor') || this.defaults.accentColor,
      defaultCategory: localStorage.getItem('convertx_defaultCategory') || this.defaults.defaultCategory,
      decimalPlaces: parseInt(localStorage.getItem('convertx_decimalPlaces') || this.defaults.decimalPlaces, 10),
      numberFormat: localStorage.getItem('convertx_numberFormat') || this.defaults.numberFormat,
      currencyUpdateFrequency: localStorage.getItem('convertx_rateFrequency') || this.defaults.currencyUpdateFrequency
    };
  },

  set(key, value) {
    if (key === 'theme') localStorage.setItem('convertx_theme', value);
    if (key === 'accentColor') localStorage.setItem('convertx_accentColor', value);
    if (key === 'defaultCategory') localStorage.setItem('convertx_defaultCategory', value);
    if (key === 'decimalPlaces') localStorage.setItem('convertx_decimalPlaces', value);
    if (key === 'numberFormat') localStorage.setItem('convertx_numberFormat', value);
    if (key === 'currencyUpdateFrequency') localStorage.setItem('convertx_rateFrequency', value);
  },

  clearAllData() {
    localStorage.removeItem('convertx_history');
    localStorage.removeItem('convertx_favorites');
    localStorage.removeItem('convertx_lastCategory');
    localStorage.removeItem('convertx_lastFrom');
    localStorage.removeItem('convertx_lastTo');
  }
};
