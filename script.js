'use strict';
//Light/Dark Mode
  const themeButton = document.querySelector('#theme-toggle');
  const body = document.body;
  const themeIcon = themeButton.querySelector('.theme-icon');

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.src = 'images/dark-mode.svg';
  } else {
    themeIcon.src = 'images/light-mode.svg';
  }

  themeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      themeIcon.src = 'images/dark-mode.svg'; 
    } else {
      localStorage.setItem('theme', 'light');
      themeIcon.src = 'images/light-mode.svg'; 
    }
  });
//Smooth Scrolling
function smoothScroll() {
    const links = document.querySelectorAll('a:link'); 
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute("href"); 
            if (href === "#") {
                e.preventDefault(); 
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            } 
            else if (href.startsWith("#")) {
                e.preventDefault();
                const section = document.querySelector(href); 
                if (section) { 
                    section.scrollIntoView({
                        behavior: "smooth" 
                    });
                }
            }
        });
    });
}
smoothScroll();

// DOM Elements
const cartIcon = document.querySelector('.icon-cart');
const cartTab = document.querySelector('.cartTab');
const closeBtn = document.querySelector('.close');
let listProductHtml = document.querySelector('.product-container');
let listCartHtml = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let closeCart = document.querySelector('.close-btn');
let listProducts = [];
let cart = [];

// Toggle cart visibility
// Function to toggle the cart visibility
function toggleCart() {
  cartTab.classList.toggle('visible');
  if (cartTab.classList.contains('visible')) {
    addCartToHtml();  
  }
}
// Event listeners to toggle the cart visibility
cartIcon.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
closeBtn.addEventListener('click', toggleCart);

// Close the cart when Escape key is pressed
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cartTab.classList.remove('visible');
  }
});
// Add product data to the HTML`
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

const addtoCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
  
  if (positionThisProductInCart < 0) {
    cart.push({ product_id: product_id, quantity: 1 });
  } else {
    cart[positionThisProductInCart].quantity++;
  }
  addCartToHtml();
  addCartToMemory();
}
const addCartToHtml = () => {
  let totalQuantity = 0;
  let totalPrice = 0; 
  listCartHtml.innerHTML = ''; 
  if (cart.length > 0) {
    cart.forEach(item => {
      totalQuantity += item.quantity;
      let positionProduct = listProducts.findIndex((value) => value.id == item.product_id);
      let info = listProducts[positionProduct];
      let itemTotalPrice = (info.price * item.quantity).toFixed(2);
      totalPrice += parseFloat(itemTotalPrice);  
      let newItem = document.createElement('div');
      newItem.classList.add('item');
      newItem.dataset.id = item.product_id;

      newItem.innerHTML = `
        <div class="image">
          <img src="${info.image}" alt="${info.name}">
        </div>
        <div class="name">${info.name}</div>
        <div class="totalPrice">$${itemTotalPrice}</div>
        <div class="quantity">
          <span class="minus"><</span>
          <span>${item.quantity}</span>
          <span class="plus">></span>
        </div>
      `;
      listCartHtml.appendChild(newItem);
    });
  } else {
    listCartHtml.innerHTML = "<p>Your cart is empty.</p>";
    listCartHtml.style.textAlign = "center";
    listCartHtml.style.marginTop = '2.4rem';
    listCartHtml.style.marginBottom = '2.4rem';
    listCartHtml.style.fontSize = '1.6rem';
  }

  iconCartSpan.innerText = totalQuantity;

  const cartTotalPriceElement = document.querySelector('.cart-total-price');
  if (cartTotalPriceElement) {
    cartTotalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
  } else {

    const newTotalPriceElement = document.createElement('div');
    newTotalPriceElement.classList.add('cart-total-price');
    newTotalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
    cartTab.appendChild(newTotalPriceElement);
  }
}

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
}

