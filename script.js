'use strict';
// DOM Elements
const cartIcon = document.querySelector('.icon-cart');
const cartTab = document.querySelector('.cartTab');
const closeBtn = document.querySelector('.close');
let listProductHtml = document.querySelector('.product-container');
let listCartHtml = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let cart = [];

// Toggle cart visibility
cartIcon.addEventListener('click', () => {
  cartTab.classList.toggle('visible');
});

closeBtn.addEventListener('click', () => {
  cartTab.classList.toggle('visible');
});

// Add product data to the HTML
const addDataHtml = () => {
  if (listProducts.length > 0) {
    listProducts.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.dataset.id = product.id;
      let formattedPrice = product.price.toFixed(2).replace('.', ':'); 

      newProduct.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <div class="price">$${formattedPrice}</div>
        <div class="add-Cart">Add to Cart</div>
      `;
      listProductHtml.appendChild(newProduct);
    });
  }
};

// Event listener to add products to the cart
listProductHtml.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('add-Cart')) {
    let product_id = positionClick.parentElement.dataset.id;
    addtoCart(product_id);
  }
});

// Function to add product to the cart
const addtoCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
  
  if (positionThisProductInCart < 0) {
    // Product not in cart, add it with quantity 1
    cart.push({ product_id: product_id, quantity: 1 });
  } else {
    // Product is in cart, increment its quantity
    cart[positionThisProductInCart].quantity++;
  }
  
  // Render cart and update local storage
  addCartToHtml();
  addCartToMemory();
}

// Function to render the cart to HTML
const addCartToHtml = () => {
  listCartHtml.innerHTML = '';  // Clear current cart HTML
  let totalQuantity = 0;
  
  if (cart.length > 0) {
    cart.forEach(item => {
      totalQuantity += item.quantity;
      let newItem = document.createElement('div');
      newItem.classList.add('item');
      newItem.dataset.id = item.product_id;

      // Find product info in the list
      let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
      let info = listProducts[positionProduct];

      newItem.innerHTML = `
        <div class="image">
          <img src="${info.image}" alt="${info.name}">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">$${(info.price * item.quantity).toFixed(2)}</div>
        <div class="quantity">
          <span class="minus"><</span>
          <span>${item.quantity}</span>
          <span class="plus">></span>
        </div>
      `;
      listCartHtml.appendChild(newItem);
    });
  } else {
    // Cart is empty
    listCartHtml.innerHTML = "<p>Your cart is empty.</p>";
    listCartHtml.style.textAlign = "center";
    listCartHtml.style.marginTop = '2.4rem';
    listCartHtml.style.fontSize = '1.6rem';
  }

  // Update cart icon quantity
  iconCartSpan.innerText = totalQuantity;
}

// Function to save the cart to local storage
const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener to change the quantity of products in the cart
listCartHtml.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    let product_id = positionClick.closest('.item').dataset.id;
    let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
    changeQuantityCart(product_id, type);
  }
});

// Function to update product quantity in the cart
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

  if (positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        cart[positionItemInCart].quantity++;
        break;
      case 'minus':
        if (cart[positionItemInCart].quantity > 1) {
          cart[positionItemInCart].quantity--;
        } else {
          cart.splice(positionItemInCart, 1); 
        }
        break;
    }
  }

  // Update cart display and localStorage
  addCartToHtml();
  addCartToMemory();
}

// Initialize the application and fetch product data
const initApplication = () => {
  // Load cart from localStorage on page load
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  // Fetch products and render the page
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      listProducts = data;
      addDataHtml();
      addCartToHtml();  // Render the cart after products are loaded
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

// Start the application
initApplication();
