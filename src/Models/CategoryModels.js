const createRepository = require("../config/repository");

const Category = createRepository("categories", {
  category: { col: "category", type: "text" },
});

class CategoryRules {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.category = null;
  }

  async create() {
    this.category = await Category.insert(this.body);
  }

  async read() {
    const categories = await Category.findAll();
    return categories.sort((a, b) => a.category.localeCompare(b.category, "pt-BR"));
  }

  async update() {}

  async delete() {}

  async findByCategory(categoryName) {
    if (!categoryName) return null;
    return Category.findOne("category", categoryName);
  }
}

module.exports = CategoryRules;
