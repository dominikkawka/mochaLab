class Catalogue {
  constructor(title) {
    this.title = title;
    this.products = [];
  }

  findProductById(id) {
    const match = this.products.find((product) => id === product.id);
    return match;
  }

  addProduct(product) {
    if (!this.findProductById(product.id)) {
      this.products.push(product);
      return true;
    }
    return false;
  }

  removeProductById(id) {
    const removedProduct = this.findProductById(id);
    if (removedProduct) {
      this.products = this.products.filter(
        (product) => product.id !== id 
      );
    }
    return removedProduct;
  }

  checkReorders() {
    const result = { type: "Reorder", productIds: [] };
    result.productIds = this.products
      .filter((p) => p.quantityInStock <= p.reorderLevel)
      .map((p) => p.id);
    return result;
  }

  batchAddProducts(batch) {
    const productIDClash = batch.products.some(
      (product) => this.findProductById(product.id) !== undefined
    );
    if (productIDClash) {
      throw new Error("Bad Batch");
    }
    const noProductsAdded = batch.products
      .filter((product) => product.quantityInStock > 0 )
      .filter((p) => {
        this.addProduct(p);
        return true;
      })
      .reduce((acc, p) => acc + 1, 0);
    return noProductsAdded;
  }

  search(criteria) {
    const result = { type: "search", productIds: [] };
    if (criteria.price) {
      result.productIds = this.products.filter((p) => p.price <= criteria.price).map((p) => p.id);
      return result
    } else if (criteria.keyword) {
      //const lowercase = criteria.keyword.toLowerCase()
      //result.productIds = this.products.filter((p) => p.name.search(lowercase)).map((p) => p.id);
      result.productIds = this.products.filter((p) => p.name.search(criteria.keyword) >= 0).map((p) => p.id);
      return result
    } else {
      throw new Error("Bad search");
    }
  }
  
}
module.exports = Catalogue;
