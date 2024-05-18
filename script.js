document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navItems = document.querySelector(".nav-items");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navItems.classList.toggle("active");
  });
  
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");
  const itemsPerPage = 20;
  let cartCount = 0;
  let cartItems = [];

  const categories = {
    electronics: generateItems(30, "Electronics"),
    clothing: generateItems(25, "Clothing"),
    books: generateItems(35, "Books"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const activeTab = document.querySelector(".tab.active");
      if (tab === activeTab) return;

      activeTab.classList.remove("active");
      tab.classList.add("active");

      const activeContent = document.querySelector(".tab-content.show");
      activeContent.classList.remove("show");

      const tabId = tab.getAttribute("data-tab");
      const contentToShow = document.getElementById(tabId);
      contentToShow.classList.add("show");

      setTimeout(() => {
        displayItems(tabId, 1);
      }, 300);
    });
  });

  tabs[0].classList.add("active");
  contents[0].classList.add("show");
  displayItems("electronics", 1);

  function generateItems(count, category) {
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        id: `${category.toLowerCase().replace(" ", "-")}-${i}`,
        name: `${category} Product ${i}`,
        description: `Description for ${category} Product ${i}`,
        price: getRandomPrice(),
        image: `https://source.unsplash.com/150x150/?${category
          .toLowerCase()
          .replace(" ", ",")},${i}`,
      });
    }
    return items;
  }

  function getRandomPrice() {
    return `$${(Math.floor(Math.random() * 100) + 50).toFixed(2)}`;
  }

  function displayItems(category, page) {
    const itemsContainer = document.querySelector(`#${category} .items`);
    const paginationContainer = document.querySelector(
      `#${category} .pagination`
    );
    const items = categories[category];
    const totalPages = Math.ceil(items.length / itemsPerPage);

    itemsContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToDisplay = items.slice(start, end);

    itemsToDisplay.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("item");
      itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">${item.price}</p>
                <div class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image}">
                    <i class="fas fa-cart-plus"></i>
                </div>
            `;
      itemsContainer.appendChild(itemElement);
    });

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      if (i === page) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => displayItems(category, i));
      paginationContainer.appendChild(button);
    }

    const addToCartIcons = document.querySelectorAll(".add-to-cart");
    addToCartIcons.forEach((icon) => {
      icon.addEventListener("click", addToCart);
    });
  }

  function addToCart(event) {
    const itemElement = event.currentTarget;
    const itemId = itemElement.getAttribute("data-id");
    const itemName = itemElement.getAttribute("data-name");
    const itemImage = itemElement.getAttribute("data-image");
    const itemPrice = itemElement.getAttribute("data-price");

    let cartItem = cartItems.find((item) => item.id === itemId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cartItems.push({
        id: itemId,
        name: itemName,
        image: itemImage,
        price: itemPrice,
        quantity: 1,
      });
    }

    cartCount++;
    document.querySelector(".cart-count").textContent = cartCount;
    updateCartModal();
  }

  function removeItemFromCart(event) {
    const itemId = event.currentTarget.getAttribute("data-id");
    const index = cartItems.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      cartItems.splice(index, 1); // Remove the item from the cartItems array
      cartCount--; // Decrease the cart count
      document.querySelector(".cart-count").textContent = cartCount;
      updateCartModal(); // Update the cart modal to reflect the changes
    }
  }


  function updateCartModal() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.getElementById("cart-total-price");

    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    cartItems.forEach((item) => {
      const itemTotal = parseFloat(item.price.substring(1)) * item.quantity;
      totalPrice += itemTotal;
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      cartItemElement.innerHTML = `
        <div class="item-info">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <p><strong>${item.name}</strong></p>
                <div>
                    <span class="item-price">${item.price}</span> x 
                    <span class="item-quantity">${item.quantity}</span>
                </div>
            </div>
        </div>
        <button class="remove-item-button" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

    const removeItemButtons = document.querySelectorAll(".remove-item-button");
    removeItemButtons.forEach((button) => {
      button.addEventListener("click", removeItemFromCart);
    });

    const emptyCartMessage = document.getElementById("empty-cart-message");
    emptyCartMessage.style.display = cartItems.length ? "none" : "block";
  }

  // Modal functionality
  const modal = document.getElementById("cart-modal");
  const cartIcon = document.querySelector(".cart-icon");
  const closeModal = document.querySelector(".close");

  cartIcon.addEventListener("click", () => {
    modal.style.display = "flex";
    updateCartModal();
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";
  });

  // Initialize theme
  document.body.classList.add("light-mode");
  themeToggle.textContent = "Dark Mode";
});
