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
cartIcon.addEventListener('click', () => {
  cartTab.classList.toggle('visible');
});

closeCart.addEventListener('click', () => {
  cartTab.classList.toggle('visible');
});

closeBtn.addEventListener('click', () => {
  cartTab.classList.toggle('visible');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cartTab.style.display = "none"; 
  }
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
  
  addCartToHtml();
  addCartToMemory();
}
let totalQuantity = 0;
let totalPrice = 0; 
const addCartToHtml = () => {
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

//CheckOut Window
const closePayment = document.querySelector('.close-payment');
const payCart = document.querySelector('.cart-pay');
const checkOut = document.querySelector('.check-out');
const payBtn = document.querySelector('.pay-button');
const confirmPayment = document.querySelector('.pay-confirmation');
const paymentForm = document.querySelector('.payment-form');
closePayment.addEventListener('click', () => {
  payCart.style.display = "none";
})
  document.addEventListener("DOMContentLoaded", () => {
    checkOut.addEventListener('click', () => {
      payCart.style.display = "block"; 
      cartTab.style.display = "none";
    });
      document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      payCart.style.display = "none";
        }
      })
  }); 
payBtn.addEventListener('click', () => {
  paymentForm.style.display = 'none';
  confirmPayment.style.display = 'block';
  payCart.style.background = "#347928";
  payCart.style.color = "#FCF8F6";
});