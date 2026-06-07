// js/converter.js
const Converter = {
  convert(value, fromUnitName, toUnitName, category, contextValue = null) {
    // String inputs are allowed for Base, Color, Roman, Time Zone
    const isStringCategory = ['Programmer Base', 'Color Code', 'Roman Numeral', 'Time Zone'].includes(category);
    
    if (!isStringCategory && (value === null || isNaN(value) || value === '')) return 0;
    if (!isStringCategory && value === 0) return 0;
    if (fromUnitName === toUnitName) return value;

    if (category === 'Currency') {
      return Currency.convert(value, fromUnitName, toUnitName);
    }
    if (category === 'Temperature') {
      return this.convertTemperature(value, fromUnitName, toUnitName);
    }
    if (category === 'Programmer Base') {
      return this.convertBase(value, fromUnitName, toUnitName);
    }
    if (category === 'Color Code') {
      return this.convertColor(value, fromUnitName, toUnitName);
    }
    if (category === 'Roman Numeral') {
      return this.convertRoman(value, fromUnitName, toUnitName);
    }
    if (category === 'Time Zone') {
      return this.convertTime(value, fromUnitName, toUnitName);
    }
    if (category === 'Shoe Sizes') {
      return this.convertShoeSize(value, fromUnitName, toUnitName, contextValue);
    }
    if (category === 'Smart Cooking') {
      return this.convertCooking(value, fromUnitName, toUnitName, contextValue);
    }

    const unitList = UnitData.units[category].list;
    const fromUnit = unitList.find(u => u.name === fromUnitName);
    const toUnit = unitList.find(u => u.name === toUnitName);

    if (!fromUnit || !toUnit) return 0;

    const valueInBase = value * fromUnit.factor;
    return valueInBase / toUnit.factor;
  },

  convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    switch (fromUnit) {
      case 'Celsius': celsius = value; break;
      case 'Fahrenheit': celsius = (value - 32) * 5/9; break;
      case 'Kelvin': celsius = value - 273.15; break;
      case 'Rankine': celsius = (value - 491.67) * 5/9; break;
      default: celsius = value;
    }
    switch (toUnit) {
      case 'Celsius': return celsius;
      case 'Fahrenheit': return (celsius * 9/5) + 32;
      case 'Kelvin': return celsius + 273.15;
      case 'Rankine': return (celsius + 273.15) * 9/5;
      default: return celsius;
    }
  },

  convertBase(value, fromUnit, toUnit) {
    try {
      const bases = { 'Decimal': 10, 'Binary': 2, 'Hexadecimal': 16, 'Octal': 8 };
      let fromBase = bases[fromUnit];
      let toBase = bases[toUnit];
      let valStr = String(value).trim();
      if (!valStr) return '';
      let parsed = parseInt(valStr, fromBase);
      if (isNaN(parsed)) return 'Invalid';
      let result = parsed.toString(toBase);
      if (toUnit === 'Hexadecimal') return result.toUpperCase();
      return result;
    } catch(e) { return 'Invalid'; }
  },

  convertColor(value, fromUnit, toUnit) {
    let valStr = String(value).trim();
    if(!valStr) return '';
    // To simplify this massive converter, we'll convert everything to RGB first.
    let rgb = [0,0,0];
    
    try {
      if (fromUnit === 'HEX') {
        let hex = valStr.replace('#','');
        if (hex.length === 3) hex = hex.split('').map(x => x+x).join('');
        if (hex.length !== 6) return 'Invalid';
        rgb = [parseInt(hex.substring(0,2),16), parseInt(hex.substring(2,4),16), parseInt(hex.substring(4,6),16)];
      } else if (fromUnit === 'RGB') {
        let matches = valStr.match(/\d+/g);
        if(!matches || matches.length < 3) return 'Invalid';
        rgb = [parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2])];
      } else if (fromUnit === 'HSL') {
        let matches = valStr.match(/\d+/g);
        if(!matches || matches.length < 3) return 'Invalid';
        let h = parseInt(matches[0])/360, s = parseInt(matches[1])/100, l = parseInt(matches[2])/100;
        let r, g, b;
        if(s === 0) { r = g = b = l; }
        else {
          const hue2rgb = (p, q, t) => {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          let p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        rgb = [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
      } else if (fromUnit === 'CMYK') {
        let matches = valStr.match(/\d+/g);
        if(!matches || matches.length < 4) return 'Invalid';
        let c = parseInt(matches[0])/100, m = parseInt(matches[1])/100, y = parseInt(matches[2])/100, k = parseInt(matches[3])/100;
        rgb = [Math.round(255 * (1 - c) * (1 - k)), Math.round(255 * (1 - m) * (1 - k)), Math.round(255 * (1 - y) * (1 - k))];
      }
      
      if (rgb.some(isNaN)) return 'Invalid';
      rgb = rgb.map(x => Math.max(0, Math.min(255, x)));

      if (toUnit === 'RGB') return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      if (toUnit === 'HEX') {
        const toHex = (n) => {
          let h = n.toString(16).toUpperCase();
          return h.length === 1 ? '0'+h : h;
        };
        return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
      }
      if (toUnit === 'HSL') {
        let r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if(max === min) h = s = 0;
        else {
          let d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
      }
      if (toUnit === 'CMYK') {
        let r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255;
        let k = 1 - Math.max(r, g, b);
        let c = k === 1 ? 0 : (1 - r - k) / (1 - k);
        let m = k === 1 ? 0 : (1 - g - k) / (1 - k);
        let y = k === 1 ? 0 : (1 - b - k) / (1 - k);
        return `cmyk(${Math.round(c*100)}%, ${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(k*100)}%)`;
      }
    } catch(e) { return 'Invalid'; }
  },

  convertRoman(value, fromUnit, toUnit) {
    if (fromUnit === 'Number' && toUnit === 'Roman') {
      let num = parseInt(value);
      if (isNaN(num) || num <= 0 || num >= 4000) return 'Invalid (1-3999)';
      const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
      let roman = '';
      for (let i in lookup) {
        while (num >= lookup[i]) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    } else if (fromUnit === 'Roman' && toUnit === 'Number') {
      let roman = String(value).toUpperCase().trim();
      const lookup = {M:1000,D:500,C:100,L:50,X:10,V:5,I:1};
      let num = 0;
      for (let i = 0; i < roman.length; i++) {
        let current = lookup[roman[i]];
        let next = lookup[roman[i+1]];
        if (!current) return 'Invalid';
        if (next && current < next) {
          num -= current;
        } else {
          num += current;
        }
      }
      return num;
    }
    return value;
  },

  convertTime(value, fromUnit, toUnit) {
    let valStr = String(value).trim();
    if (!valStr) return '';
    let timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/;
    let match = valStr.match(timeRegex);
    if (!match) return 'Invalid (HH:MM)';
    
    let hours = parseInt(match[1]);
    let mins = parseInt(match[2]);
    let period = match[3] ? match[3].toUpperCase() : null;

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const list = UnitData.units['Time Zone'].list;
    let fromOffset = list.find(u => u.name === fromUnit).offset;
    let toOffset = list.find(u => u.name === toUnit).offset;
    
    let diff = toOffset - fromOffset;
    
    let totalMins = (hours * 60) + mins + (diff * 60);
    
    while (totalMins < 0) totalMins += 24 * 60;
    totalMins = totalMins % (24 * 60);
    
    let newHours = Math.floor(totalMins / 60);
    let newMins = Math.round(totalMins % 60);
    
    let newPeriod = newHours >= 12 ? 'PM' : 'AM';
    let displayHours = newHours % 12;
    if (displayHours === 0) displayHours = 12;
    let displayMins = newMins < 10 ? '0' + newMins : newMins;
    
    return `${displayHours}:${displayMins} ${newPeriod}`;
  },

  convertShoeSize(value, fromUnit, toUnit, contextValue) {
    if (isNaN(value) || value === null || value === '') return 0;
    if (!contextValue) return 0;
    let gender = contextValue;
    let cmFn = UnitData.shoeReverseCalc[gender][fromUnit];
    let cm = cmFn(parseFloat(value));
    
    let toFn = UnitData.shoeSizeCalc[gender][toUnit];
    let result = toFn(cm);
    
    return result;
  },

  convertCooking(value, fromUnitName, toUnitName, contextValue) {
    if (isNaN(value) || value === null || value === '') return 0;
    if (!contextValue) return 0;
    
    let densityObj = UnitData.cookingIngredients.find(i => i.name === contextValue);
    if(!densityObj) return 0;
    let density = densityObj.density;
    
    const unitList = UnitData.units['Smart Cooking'].list;
    const fromUnit = unitList.find(u => u.name === fromUnitName);
    const toUnit = unitList.find(u => u.name === toUnitName);

    if (!fromUnit || !toUnit) return 0;

    let valInBaseType; 
    if (fromUnit.type === 'volume') {
      valInBaseType = value * fromUnit.factor; 
    } else {
      valInBaseType = value * fromUnit.factor; 
    }
    
    let convertedBaseType = valInBaseType;
    if (fromUnit.type === 'volume' && toUnit.type === 'weight') {
      convertedBaseType = valInBaseType * density;
    } else if (fromUnit.type === 'weight' && toUnit.type === 'volume') {
      convertedBaseType = valInBaseType / density;
    }
    
    return convertedBaseType / toUnit.factor;
  },

  getExchangeRateLine(fromUnitName, toUnitName, category) {
    const isStringCategory = ['Programmer Base', 'Color Code', 'Roman Numeral', 'Time Zone'].includes(category);
    if (isStringCategory) return '';

    if (fromUnitName === toUnitName) return `1 ${fromUnitName} = 1 ${toUnitName}`;
    const val = this.convert(1, fromUnitName, toUnitName, category, null);
    
    if (isNaN(val) || val === '') return '';
    
    const settings = Settings.get();
    const formatted = Utils.formatNumber(val, settings.decimalPlaces, settings.numberFormat);
    
    return `1 ${fromUnitName} = ${formatted} ${toUnitName}`;
  },

  getFormulaString(fromUnitName, toUnitName, category, inputValue, resultValue) {
    const isStringCategory = ['Programmer Base', 'Color Code', 'Roman Numeral', 'Time Zone', 'Shoe Sizes', 'Smart Cooking'].includes(category);
    if (isStringCategory) return null;

    const valStr = Utils.formatNumber(inputValue, 2, 'comma');
    const resStr = Utils.formatNumber(resultValue, 2, 'comma');

    if (fromUnitName === toUnitName) {
      return `${valStr} × 1 = ${resStr} ${toUnitName}`;
    }

    if (category === 'Temperature') {
      if (fromUnitName === 'Celsius' && toUnitName === 'Fahrenheit') return `(${valStr}°C × 9/5) + 32 = ${resStr}°F`;
      if (fromUnitName === 'Fahrenheit' && toUnitName === 'Celsius') return `(${valStr}°F - 32) × 5/9 = ${resStr}°C`;
      if (fromUnitName === 'Celsius' && toUnitName === 'Kelvin') return `${valStr}°C + 273.15 = ${resStr}K`;
      if (fromUnitName === 'Kelvin' && toUnitName === 'Celsius') return `${valStr}K - 273.15 = ${resStr}°C`;
      if (fromUnitName === 'Fahrenheit' && toUnitName === 'Kelvin') return `(${valStr}°F - 32) × 5/9 + 273.15 = ${resStr}K`;
      if (fromUnitName === 'Kelvin' && toUnitName === 'Fahrenheit') return `(${valStr}K - 273.15) × 9/5 + 32 = ${resStr}°F`;
      return null;
    }

    if (category === 'Currency') {
      const fromRate = Currency.rates[fromUnitName] || 1;
      const toRate = Currency.rates[toUnitName] || 1;
      const multiplier = (toRate / fromRate).toFixed(4);
      return `${valStr} × ${multiplier} = ${resStr} ${toUnitName}`;
    }

    const unitList = UnitData.units[category].list;
    const fromUnit = unitList.find(u => u.name === fromUnitName);
    const toUnit = unitList.find(u => u.name === toUnitName);

    if (fromUnit && toUnit) {
      const multiplier = (fromUnit.factor / toUnit.factor).toPrecision(4);
      return `${valStr} × ${multiplier} = ${resStr} ${toUnitName}`;
    }

    return null;
  }
};
