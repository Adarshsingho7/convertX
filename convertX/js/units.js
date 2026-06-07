// js/units.js
const UnitData = {
  categories: [
    'Currency', 'Length', 'Weight / Mass', 'Temperature', 
    'Area', 'Volume', 'Speed', 'Time', 'Programmer Base',
    'Smart Cooking', 'Roman Numeral',
    'Time Zone', 'Shoe Sizes'
  ],

  // Base unit approach: all conversions are relative to the first unit
  units: {
    'Length': {
      base: 'Meter',
      list: [
        { name: 'Meter', symbol: 'm', factor: 1 },
        { name: 'Kilometer', symbol: 'km', factor: 1000 },
        { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
        { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
        { name: 'Micrometer', symbol: 'µm', factor: 1e-6 },
        { name: 'Nanometer', symbol: 'nm', factor: 1e-9 },
        { name: 'Mile', symbol: 'mi', factor: 1609.344 },
        { name: 'Yard', symbol: 'yd', factor: 0.9144 },
        { name: 'Foot', symbol: 'ft', factor: 0.3048 },
        { name: 'Inch', symbol: 'in', factor: 0.0254 },
        { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
        { name: 'Light Year', symbol: 'ly', factor: 9.461e15 }
      ]
    },
    'Weight / Mass': {
      base: 'Kilogram',
      list: [
        { name: 'Kilogram', symbol: 'kg', factor: 1 },
        { name: 'Gram', symbol: 'g', factor: 0.001 },
        { name: 'Milligram', symbol: 'mg', factor: 1e-6 },
        { name: 'Microgram', symbol: 'µg', factor: 1e-9 },
        { name: 'Metric Ton', symbol: 't', factor: 1000 },
        { name: 'Pound', symbol: 'lb', factor: 0.45359237 },
        { name: 'Ounce', symbol: 'oz', factor: 0.02834952 },
        { name: 'Stone', symbol: 'st', factor: 6.35029318 },
        { name: 'Imperial Ton', symbol: 't (Imp)', factor: 1016.0469088 },
        { name: 'US Ton', symbol: 't (US)', factor: 907.18474 },
        { name: 'Carat', symbol: 'ct', factor: 0.0002 }
      ]
    },
    'Temperature': {
      base: 'Celsius',
      list: [
        { name: 'Celsius', symbol: '°C' },
        { name: 'Fahrenheit', symbol: '°F' },
        { name: 'Kelvin', symbol: 'K' },
        { name: 'Rankine', symbol: '°R' }
      ]
    },
    'Area': {
      base: 'Square Meter',
      list: [
        { name: 'Square Meter', symbol: 'm²', factor: 1 },
        { name: 'Square Kilometer', symbol: 'km²', factor: 1e6 },
        { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
        { name: 'Square Millimeter', symbol: 'mm²', factor: 1e-6 },
        { name: 'Hectare', symbol: 'ha', factor: 10000 },
        { name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 },
        { name: 'Square Yard', symbol: 'yd²', factor: 0.83612736 },
        { name: 'Square Foot', symbol: 'ft²', factor: 0.09290304 },
        { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
        { name: 'Acre', symbol: 'ac', factor: 4046.856422 }
      ]
    },
    'Volume': {
      base: 'Liter',
      list: [
        { name: 'Liter', symbol: 'L', factor: 1 },
        { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
        { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
        { name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001 },
        { name: 'Cubic Millimeter', symbol: 'mm³', factor: 1e-6 },
        { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541178 },
        { name: 'Gallon (UK)', symbol: 'gal', factor: 4.54609 },
        { name: 'Quart (US)', symbol: 'qt', factor: 0.946352946 },
        { name: 'Pint (US)', symbol: 'pt', factor: 0.473176473 },
        { name: 'Cup (US)', symbol: 'cup', factor: 0.236588236 },
        { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.029573529 },
        { name: 'Tablespoon', symbol: 'tbsp', factor: 0.014786764 },
        { name: 'Teaspoon', symbol: 'tsp', factor: 0.004928921 },
        { name: 'Cubic Inch', symbol: 'in³', factor: 0.016387064 },
        { name: 'Cubic Foot', symbol: 'ft³', factor: 28.316846592 }
      ]
    },
    'Speed': {
      base: 'Meter per second',
      list: [
        { name: 'Meter per second', symbol: 'm/s', factor: 1 },
        { name: 'Kilometer per hour', symbol: 'km/h', factor: 0.277777778 },
        { name: 'Mile per hour', symbol: 'mph', factor: 0.44704 },
        { name: 'Knot', symbol: 'kn', factor: 0.514444444 },
        { name: 'Foot per second', symbol: 'ft/s', factor: 0.3048 },
        { name: 'Mach (at sea level)', symbol: 'Ma', factor: 340.3 }
      ]
    },
    'Time': {
      base: 'Second',
      list: [
        { name: 'Second', symbol: 's', factor: 1 },
        { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
        { name: 'Microsecond', symbol: 'µs', factor: 1e-6 },
        { name: 'Nanosecond', symbol: 'ns', factor: 1e-9 },
        { name: 'Minute', symbol: 'min', factor: 60 },
        { name: 'Hour', symbol: 'hr', factor: 3600 },
        { name: 'Day', symbol: 'd', factor: 86400 },
        { name: 'Week', symbol: 'wk', factor: 604800 },
        { name: 'Month (30 days)', symbol: 'mo', factor: 2592000 },
        { name: 'Year (365 days)', symbol: 'yr', factor: 31536000 },
        { name: 'Decade', symbol: 'dec', factor: 315360000 },
        { name: 'Century', symbol: 'c', factor: 3153600000 }
      ]
    },
    'Programmer Base': {
      base: 'Decimal',
      list: [
        { name: 'Decimal', symbol: 'dec' },
        { name: 'Binary', symbol: 'bin' },
        { name: 'Hexadecimal', symbol: 'hex' },
        { name: 'Octal', symbol: 'oct' }
      ]
    },
    'Roman Numeral': {
      base: 'Number',
      list: [
        { name: 'Number', symbol: '#' },
        { name: 'Roman', symbol: 'I' }
      ]
    },
    'Time Zone': {
      base: 'UTC',
      list: [
        { name: 'UTC', symbol: 'UTC', offset: 0 },
        { name: 'PST (Pacific Standard Time)', symbol: 'PST', offset: -8 },
        { name: 'PDT (Pacific Daylight Time)', symbol: 'PDT', offset: -7 },
        { name: 'EST (Eastern Standard Time)', symbol: 'EST', offset: -5 },
        { name: 'EDT (Eastern Daylight Time)', symbol: 'EDT', offset: -4 },
        { name: 'GMT (Greenwich Mean Time)', symbol: 'GMT', offset: 0 },
        { name: 'CET (Central European Time)', symbol: 'CET', offset: 1 },
        { name: 'CEST (Central European Summer Time)', symbol: 'CEST', offset: 2 },
        { name: 'IST (Indian Standard Time)', symbol: 'IST', offset: 5.5 },
        { name: 'JST (Japan Standard Time)', symbol: 'JST', offset: 9 },
        { name: 'AEST (Australian Eastern Standard Time)', symbol: 'AEST', offset: 10 }
      ]
    },
    'Shoe Sizes': {
      base: 'US',
      list: [
        { name: 'US', symbol: 'US' },
        { name: 'UK', symbol: 'UK' },
        { name: 'EU', symbol: 'EU' },
        { name: 'CM', symbol: 'cm' }
      ]
    },
    'Smart Cooking': {
      base: 'Gram',
      list: [
        { name: 'Gram', symbol: 'g', type: 'weight', factor: 1 },
        { name: 'Kilogram', symbol: 'kg', type: 'weight', factor: 1000 },
        { name: 'Ounce', symbol: 'oz', type: 'weight', factor: 28.3495 },
        { name: 'Pound', symbol: 'lb', type: 'weight', factor: 453.592 },
        { name: 'Milliliter', symbol: 'mL', type: 'volume', factor: 1 },
        { name: 'Liter', symbol: 'L', type: 'volume', factor: 1000 },
        { name: 'Teaspoon (US)', symbol: 'tsp', type: 'volume', factor: 4.92892 },
        { name: 'Tablespoon (US)', symbol: 'tbsp', type: 'volume', factor: 14.7868 },
        { name: 'Cup (US)', symbol: 'cup', type: 'volume', factor: 236.588 }
      ]
    }
  },

  cookingIngredients: [
    { name: 'Water', density: 1.00 },
    { name: 'Flour (All-Purpose)', density: 0.53 },
    { name: 'Sugar (Granulated)', density: 0.85 },
    { name: 'Butter', density: 0.96 },
    { name: 'Honey', density: 1.42 },
    { name: 'Milk', density: 1.03 },
    { name: 'Vegetable Oil', density: 0.93 },
    { name: 'Salt (Table)', density: 1.20 }
  ],

  shoeGenders: ['Men', 'Women', 'Kids'],

  // Simplified approximation curves for shoe sizes
  // Length in CM roughly correlates to these sizes
  shoeSizeCalc: {
    'Men': {
      'US': (cm) => cm - 18,
      'UK': (cm) => cm - 19,
      'EU': (cm) => (cm + 1.5) * 1.5,
      'CM': (cm) => cm
    },
    'Women': {
      'US': (cm) => cm - 16.5,
      'UK': (cm) => cm - 18.5,
      'EU': (cm) => (cm + 1) * 1.5,
      'CM': (cm) => cm
    },
    'Kids': {
      'US': (cm) => cm - 8,
      'UK': (cm) => cm - 8.5,
      'EU': (cm) => cm * 1.5 + 4,
      'CM': (cm) => cm
    }
  },
  shoeReverseCalc: {
    'Men': {
      'US': (size) => size + 18,
      'UK': (size) => size + 19,
      'EU': (size) => (size / 1.5) - 1.5,
      'CM': (size) => size
    },
    'Women': {
      'US': (size) => size + 16.5,
      'UK': (size) => size + 18.5,
      'EU': (size) => (size / 1.5) - 1,
      'CM': (size) => size
    },
    'Kids': {
      'US': (size) => size + 8,
      'UK': (size) => size + 8.5,
      'EU': (size) => (size - 4) / 1.5,
      'CM': (size) => size
    }
  },

  // Populated dynamically from Currency.js
  currencyUnits: [] 
};
