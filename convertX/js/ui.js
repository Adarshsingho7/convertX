// js/ui.js
const UI = {
  elements: {},
  currentCategory: null,
  dropdownOpen: null,
  currentFromValue: '',
  currentToValue: '',
  
  init() {
    this.cacheElements();
    this.applyTheme(Settings.get().theme);
    this.setupEventListeners();
    this.updateOfflineStatus();
  },

  updateOfflineStatus() {
    if (!navigator.onLine) {
      if (this.elements.offlineIndicator) this.elements.offlineIndicator.classList.remove('hidden');
    } else {
      if (this.elements.offlineIndicator) this.elements.offlineIndicator.classList.add('hidden');
    }
  },

  cacheElements() {
    this.elements = {
      html: document.documentElement,
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      categoryTabs: document.getElementById('categoryTabs'),
      tabBtns: document.querySelectorAll('.tab-btn'),
      
      // Converter Inputs
      fromLabel: document.getElementById('fromLabel'),
      toLabel: document.getElementById('toLabel'),
      fromValue: document.getElementById('fromValue'),
      resultValue: document.getElementById('resultValue'),
      resultUnitName: document.getElementById('resultUnitName'),
      swapBtn: document.getElementById('swapBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      copyBtn: document.getElementById('copyResultBtn'),
      copyIcon: document.getElementById('copyIcon'),
      rateInfoText: document.getElementById('rateInfoText'),
      rateTimestamp: document.getElementById('rateTimestamp'),
      
      // Custom Dropdowns
      fromSelectTrigger: document.getElementById('fromSelectTrigger'),
      fromSelectValue: document.getElementById('fromSelectValue'),
      fromSelectDropdown: document.getElementById('fromSelectDropdown'),
      fromSelectSearch: document.getElementById('fromSelectSearch'),
      fromSelectOptions: document.getElementById('fromSelectOptions'),
      
      toSelectTrigger: document.getElementById('toSelectTrigger'),
      toSelectValue: document.getElementById('toSelectValue'),
      toSelectDropdown: document.getElementById('toSelectDropdown'),
      toSelectSearch: document.getElementById('toSelectSearch'),
      toSelectOptions: document.getElementById('toSelectOptions'),

      // Context Dropdown
      contextSelectContainer: document.getElementById('contextSelectContainer'),
      contextLabel: document.getElementById('contextLabel'),
      contextSelect: document.getElementById('contextSelect'),

      // Multi-Compare
      multiCompareContainer: document.getElementById('multiCompareContainer'),
      multiCompareList: document.getElementById('multiCompareList'),
      addCompareBtn: document.getElementById('addCompareBtn'),

      // UX Enhancements
      toastContainer: document.getElementById('toastContainer'),
      clearInputBtn: document.getElementById('clearInputBtn'),
      offlineIndicator: document.getElementById('offlineIndicator'),
      formulaDisplay: document.getElementById('formulaDisplay'),
      formulaText: document.getElementById('formulaText'),
      
      compareSelectDropdown: document.getElementById('compareSelectDropdown'),
      compareSelectSearch: document.getElementById('compareSelectSearch'),
      compareSelectOptions: document.getElementById('compareSelectOptions'),

      // Sidebar
      quickRefList: document.getElementById('quickRefList'),
      recentList: document.getElementById('recentList'),
      favoritesList: document.getElementById('favoritesList'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      addFavoriteBtn: document.getElementById('addFavoriteBtn'),
      favoriteIcon: document.getElementById('favoriteIcon'),
      
      // Mobile Nav
      bottomNavBtns: document.querySelectorAll('.bottom-nav-btn'),
      fullPageView: document.getElementById('fullPageView'),
      closeViewBtn: document.getElementById('closeViewBtn'),
      viewTitle: document.getElementById('viewTitle'),
      settingsContent: document.getElementById('settingsContent'),
      historyContent: document.getElementById('historyContent'),
      favoritesContent: document.getElementById('favoritesContent'),
      mobileHistoryList: document.getElementById('mobileHistoryList'),
      mobileFavoritesList: document.getElementById('mobileFavoritesList'),
      exportHistoryBtn: document.getElementById('exportHistoryBtn'),
      historySearch: document.getElementById('historySearch'),
      
      // Settings Selects
      themeSelect: document.getElementById('themeSelect'),
      colorSwatches: document.querySelectorAll('.color-swatch'),
      defaultCategorySelect: document.getElementById('defaultCategorySelect'),
      decimalPlacesSelect: document.getElementById('decimalPlacesSelect'),
      numberFormatSelect: document.getElementById('numberFormatSelect'),
      currencyUpdateSelect: document.getElementById('currencyUpdateSelect'),
      clearAllDataBtn: document.getElementById('clearAllDataBtn')
    };
  },

  setupEventListeners() {
    if (this.elements.themeToggleBtn) {
      this.elements.themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        Settings.set('theme', next);
        this.elements.themeSelect.value = next;
      });
    }

    // Network Status
    window.addEventListener('offline', () => {
      this.updateOfflineStatus();
      this.showToast('You are offline. Using cached data.', 'error');
    });
    window.addEventListener('online', () => {
      this.updateOfflineStatus();
      this.showToast('Back online!', 'success');
      if (this.currentCategory === 'Currency') {
        Currency.init().then(() => App.performConversion());
      }
    });

    // Categories
    this.elements.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.target.getAttribute('data-category');
        App.switchCategory(cat);
      });
    });

    // Custom Dropdown triggers
    this.elements.fromSelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown('from');
    });
    
    this.elements.toSelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown('to');
    });

    if (this.elements.addCompareBtn) {
      this.elements.addCompareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown('compare');
      });
      this.elements.compareSelectDropdown.addEventListener('click', e => e.stopPropagation());
      this.elements.compareSelectSearch.addEventListener('input', (e) => this.filterOptions('compare', e.target.value));
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => this.closeAllDropdowns());

    // Stop propagation inside dropdown
    this.elements.fromSelectDropdown.addEventListener('click', e => e.stopPropagation());
    this.elements.toSelectDropdown.addEventListener('click', e => e.stopPropagation());

    // Search inputs
    this.elements.fromSelectSearch.addEventListener('input', (e) => this.filterOptions('from', e.target.value));
    this.elements.toSelectSearch.addEventListener('input', (e) => this.filterOptions('to', e.target.value));

    // Listen for fromValue input
    this.elements.fromValue.addEventListener('input', () => {
      this.toggleClearButton();
      this.elements.resultValue.classList.add('fade-typing');
      App.handleUnitChange();
    });

    if (this.elements.clearInputBtn) {
      this.elements.clearInputBtn.addEventListener('click', () => {
        this.elements.fromValue.value = '';
        this.toggleClearButton();
        this.elements.fromValue.focus();
        App.handleUnitChange();
      });
    }

    if (this.elements.contextSelect) {
      this.elements.contextSelect.addEventListener('change', () => {
        App.handleUnitChange();
      });
    }

    // Swap
    this.elements.swapBtn.addEventListener('click', () => App.swapUnits());
    
    // Copy
    this.elements.copyBtn.addEventListener('click', () => {
      const resultText = this.elements.resultValue.textContent;
      if (resultText && resultText !== '0' && resultText !== 'Invalid' && !resultText.includes('Error')) {
        navigator.clipboard.writeText(resultText).then(() => {
          this.triggerHaptic();
          const icon = document.getElementById('copyIcon');
          icon.setAttribute('data-lucide', 'check');
          if(window.lucide) window.lucide.createIcons();
          this.showToast('Copied to clipboard!', 'success');
          
          setTimeout(() => {
            icon.setAttribute('data-lucide', 'copy');
            if(window.lucide) window.lucide.createIcons();
          }, 1500);
        });
      }
    });

    // Favorites
    this.elements.addFavoriteBtn.addEventListener('click', () => App.toggleFavoriteCurrent());

    // History (Issue 2 Fix: No confirmation, direct clear)
    this.elements.clearHistoryBtn.addEventListener('click', () => {
      HistoryData.clear();
      this.renderHistory();
    });

    // Mobile Navigation
    this.elements.bottomNavBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        this.openMobileView(target);
      });
    });

    this.elements.closeViewBtn.addEventListener('click', () => {
      this.closeMobileView();
    });

    // Settings
    this.elements.themeSelect.addEventListener('change', e => {
      this.applyTheme(e.target.value);
      Settings.set('theme', e.target.value);
    });
    this.elements.defaultCategorySelect.addEventListener('change', e => Settings.set('defaultCategory', e.target.value));
    this.elements.decimalPlacesSelect.addEventListener('change', e => {
      Settings.set('decimalPlaces', e.target.value);
      App.performConversion();
    });
    this.elements.numberFormatSelect.addEventListener('change', e => {
      Settings.set('numberFormat', e.target.value);
      App.performConversion();
    });
    this.elements.currencyUpdateSelect.addEventListener('change', e => Settings.set('currencyUpdateFrequency', e.target.value));
    
    this.elements.clearAllDataBtn.addEventListener('click', () => {
      if(confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        Settings.clearAllData();
        window.location.reload();
      }
    });

    this.elements.exportHistoryBtn.addEventListener('click', () => HistoryData.exportCSV());
    this.elements.historySearch.addEventListener('input', e => this.renderHistory(e.target.value));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const isInput = e.target.tagName === 'INPUT';
      
      if (e.key === '/') {
        if (!isInput) {
          e.preventDefault();
          this.elements.fromValue.focus();
        }
      } else if (e.key === 'Escape') {
        this.closeAllDropdowns();
        if (document.activeElement) document.activeElement.blur();
        if (isInput && e.target === this.elements.fromValue) {
          this.elements.fromValue.value = '';
          this.toggleClearButton();
          App.performConversion();
        }
      } else if (e.key === 'Enter') {
        if (!isInput || e.target === this.elements.fromValue) {
          this.copyResult();
        }
      } else if ((e.ctrlKey || e.shiftKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        App.swapUnits();
      }
    });
  },

  applyTheme(theme) {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    if (this.elements && this.elements.html && this.elements.themeToggleBtn) {
       const icon = document.documentElement.getAttribute('data-theme') === 'dark' ? 'sun' : 'moon';
       this.elements.themeToggleBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
       if(window.lucide) window.lucide.createIcons();
    }
  },

  applyColor(color) {
    if (color === 'blue' || !color) {
      document.documentElement.removeAttribute('data-color');
    } else {
      document.documentElement.setAttribute('data-color', color);
    }
  },

  populateSettings() {
    const s = Settings.get();
    
    // Apply initial theme and color
    this.applyTheme(s.theme);
    this.applyColor(s.accentColor);

    // Set settings UI values
    this.elements.themeSelect.value = s.theme;
    
    if (this.elements.colorSwatches) {
      this.elements.colorSwatches.forEach(swatch => {
        if (swatch.dataset.color === s.accentColor) {
          swatch.classList.add('active');
        } else {
          swatch.classList.remove('active');
        }
        
        swatch.addEventListener('click', (e) => {
          const color = e.target.dataset.color;
          this.applyColor(color);
          Settings.set('accentColor', color);
          this.elements.colorSwatches.forEach(s => s.classList.remove('active'));
          e.target.classList.add('active');
        });
      });
    }

    this.elements.decimalPlacesSelect.value = s.decimalPlaces.toString();
    this.elements.numberFormatSelect.value = s.numberFormat;
    this.elements.currencyUpdateSelect.value = s.currencyUpdateFrequency;

    this.elements.defaultCategorySelect.innerHTML = '';
    UnitData.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      if (cat === s.defaultCategory) opt.selected = true;
      this.elements.defaultCategorySelect.appendChild(opt);
    });
  },

  updateCategoryTabs(category) {
    this.currentCategory = category;
    
    // Manage input mode based on category type
    const isStringCategory = ['Programmer Base', 'Color Code', 'Roman Numeral', 'Time Zone'].includes(category);
    if (isStringCategory) {
      this.elements.fromValue.removeAttribute('inputmode');
      this.elements.fromValue.setAttribute('type', 'text');
    } else {
      this.elements.fromValue.setAttribute('inputmode', 'decimal');
      this.elements.fromValue.setAttribute('type', 'text');
    }

    // Context Dropdown Logic
    if (category === 'Smart Cooking') {
      this.elements.contextSelectContainer.classList.remove('hidden');
      this.elements.contextLabel.textContent = 'Ingredient';
      this.elements.contextSelect.innerHTML = UnitData.cookingIngredients.map(i => `<option value="${i.name}">${i.name}</option>`).join('');
    } else if (category === 'Shoe Sizes') {
      this.elements.contextSelectContainer.classList.remove('hidden');
      this.elements.contextLabel.textContent = 'Gender';
      this.elements.contextSelect.innerHTML = UnitData.shoeGenders.map(g => `<option value="${g}">${g}</option>`).join('');
    } else {
      this.elements.contextSelectContainer.classList.add('hidden');
    }

    this.elements.tabBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('active');
      }
    });

    this.toggleClearButton();
    
    // Auto-focus input on desktop when switching categories
    if (window.innerWidth > 640) {
      setTimeout(() => this.elements.fromValue.focus(), 50);
    }
  },

  toggleDropdown(type) {
    if (this.dropdownOpen === type) {
      this.closeAllDropdowns();
      return;
    }
    this.closeAllDropdowns();
    
    const dropdown = type === 'from' ? this.elements.fromSelectDropdown 
                   : type === 'to' ? this.elements.toSelectDropdown 
                   : this.elements.compareSelectDropdown;
    const search = type === 'from' ? this.elements.fromSelectSearch 
                 : type === 'to' ? this.elements.toSelectSearch 
                 : this.elements.compareSelectSearch;
    
    if(dropdown) dropdown.classList.remove('hidden');
    if(search) {
      search.value = '';
      this.filterOptions(type, '');
      search.focus();
    }
    this.dropdownOpen = type;
  },

  closeAllDropdowns() {
    this.elements.fromSelectDropdown.classList.add('hidden');
    this.elements.toSelectDropdown.classList.add('hidden');
    if(this.elements.compareSelectDropdown) this.elements.compareSelectDropdown.classList.add('hidden');
    this.dropdownOpen = null;
  },

  populateUnitDropdowns(category) {
    let list = [];
    if (category === 'Currency') {
      list = UnitData.currencyUnits;
    } else {
      list = UnitData.units[category].list;
    }

    this.currentUnitList = list;
  },
  
  renderDropdownOptions(type, filterText = '') {
    const list = this.currentUnitList || [];
    const val = type === 'from' ? this.currentFromValue : this.currentToValue;
    const container = type === 'from' ? this.elements.fromSelectOptions 
                    : type === 'to' ? this.elements.toSelectOptions 
                    : this.elements.compareSelectOptions;
    
    if(!container) return;
    container.innerHTML = '';
    const f = filterText.toLowerCase();
    
    const isFuzzyMatch = (str, pattern) => {
      let pIdx = 0, sIdx = 0;
      while (pIdx < pattern.length && sIdx < str.length) {
        if (pattern[pIdx] === str[sIdx]) pIdx++;
        sIdx++;
      }
      return pIdx === pattern.length;
    };
    
    list.forEach(unit => {
      const searchStr = (unit.name + ' ' + (unit.fullName || '') + ' ' + (unit.symbol || '')).toLowerCase();
      if (!f || searchStr.includes(f) || isFuzzyMatch(searchStr, f)) {
        const isSelected = unit.name === val ? 'selected' : '';
        const displayTxt = this.currentCategory === 'Currency' 
          ? `<span>${unit.symbol} ${unit.name} — ${unit.fullName || ''}</span>`
          : `<span>${unit.name} (${unit.symbol})</span>`;
          
        const div = document.createElement('div');
        div.className = `custom-option ${isSelected}`;
        div.setAttribute('data-value', unit.name);
        div.innerHTML = displayTxt;
        
        div.addEventListener('click', () => {
          this.handleOptionSelect(type, unit.name);
        });
        
        container.appendChild(div);
      }
    });
  },

  filterOptions(type, text) {
    this.renderDropdownOptions(type, text);
  },

  handleOptionSelect(type, value) {
    if (type === 'compare') {
      App.addCompareUnit(value);
      this.closeAllDropdowns();
      return;
    }
    
    if (type === 'from') {
      this.currentFromValue = value;
    } else {
      this.currentToValue = value;
    }
    
    this.updateDropdownUI();
    this.closeAllDropdowns();
    App.handleUnitChange();
  },

  setDropdownValues(from, to) {
    if(from) this.currentFromValue = from;
    if(to) this.currentToValue = to;
    this.updateDropdownUI();
  },

  updateDropdownUI() {
    const getUnitDisplay = (val) => {
      if (!this.currentUnitList) return val;
      const unit = this.currentUnitList.find(u => u.name === val);
      if (!unit) return val;
      
      if (this.currentCategory === 'Currency') {
        return `<span>${unit.symbol} ${unit.name} — ${unit.fullName || ''}</span>`;
      } else {
        return `<span>${unit.name} (${unit.symbol})</span>`;
      }
    };

    this.elements.fromSelectValue.innerHTML = getUnitDisplay(this.currentFromValue);
    this.elements.toSelectValue.innerHTML = getUnitDisplay(this.currentToValue);

    const getUnitName = (val) => {
      if (!this.currentUnitList) return val;
      const unit = this.currentUnitList.find(u => u.name === val);
      if (!unit) return val;
      if (this.currentCategory === 'Currency') {
        return `${unit.symbol} ${unit.name} (${unit.fullName})`;
      }
      return unit.fullName || unit.name;
    };

    this.elements.fromLabel.textContent = `From — ${getUnitName(this.currentFromValue)}`;
    this.elements.toLabel.textContent = `To — ${getUnitName(this.currentToValue)}`;
    this.elements.resultUnitName.textContent = getUnitName(this.currentToValue);
    
    this.renderDropdownOptions('from', '');
    this.renderDropdownOptions('to', '');
    
    this.updateFavoriteIcon();
  },

  updateResult(value, rateText, unitName = null, formulaString = null) {
    // Remove fade class
    this.elements.resultValue.classList.remove('fade-typing');

    this.elements.resultValue.textContent = value;
    if (unitName !== null) {
      this.elements.resultUnitName.textContent = unitName;
    } else {
      const toUnit = this.currentToValue;
      if (this.currentCategory !== 'Currency') {
        const list = UnitData.units[this.currentCategory].list;
        const u = list.find(x => x.name === toUnit);
        this.elements.resultUnitName.textContent = u ? u.name : toUnit;
      } else {
        const c = UnitData.currencyUnits.find(x => x.code === toUnit);
        this.elements.resultUnitName.textContent = c ? c.name : toUnit;
      }
    }

    // Smart Font Resizing
    this.elements.resultValue.classList.remove('scale-sm', 'scale-xs');
    const valLength = String(value).length;
    if (valLength > 15) {
      this.elements.resultValue.classList.add('scale-xs');
    } else if (valLength > 10) {
      this.elements.resultValue.classList.add('scale-sm');
    }

    if (rateText) {
      this.elements.rateInfoText.textContent = rateText;
    } else {
      this.elements.rateInfoText.textContent = '';
    }

    if (formulaString && this.elements.formulaDisplay && this.elements.formulaText) {
      this.elements.formulaText.textContent = formulaString;
      this.elements.formulaDisplay.classList.remove('hidden');
    } else if (this.elements.formulaDisplay) {
      this.elements.formulaDisplay.classList.add('hidden');
    }
  },

  renderSparkline(rates) {
    const container = document.getElementById('sparklineContainer');
    if (!container) return;
    
    if (!rates || rates.length < 2) {
      container.classList.add('hidden');
      container.innerHTML = '';
      return;
    }
    
    container.classList.remove('hidden');
    
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;
    
    const width = 100; // relative viewBox
    const height = 40;
    
    const points = rates.map((r, i) => {
      const x = (i / (rates.length - 1)) * width;
      const y = height - (((r - min) / range) * height * 0.8) - (height * 0.1); // 10% padding
      return `${x},${y}`;
    });
    
    const pathData = `M ${points.join(' L ')}`;
    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;
    
    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <path class="sparkline-area" d="${areaData}" />
        <path class="sparkline-path" d="${pathData}" />
      </svg>
    `;
  },

  showInputError(show) {
    if (show) {
      this.elements.fromValue.classList.add('error');
    } else {
      this.elements.fromValue.classList.remove('error');
    }
  },

  toggleClearButton() {
    if (!this.elements.clearInputBtn) return;
    if (this.elements.fromValue.value.length > 0) {
      this.elements.clearInputBtn.classList.add('visible');
    } else {
      this.elements.clearInputBtn.classList.remove('visible');
    }
  },

  showToast(message, type = 'success') {
    if (!this.elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i><span>${message}</span>`;
    
    this.elements.toastContainer.appendChild(toast);
    if(window.lucide) window.lucide.createIcons();
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if(toast.parentElement) toast.remove();
      }, 300);
    }, 3000);
  },

  copyResult() {
    const val = this.elements.resultValue.textContent;
    if(!val || val === '0') return;
    
    navigator.clipboard.writeText(val).then(() => {
      this.playPopSound();
      this.triggerHaptic();
      
      this.elements.copyIcon.setAttribute('data-lucide', 'check');
      this.elements.copyIcon.classList.add('copy-success');
      if(window.lucide) window.lucide.createIcons();
      
      setTimeout(() => {
        this.elements.copyIcon.setAttribute('data-lucide', 'copy');
        this.elements.copyIcon.classList.remove('copy-success');
        if(window.lucide) window.lucide.createIcons();
      }, 1500);
    });
  },

  playPopSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  },

  triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  updateFavoriteIcon() {
    const isFav = Favorites.isFavorite(this.currentCategory, this.currentFromValue, this.currentToValue);
    
    if (isFav) {
      this.elements.favoriteIcon.style.fill = 'var(--accent)';
      this.elements.favoriteIcon.style.color = 'var(--accent)';
    } else {
      this.elements.favoriteIcon.style.fill = 'none';
      this.elements.favoriteIcon.style.color = 'currentColor';
    }
  },

  renderHistory(filter = '') {
    const items = HistoryData.getRecent(5);
    this.elements.recentList.innerHTML = '';
    
    if (items.length === 0) {
      this.elements.recentList.innerHTML = `<div class="empty-state">No recent conversions yet.</div>`;
    } else {
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
          <div>
            <strong>${item.inputValue} ${item.fromUnitSymbol} → ${item.resultValue} ${item.toUnitSymbol}</strong>
            <div style="font-size: 11px; color: var(--text-muted)">${Utils.formatTimeAgo(item.timestamp)}</div>
          </div>
        `;
        div.addEventListener('click', () => App.loadConversion(item.category, item.fromUnit, item.toUnit, item.inputValue));
        this.elements.recentList.appendChild(div);
      });
    }

    let allItems = HistoryData.getAll();
    if (filter) {
      const f = filter.toLowerCase();
      allItems = allItems.filter(i => 
        i.fromUnit.toLowerCase().includes(f) || 
        i.toUnit.toLowerCase().includes(f) || 
        i.category.toLowerCase().includes(f)
      );
    }
    
    this.elements.mobileHistoryList.innerHTML = '';
    if (allItems.length === 0) {
      this.elements.mobileHistoryList.innerHTML = `<div class="empty-state">No history found.</div>`;
    } else {
      allItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.style.marginBottom = '8px';
        div.innerHTML = `
          <div>
            <div style="font-size: 12px; color: var(--accent); margin-bottom: 2px;">${item.category}</div>
            <strong>${item.inputValue} ${item.fromUnit} → ${item.resultValue} ${item.toUnit}</strong>
            <div style="font-size: 11px; color: var(--text-muted)">${new Date(item.timestamp).toLocaleString()}</div>
          </div>
        `;
        div.addEventListener('click', () => {
          App.loadConversion(item.category, item.fromUnit, item.toUnit, item.inputValue);
          this.closeMobileView();
        });
        this.elements.mobileHistoryList.appendChild(div);
      });
    }
  },

  renderFavorites() {
    const items = Favorites.getAll();
    
    this.elements.favoritesList.innerHTML = '';
    if (items.length === 0) {
      this.elements.favoritesList.innerHTML = `<div class="empty-state">No favorites yet.</div>`;
    } else {
      items.slice(0, 5).forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
          <div><strong>${item.fromUnit} → ${item.toUnit}</strong></div>
          <button class="icon-btn" style="width:28px;height:28px;" title="Remove">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        `;
        div.addEventListener('click', (e) => {
          if(e.target.closest('button')) {
            Favorites.remove(item.id);
            this.renderFavorites();
            this.updateFavoriteIcon();
          } else {
            App.loadConversion(item.category, item.fromUnit, item.toUnit);
          }
        });
        this.elements.favoritesList.appendChild(div);
      });
    }

    this.elements.mobileFavoritesList.innerHTML = '';
    if (items.length === 0) {
      this.elements.mobileFavoritesList.innerHTML = `<div class="empty-state">No favorites yet.</div>`;
    } else {
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.style.marginBottom = '8px';
        div.innerHTML = `
          <div>
            <div style="font-size: 12px; color: var(--purple); margin-bottom: 2px;">${item.category}</div>
            <strong>${item.fromUnit} → ${item.toUnit}</strong>
          </div>
          <button class="icon-btn" style="width:32px;height:32px;" title="Remove">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
          </button>
        `;
        div.addEventListener('click', (e) => {
          if(e.target.closest('button')) {
            Favorites.remove(item.id);
            this.renderFavorites();
            this.updateFavoriteIcon();
          } else {
            App.loadConversion(item.category, item.fromUnit, item.toUnit);
            this.closeMobileView();
          }
        });
        this.elements.mobileFavoritesList.appendChild(div);
      });
    }
    if(window.lucide) window.lucide.createIcons();
  },

  renderQuickRef(category) {
    this.elements.quickRefList.innerHTML = '';
    let pairs = [];
    
    if (category === 'Length') pairs = [['Mile', 'Kilometer'], ['Inch', 'Centimeter'], ['Foot', 'Meter']];
    else if (category === 'Weight / Mass') pairs = [['Pound', 'Kilogram'], ['Ounce', 'Gram']];
    else if (category === 'Temperature') pairs = [['Celsius', 'Fahrenheit'], ['Fahrenheit', 'Celsius']];
    else if (category === 'Currency') pairs = [['USD', 'EUR'], ['USD', 'GBP'], ['EUR', 'USD']];
    else if (category === 'Speed') pairs = [['Mile per hour', 'Kilometer per hour'], ['Meter per second', 'Kilometer per hour']];
    else if (category === 'Volume') pairs = [['Gallon (US)', 'Liter'], ['Fluid Ounce (US)', 'Milliliter']];
    else if (category === 'Area') pairs = [['Acre', 'Hectare'], ['Square Mile', 'Square Kilometer']];
    else if (category === 'Time') pairs = [['Hour', 'Minute'], ['Day', 'Hour']];

    pairs.forEach(pair => {
      const [from, to] = pair;
      const rate = Converter.getExchangeRateLine(from, to, category);
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `<div>${rate}</div>`;
      div.addEventListener('click', () => App.loadConversion(category, from, to));
      this.elements.quickRefList.appendChild(div);
    });
  },

  openMobileView(target) {
    if (target === 'converter') {
      this.closeMobileView();
      return;
    }

    this.elements.bottomNavBtns.forEach(b => b.classList.remove('active'));
    document.querySelector(`.bottom-nav-btn[data-target="${target}"]`).classList.add('active');

    this.elements.fullPageView.classList.remove('hidden');
    this.elements.settingsContent.classList.add('hidden');
    this.elements.historyContent.classList.add('hidden');
    this.elements.favoritesContent.classList.add('hidden');

    if (target === 'settings') {
      this.elements.viewTitle.textContent = 'Settings';
      this.elements.settingsContent.classList.remove('hidden');
    } else if (target === 'history') {
      this.elements.viewTitle.textContent = 'History';
      this.elements.historyContent.classList.remove('hidden');
      this.renderHistory();
    } else if (target === 'favorites') {
      this.elements.viewTitle.textContent = 'Favorites';
      this.elements.favoritesContent.classList.remove('hidden');
      this.renderFavorites();
    }
  },

  closeMobileView() {
    this.elements.fullPageView.classList.add('hidden');
    this.elements.bottomNavBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.bottom-nav-btn[data-target="converter"]').classList.add('active');
  },

  renderCompareList(list, value, fromUnit, category) {
    if (!this.elements.multiCompareList) return;
    this.elements.multiCompareList.innerHTML = '';
    const settings = Settings.get();
    
    list.forEach(toUnit => {
      let resultStr = '...';
      try {
        const result = Converter.convert(value, fromUnit, toUnit, category);
        resultStr = Utils.formatNumber(result, settings.decimalPlaces, settings.numberFormat);
      } catch (e) {
        resultStr = '-';
      }
      
      let toSym = toUnit;
      let toName = toUnit;
      if (category === 'Currency') {
         const unitData = UnitData.currencyUnits.find(u => u.name === toUnit);
         if(unitData) { toSym = unitData.symbol; toName = `${toSym} ${toUnit}`; }
      } else {
         const unitData = UnitData.units[category].list.find(u => u.name === toUnit);
         if(unitData) { toSym = unitData.symbol; toName = unitData.name; }
      }

      const div = document.createElement('div');
      div.className = 'multi-compare-item';
      div.innerHTML = `
        <div>
          <span class="multi-compare-value">${resultStr}</span>
          <span class="multi-compare-unit">${toName}</span>
        </div>
        <div class="multi-compare-remove tooltip-trigger" aria-label="Remove" data-unit="${toUnit}">
          <i data-lucide="x"></i>
        </div>
      `;
      div.querySelector('.multi-compare-remove').addEventListener('click', (e) => {
        App.removeCompareUnit(e.currentTarget.getAttribute('data-unit'));
      });
      this.elements.multiCompareList.appendChild(div);
    });
    if(window.lucide) window.lucide.createIcons();
  }
};
