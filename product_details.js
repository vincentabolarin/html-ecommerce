document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // Sample product data (replace with your actual data)
  const product = {
    id: productId,
    name: `Product ${productId}`,
    description: `Description for Product ${productId}`,
    price: `$${(Math.random() * 100 + 50).toFixed(2)}`,
    image: `https://source.unsplash.com/300x300/?product`,
  };

  displayProductDetails(product);
});

function displayProductDetails(product) {
  const productDetailsContainer = document.querySelector(".product-details");

  const productDetailHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: <span class="price">${product.price}</span></p>
            <button id="add-to-cart">Add to Cart</button>
        </div>
    `;

  productDetailsContainer.innerHTML = productDetailHTML;

  // Add event listener for Add to Cart button
  const addToCartButton = document.getElementById("add-to-cart");
  addToCartButton.addEventListener("click", () => {
    // Implement add to cart functionality
    // You can use localStorage or other methods to store cart items
    alert("Product added to cart!");
  });
}
