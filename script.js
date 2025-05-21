// Responsive menu
const bar = document.getElementById('bar')
const close = document.getElementById('close')
const nav = document.getElementById('navbar')

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active')
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active')
    })
}

// Script detail product
var MainImg = document.getElementById('MainImg')
var smallimg = document.getElementsByClassName('small-img')

if (MainImg && smallimg.length > 0) {
    smallimg[0].onclick = function(){
        MainImg.src = smallimg[0].src
    }
    smallimg[1].onclick = function(){
        MainImg.src = smallimg[1].src
    }
    smallimg[2].onclick = function(){
        MainImg.src = smallimg[2].src
    }
    smallimg[3].onclick = function(){
        MainImg.src = smallimg[3].src
    }
}

// SHOPPING CART FUNCTIONALITY
// Array to store cart items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Format price display
function formatPrice(price) {
    return parseInt(price).toLocaleString('vi-VN') + '₫';
}

// Parse price from formatted string
function parsePrice(priceString) {
    return parseInt(priceString.replace(/\D/g, ''));
}

// Add item to cart
function addToCart(productImage, brand, name, price) {
    // Check if the product is already in the cart
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Product already exists, increase quantity
        cart[existingItemIndex].quantity += 1;
        cart[existingItemIndex].total = cart[existingItemIndex].quantity * cart[existingItemIndex].price;
    } else {
        // Product doesn't exist, add new item
        const newItem = {
            image: productImage,
            brand: brand,
            name: name,
            price: parsePrice(price),
            quantity: 1,
            total: parsePrice(price),
        };
        cart.push(newItem);
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Show confirmation
    alert('Đã thêm sản phẩm vào giỏ hàng!');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart quantity display in navbar (optional feature)
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.innerText = itemCount;
    }
}

// Display cart items on cart page
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartSection = document.getElementById('empty-cart');
    const cartSection = document.getElementById('cart');
    const cartAddSection = document.getElementById('cart-add');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        // Show empty cart message
        if (emptyCartSection) emptyCartSection.style.display = 'block';
        if (cartSection) cartSection.style.display = 'none';
        if (cartAddSection) cartAddSection.style.display = 'none';
        return;
    }
    
    // Hide empty cart message, show cart sections
    if (emptyCartSection) emptyCartSection.style.display = 'none';
    if (cartSection) cartSection.style.display = 'block';
    if (cartAddSection) cartAddSection.style.display = 'flex';
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    // Add each item to the cart table
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="remove-item" data-index="${index}"><i class="fa-regular fa-circle-xmark"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <div class="quantity-control">
                    <button class="decrease-qty" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="item-qty" data-index="${index}">
                    <button class="increase-qty" data-index="${index}">+</button>
                </div>
            </td>
            <td>${formatPrice(item.total)}</td>
        `;
        cartItemsContainer.appendChild(row);
    });
    
    // Add event listeners to newly created elements
    attachCartEvents();
    
    // Update cart totals
    updateCartTotals();
}

// Attach events to cart elements
function attachCartEvents() {
    // Remove item buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(button.getAttribute('data-index'));
            removeItem(index);
        });
    });
    
    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll('.decrease-qty');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            decreaseQuantity(index);
        });
    });
    
    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll('.increase-qty');
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            increaseQuantity(index);
        });
    });
    
    // Quantity input fields
    const qtyInputs = document.querySelectorAll('.item-qty');
    qtyInputs.forEach(input => {
        input.addEventListener('change', () => {
            const index = parseInt(input.getAttribute('data-index'));
            const newQty = parseInt(input.value);
            updateQuantity(index, newQty);
        });
    });
}

// Remove item from cart
function removeItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        displayCart();
    }
}

// Decrease item quantity
function decreaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            cart[index].total = cart[index].quantity * cart[index].price;
            saveCart();
            displayCart();
        } else {
            removeItem(index);
        }
    }
}

// Increase item quantity
function increaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += 1;
        cart[index].total = cart[index].quantity * cart[index].price;
        saveCart();
        displayCart();
    }
}

// Update item quantity
function updateQuantity(index, newQty) {
    if (index >= 0 && index < cart.length && newQty > 0) {
        cart[index].quantity = newQty;
        cart[index].total = cart[index].quantity * cart[index].price;
        saveCart();
        displayCart();
    } else if (newQty <= 0) {
        removeItem(index);
    }
}

// Update cart totals
function updateCartTotals() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    
    if (!subtotalElement || !totalElement) return;
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + item.total, 0);
    
    // Update display
    subtotalElement.innerText = formatPrice(subtotal);
    totalElement.innerText = formatPrice(subtotal); // No shipping cost, so total equals subtotal
}

// Add to cart event listeners for all product pages
function setupAddToCartButtons() {
    // For product list pages
    const addToCartButtons = document.querySelectorAll('.pro .cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.pro');
            const productImage = productCard.querySelector('img').src;
            const productBrand = productCard.querySelector('.des span').innerText;
            const productName = productCard.querySelector('.des h5').innerText;
            const productPrice = productCard.querySelector('.des h4').innerText;
            
            addToCart(productImage, productBrand, productName, productPrice);
        });
    });
    
    // For product detail page
    const addToCartDetailBtn = document.querySelector('#prodetails button.normal');
    if (addToCartDetailBtn) {
        addToCartDetailBtn.addEventListener('click', () => {
            const productImage = document.getElementById('MainImg').src;
            const productBrand = document.querySelector('.single-pro-details h6').innerText.split('/')[1].trim();
            const productName = document.querySelector('.single-pro-details h4').innerText;
            const productPrice = document.querySelector('.single-pro-details h2').innerText;
            const selectedSwitch = document.querySelector('.single-pro-details select').value;
            const quantity = parseInt(document.querySelector('.single-pro-details input[type="number"]').value);
            
            // Check if switch is selected
            if (selectedSwitch === 'Lựa chọn Switch') {
                alert('Vui lòng chọn loại Switch!');
                return;
            }
            
            // Add to cart multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                addToCart(productImage, productBrand, `${productName} - ${selectedSwitch}`, productPrice);
            }
        });
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    // Setup Add to Cart buttons
    setupAddToCartButtons();
    
    // Display cart if on cart page
    displayCart();
    
    // Update cart count display
    updateCartCount();
});