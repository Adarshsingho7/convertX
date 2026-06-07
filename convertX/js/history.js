// js/history.js
const HistoryData = {
  items: [],
  maxItems: 50,

  init() {
    const data = localStorage.getItem('convertx_history');
    if (data) {
      try {
        this.items = JSON.parse(data);
      } catch (e) {
        this.items = [];
      }
    }
  },

  add(category, fromUnit, fromUnitSymbol, toUnit, toUnitSymbol, inputValue, resultValue) {
    if (this.items.length > 0) {
      const last = this.items[0];
      if (last.category === category && 
          last.fromUnit === fromUnit && 
          last.toUnit === toUnit && 
          last.inputValue === inputValue) {
        return;
      }
    }

    const item = {
      id: Utils.generateUUID(),
      category,
      fromUnit,
      fromUnitSymbol,
      toUnit,
      toUnitSymbol,
      inputValue,
      resultValue,
      timestamp: new Date().toISOString()
    };

    this.items.unshift(item);
    
    if (this.items.length > this.maxItems) {
      this.items = this.items.slice(0, this.maxItems);
    }
    
    this.save();
  },

  getRecent(limit = 5) {
    return this.items.slice(0, limit);
  },

  getAll() {
    return this.items;
  },

  clear() {
    this.items = [];
    this.save();
  },

  save() {
    localStorage.setItem('convertx_history', JSON.stringify(this.items));
  },
  
  exportCSV() {
    if (this.items.length === 0) return;
    
    const headers = ['Date', 'Category', 'From Value', 'From Unit', 'To Value', 'To Unit'];
    const rows = this.items.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.category,
      item.inputValue,
      item.fromUnit,
      item.resultValue,
      item.toUnit
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "convertx_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
