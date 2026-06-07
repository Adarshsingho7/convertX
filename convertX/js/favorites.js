// js/favorites.js
const Favorites = {
  items: [],
  maxItems: 20,

  init() {
    const data = localStorage.getItem('convertx_favorites');
    if (data) {
      try {
        this.items = JSON.parse(data);
      } catch (e) {
        this.items = [];
      }
    }
  },

  toggle(category, fromUnit, toUnit) {
    const idx = this.findIndex(category, fromUnit, toUnit);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    } else {
      if (this.items.length >= this.maxItems) {
        this.items.pop(); // Remove oldest
      }
      this.items.unshift({
        id: Utils.generateUUID(),
        category,
        fromUnit,
        toUnit,
        addedAt: new Date().toISOString()
      });
    }
    this.save();
    return this.isFavorite(category, fromUnit, toUnit);
  },

  isFavorite(category, fromUnit, toUnit) {
    return this.findIndex(category, fromUnit, toUnit) !== -1;
  },

  findIndex(category, fromUnit, toUnit) {
    return this.items.findIndex(fav => 
      fav.category === category && fav.fromUnit === fromUnit && fav.toUnit === toUnit
    );
  },

  remove(id) {
    this.items = this.items.filter(fav => fav.id !== id);
    this.save();
  },

  getAll() {
    return this.items;
  },

  clear() {
    this.items = [];
    this.save();
  },

  save() {
    localStorage.setItem('convertx_favorites', JSON.stringify(this.items));
  }
};
