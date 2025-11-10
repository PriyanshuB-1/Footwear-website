document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
      });
    });
  
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
  
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        productCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
      image.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.innerHTML = `<img src="${image.src}" alt="${image.alt}"><span class="close-lightbox">×</span>`;
        document.body.appendChild(overlay);
        overlay.querySelector('.close-lightbox').addEventListener('click', () => {
          overlay.remove();
        });
      });
    });

    // Cart functionality
    const cartCountElem = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartCountElem) {
        cartCountElem.textContent = totalCount;
      }
    }

    function addToCart(name, price) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = cart.findIndex(item => item.name === name);
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert(`${name} added to cart.`);
    }

    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        addToCart(name, price);
      });
    });

    updateCartCount();
  });
  
  function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const formMessage = document.getElementById('form-message');
  
    if (name && email && message) {
      formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
      formMessage.style.color = '#d4af37';
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      formMessage.textContent = 'Please fill in all fields.';
      formMessage.style.color = '#ff0000';
    }
  }

  // Cart page script
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('cart.html')) {
      const cartItemsContainer = document.getElementById('cart-items');
      const cartTotalContainer = document.getElementById('cart-total-container');
      const cartTotalElem = document.getElementById('cart-total');
      const checkoutSection = document.querySelector('.checkout-section');
      const checkoutForm = document.getElementById('checkout-form');
      const orderMessage = document.getElementById('order-message');

      function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
          cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
          cartTotalContainer.style.display = 'none';
          checkoutSection.style.display = 'none';
          return;
        }
        cartTotalContainer.style.display = 'block';
        checkoutSection.style.display = 'block';

        let total = 0;
        cart.forEach((item, index) => {
          total += item.price * item.quantity;
          const itemElem = document.createElement('div');
          itemElem.className = 'cart-item';
          itemElem.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-quantity">Quantity: ${item.quantity}</span>
            <span class="cart-item-price">Price: $${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn remove-item" data-index="${index}">Remove</button>
          `;
          cartItemsContainer.appendChild(itemElem);
        });
        cartTotalElem.textContent = total.toFixed(2);

        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
          button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            removeItem(index);
          });
        });
      }

      function removeItem(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }

      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simple checkout simulation
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
        orderMessage.textContent = 'Thank you for your order! We will process it soon.';
        checkoutForm.reset();
      });

      renderCart();
    }
  });
