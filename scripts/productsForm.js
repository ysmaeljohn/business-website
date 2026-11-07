
function renderProductsForm() {
const productsFormHTML = `
  <div class="modal-content">
    <button class="close-btn">x</button>
    <div class="modal-body">
      <img class="form-product-image" alt="Product">
      <div class="modal-details">
        <h2 class="form-product-title">Product Name</h2>
        <p class="form-product-desc">Product description goes here.</p>
        
        <form id="cart-form">
          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" value="1" min="1" max="99">
          </div>

          <div class="form-group">
            <label>Color / Style:</label>
            <div class="color-options">
              <label><input type="radio" name="color" value="Classic" checked> Classic</label>
              <label><input type="radio" name="color" value="Dark Chocolate"> Dark</label>
            </div>
          </div>

          <button type="submit" class="confirm-cart-btn">Confirm Add to Cart</button>
        </form>
      </div>
    </div>
  </div>
`
}