listCartHtml.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    let product_id = positionClick.closest('.item').dataset.id;
    let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
    changeQuantityCart(product_id, type);
  }
});

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

  addCartToHtml();
  addCartToMemory();
}
const initApplication = () => {
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
      addCartToHtml();  
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

initApplication();
//Reset Basket
const resetBasket = () => {
  cart.length = 0;
  localStorage.setItem('cart', '[]');
  addCartToHtml();
  iconCartSpan.innerText = '0';
  cartTab.classList.remove('visible');
  initApplication();
}

//CheckOut Window
const closePayment = document.querySelector('.close-payment');
const checkOut = document.querySelector('.check-out');
const paymentForm = document.getElementById('payment-form');
const confirmPayment = document.querySelector('.pay-conformation');
const closeForm = document.querySelector('.close-form');
//Close Basket 

//Open Checkout
checkOut.addEventListener('click', () => {
  if (cart.length > 0) {
    paymentForm.style.display = "block";     
  } else {
    alert('Your Basket is Empty');
  }
});

const cardOwnerInput = document.getElementById('card-owner');
const cardNumberInput = document.getElementById('card-number');
const cardDateInput = document.getElementById('expiry-date');
const cvcCodeInput = document.getElementById('security-code');
const payBtn = document.querySelector('.pay-button');
const today = new Date().toISOString().split('T')[0];
cardDateInput.setAttribute('min', today);
// Validate Inputs
const validateCardOwner = (cardOwner) => /^(?=.*[A-Za-z]{3})[A-Za-z][A-Za-z '-]*[A-Za-z]$/.test(cardOwner);
const validateCardNumber = (cardNumber) => /^\d{16}$/.test(cardNumber); // Only 16 digits
const validateCvc = (cvc) => /^\d{3}$/.test(cvc); // Exactly 3 digits
const validateExpiryDate = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const [year, month, day] = expiryDate.split('-');
  const expiryDateObj = new Date(year, month - 1, day); 
  
  return expiryDateObj >= today; 
};
// Form Validation
const formValidation = () => {
  const cardOwner = cardOwnerInput.value.trim();
  const cardNumber = cardNumberInput.value.trim();
  const cvcCode = cvcCodeInput.value.trim();
  const expiryDate = cardDateInput.value.trim();

  // Card Owner Validation
  if (!validateCardOwner(cardOwner)) {
    alert('Please enter a valid cardholder name.');
    cardOwnerInput.focus();
    return false;
  }
  // Card Number Validation (exactly 16 digits)
  if (!validateCardNumber(cardNumber)) {
    alert('Card number must be exactly 16 digits.');
    cardNumberInput.focus();
    return false;
  }
  // CVC Validation (exactly 3 digits)
  if (!validateCvc(cvcCode)) {
    alert('Security code (CVC) must be exactly 3 digits.');
    cvcCodeInput.focus();
    return false;
  }
 if (!validateExpiryDate(expiryDate)) {
    alert('Expiry date must be today or in the future.');
    cardDateInput.focus(); 
    return false; 
  }
  return true;
}
  // Limit card numbers
  cardNumberInput.addEventListener('input', (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    event.target.value = value;
    //Limit CVC Numbers
    cvcCodeInput.addEventListener('input', (event) => {
      let value = event.target.value;
      value = value.replace(/\D/g, '');
      if (value.length > 3) {
        value = value.slice(0, 3);
      }
      event.target.value = value;
    });
  });
  //Close Payment Form
  closeForm.addEventListener('click', () => {
    paymentForm.style.display = 'none';
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      paymentForm.style.display = "none";
    }
  });
  //Payment Confirmation
  payBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (formValidation()) {
      paymentForm.style.display = 'none';
      confirmPayment.style.display = 'block';
      confirmPayment.style.color = '#ffff';
      setTimeout(() => {
        confirmPayment.style.display = 'none';
      }, 3000);
    }
    resetBasket();
  });
  closePayment.addEventListener('click', () => {
    confirmPayment.style.display = 'none';
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      confirmPayment.style.display = "none";
    }
  });