// js/app.js
const App = {
  compareList: [],

  async init() {
    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
    }
    
    // Init state
    HistoryData.init();
    Favorites.init();
    await Currency.init();

    // Init UI
    UI.init();
    UI.populateSettings();

    // Geo-IP detection on first load
    const isFirstVisit = !localStorage.getItem('convertx_lastCategory');
    if (isFirstVisit) {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
             const euCountries = ['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'];
             let localCurr = null;
             if (euCountries.includes(data.country_code)) {
               localCurr = 'EUR';
             } else if (data.country_code === 'US') {
               localCurr = 'USD';
             } else {
               const codeMap = {
                 'GB':'GBP', 'JP':'JPY', 'CH':'CHF', 'CN':'CNY', 'SG':'SGD', 'AE':'AED', 'SA':'SAR', 
                 'MY':'MYR', 'HK':'HKD', 'NZ':'NZD', 'SE':'SEK', 'NO':'NOK', 'DK':'DKK', 'ZA':'ZAR', 
                 'BR':'BRL', 'MX':'MXN', 'KR':'KRW', 'TH':'THB', 'ID':'IDR', 'PK':'PKR', 'BD':'BDT', 
                 'EG':'EGP', 'TR':'TRY', 'PL':'PLN', 'PH':'PHP', 'CZ':'CZK', 'RO':'RON', 'HU':'HUF', 
                 'IL':'ILS', 'CL':'CLP', 'AR':'ARS', 'CO':'COP', 'VN':'VND', 'NG':'NGN', 'KE':'KES', 
                 'QA':'QAR', 'KW':'KWD', 'BH':'BHD', 'OM':'OMR', 'LK':'LKR', 'NP':'NPR', 'MA':'MAD', 
                 'UA':'UAH', 'RU':'RUB', 'CA':'CAD', 'AU':'AUD', 'IN':'INR'
               };
               localCurr = codeMap[data.country_code];
             }
             
             if (localCurr && localCurr !== 'USD' && Currency.rates[localCurr]) {
                localStorage.setItem('convertx_lastFrom_Currency', 'USD');
                localStorage.setItem('convertx_lastTo_Currency', localCurr);
             }
          }
        }
      } catch (e) {
        console.log('GeoIP failed', e);
      }
    }

    // Load initial state from URL or localStorage
    let initialCat = localStorage.getItem('convertx_lastCategory') || Settings.get().defaultCategory;
    let initialFrom = null;
    let initialTo = null;

    const path = window.location.pathname;
    if (path && path.length > 1 && path !== '/index.html') {
      const parts = path.split('/').filter(p => p);
      if (parts.length >= 2) {
        const catSlug = parts[0];
        const unitSlugs = parts[1].split('-to-');
        if (unitSlugs.length === 2) {
          const parsedCat = Utils.fromSlug(catSlug, UnitData.categories);
          if (parsedCat) {
            initialCat = parsedCat;
            const list = parsedCat === 'Currency' ? UnitData.currencyUnits : UnitData.units[parsedCat].list;
            initialFrom = Utils.fromSlug(unitSlugs[0], list);
            initialTo = Utils.fromSlug(unitSlugs[1], list);
          }
        }
      }
    }

    this.switchCategory(initialCat, false);

    // If URL had valid units, override the localStorage/defaults
    if (initialFrom && initialTo) {
      UI.setDropdownValues(initialFrom, initialTo);
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.loadConversion(e.state.category, e.state.fromUnit, e.state.toUnit, null, false);
      } else {
        // Fallback or navigate home
        window.location.reload();
      }
    });

    // Initial lucide icons
    if(window.lucide) window.lucide.createIcons();
    
    // Add some default value if empty
    if (!UI.elements.fromValue.value) {
      UI.elements.fromValue.value = "1";
    }
    this.performConversion();
  },

  switchCategory(category, save = true) {
    if (!UnitData.categories.includes(category)) category = 'Currency';
    
    if (category === 'Currency' && UnitData.currencyUnits.length === 0) {
      // If offline and no cache
      UI.showToast('Currency data unavailable. Please check your internet connection.', 'error');
      return;
    }

    UI.updateCategoryTabs(category);
    UI.populateUnitDropdowns(category);

    let defaultFrom, defaultTo;
    if (category === 'Currency') {
      defaultFrom = 'USD';
      defaultTo = 'EUR';
    } else {
      defaultFrom = UnitData.units[category].list[0].name;
      defaultTo = UnitData.units[category].list[1] ? UnitData.units[category].list[1].name : defaultFrom;
    }

    // Try to restore last used for this category
    const savedFrom = localStorage.getItem(`convertx_lastFrom_${category}`);
    const savedTo = localStorage.getItem(`convertx_lastTo_${category}`);
    if (savedFrom) defaultFrom = savedFrom;
    if (savedTo) defaultTo = savedTo;

    UI.setDropdownValues(defaultFrom, defaultTo);
    UI.renderQuickRef(category);
    UI.renderHistory();
    UI.renderFavorites();
    
    this.loadCompareList(category);

    if (save) localStorage.setItem('convertx_lastCategory', category);
    
    // Update URL to match initial dropdown values for this category
    this.updateUrl(category, defaultFrom, defaultTo);
    
    this.performConversion();
  },

  loadCompareList(category) {
    try {
      this.compareList = JSON.parse(localStorage.getItem(`convertx_compare_${category}`)) || [];
    } catch (e) {
      this.compareList = [];
    }
  },

  saveCompareList() {
    localStorage.setItem(`convertx_compare_${UI.currentCategory}`, JSON.stringify(this.compareList));
  },

  addCompareUnit(unit) {
    if (!this.compareList.includes(unit)) {
      this.compareList.push(unit);
      this.saveCompareList();
      this.performConversion();
    }
  },

  removeCompareUnit(unit) {
    this.compareList = this.compareList.filter(u => u !== unit);
    this.saveCompareList();
    this.performConversion();
  },

  handleUnitChange() {
    const cat = UI.currentCategory;
    const from = UI.currentFromValue;
    const to = UI.currentToValue;
    
    localStorage.setItem(`convertx_lastFrom_${cat}`, from);
    localStorage.setItem(`convertx_lastTo_${cat}`, to);
    
    this.updateUrl(cat, from, to);
    this.performConversion();
  },

  updateUrl(category, from, to) {
    if (!category || !from || !to) return;
    const catSlug = Utils.toSlug(category);
    const fromSlug = Utils.toSlug(from);
    const toSlug = Utils.toSlug(to);
    
    const newPath = `/${catSlug}/${fromSlug}-to-${toSlug}`;
    
    // Only push if it's actually a new path to avoid history spam
    if (window.location.pathname !== newPath) {
      window.history.pushState({ category, fromUnit: from, toUnit: to }, '', newPath);
    }
  },

  swapUnits() {
    UI.triggerHaptic();
    const fromVal = UI.currentFromValue;
    const toVal = UI.currentToValue;
    
    UI.setDropdownValues(toVal, fromVal);
    
    // Optionally swap input values or re-calculate
    // The spec says: "On click: swaps the From and To units AND their values"
    const currentResult = UI.elements.resultValue.textContent.replace(/,/g, '');
    const isStringCategory = ['Programmer Base', 'Color Code', 'Roman Numeral', 'Time Zone'].includes(UI.currentCategory);
    
    if (isStringCategory) {
      UI.elements.fromValue.value = UI.elements.resultValue.textContent;
    } else {
      if (!isNaN(parseFloat(currentResult))) {
        UI.elements.fromValue.value = parseFloat(currentResult);
      }
    }
    
    this.handleUnitChange();
  },

  performConversion() {
    const inputRaw = UI.elements.fromValue.value;
    
    // Validation
    if (inputRaw === '') {
      UI.updateResult('0', '', '');
      UI.showInputError(false);
      return;
    }

    const category = UI.currentCategory;
    const isStringCategory = ['Programmer Base', 'Color Code', 'Roman Numeral', 'Time Zone'].includes(category);
    
    let value;
    if (isStringCategory) {
      value = inputRaw;
    } else {
      try {
        if (!/^[0-9+\-*/().\s]+$/.test(inputRaw)) throw new Error('Invalid chars');
        value = Function(`'use strict'; return (${inputRaw})`)();
        if (isNaN(value) || !isFinite(value)) throw new Error('Invalid math result');
      } catch (e) {
        UI.showInputError(true);
        return;
      }
    }
    
    UI.showInputError(false);
    
    const fromUnitName = UI.currentFromValue;
    const toUnitName = UI.currentToValue;
    const contextValue = UI.elements.contextSelect ? UI.elements.contextSelect.value : null;

    const result = Converter.convert(value, fromUnitName, toUnitName, category, contextValue);
    
    const settings = Settings.get();
    let formattedResult = result;
    if (!isStringCategory) {
      formattedResult = Utils.formatNumber(result, settings.decimalPlaces, settings.numberFormat);
    }
    
    const rateText = Converter.getExchangeRateLine(fromUnitName, toUnitName, category);
    const formulaString = Converter.getFormulaString(fromUnitName, toUnitName, category, value, result);
    
    UI.updateResult(formattedResult, rateText, null, formulaString);

    // Multi-Compare rendering
    if (this.compareList && this.compareList.length > 0) {
      UI.renderCompareList(this.compareList, value, fromUnitName, category);
    }

    // Save to history (debounce handled in HistoryData.add)
    let fromSym = fromUnitName;
    let toSym = toUnitName;
    if (category !== 'Currency') {
      fromSym = UnitData.units[category].list.find(u => u.name === fromUnitName)?.symbol || fromUnitName;
      toSym = UnitData.units[category].list.find(u => u.name === toUnitName)?.symbol || toUnitName;
    }
    
    HistoryData.add(category, fromUnitName, fromSym, toUnitName, toSym, value, formattedResult);
    UI.renderHistory();
  },

  loadConversion(category, fromUnit, toUnit, inputValue = null) {
    if (category !== UI.currentCategory) {
      this.switchCategory(category);
    }
    
    UI.setDropdownValues(fromUnit, toUnit);
    
    if (inputValue !== null) {
      UI.elements.fromValue.value = inputValue;
    }
    
    this.handleUnitChange();
  },

  toggleFavoriteCurrent() {
    const cat = UI.currentCategory;
    const from = UI.currentFromValue;
    const to = UI.currentToValue;
    Favorites.toggle(cat, from, to);
    UI.updateFavoriteIcon();
    UI.renderFavorites();
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
