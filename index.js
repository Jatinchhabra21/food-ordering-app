import { menuArray } from "./data.js";
const menuContainer = document.getElementById("menu-container");
const totalPrice = document.getElementById("total-price");
const paymentModal = document.getElementById("payment-modal");
const paymentName = document.getElementById("payment-name");
const thankMessageContainer = document.getElementById("thank-message");
const cartContainer = document.getElementById("cart-container");
let sum = 0;

const menuItems = (item) => {
  return `
    <section class="menu-item">
        <p class="item-icon">${item.emoji}</p>
        <div class="item-details">
            <h4>${item.name}</h4>
            <p>${item.ingredients}</p>
            <h5>$${item.price}</h5>
        </div>
        <button class="add-button" data-item="${item.id}">+</button>
    </section>`;
};

function getMenu() {
  let menuHTML = "";
  menuArray.forEach(function (item) {
    menuHTML += menuItems(item);
  });
  return menuHTML;
}

function render() {
  const menuHTML = getMenu();
  menuContainer.innerHTML = menuHTML;
}

render();

document.addEventListener("click", function (event) {
  if (document.getElementById("item-" + event.target.dataset.item)) {
    updateItemInCart(event.target.dataset.item);
  } else if (event.target.dataset.item) {
    handleItemAdd(event.target.dataset.item);
  } else if (event.target.dataset.remove) {
    handleItemRemove(event.target.dataset.remove);
  } else if (event.target.id === "order") {
    displayPaymentModal();
  } else if (event.target.id === "pay-btn") {
    displayMessage(event);
  }
});

function handleItemAdd(itemId) {
  menuArray.forEach(function (item) {
    if (item.id == itemId) {
      item.count = 1;
      sum += item.price;
    }
  });
  renderCartSummary();
}

function renderCartSummary() {
  const cartSummary = document.getElementById("cart-summary");

  cartSummary.innerHTML = "";

  for (let item of menuArray) {
    if (item.count > 0) {
      cartSummary.innerHTML += `
      <div class="item">
        <span id="item-${item.id}">${item.name} &times ${item.count}</span>
        <button class="remove-btn" id="remove-btn" data-remove="${item.id}">
          remove
        </button>
        <div class="item-price">
          <p id="item-price-${item.id}">$${item.price * item.count}<p>
        </div>
      </div>`;
    }
  }
  if (menuArray.filter((item) => item.count > 0).length) {
    if (!cartContainer.classList.contains("display-block")) {
      cartContainer.classList.add("display-block");
    }
  } else {
    cartContainer.classList.remove("display-block");
  }

  totalPrice.textContent = "$" + sum;
}

function updateItemInCart(itemId) {
  const itemName = document.getElementById("item-" + itemId);
  const itemPrice = document.getElementById("item-price-" + itemId);
  menuArray.forEach(function (item) {
    if (item.id == itemId) {
      item.count++;
      itemName.textContent = item.name + " \u00d7 " + item.count;
      itemPrice.textContent = "$" + item.price * item.count;
      sum += item.price;
      totalPrice.textContent = "$" + sum;
    }
  });
}

function handleItemRemove(itemId) {
  const itemName = document.getElementById("item-" + itemId);
  const itemPrice = document.getElementById("item-price-" + itemId);
  menuArray.forEach(function (item) {
    if (item.id == itemId && item.count > 1) {
      item.count--;
      itemName.textContent = item.name + " \u00d7 " + item.count;
      itemPrice.textContent = "$" + item.price * item.count;
      sum -= item.price;
      totalPrice.textContent = "$" + sum;
    } else if (item.id == itemId && item.count == 1) {
      item.count--;
      sum -= item.price;
      renderCartSummary();
    }
  });
}

function displayPaymentModal() {
  paymentModal.style.display = "block";
}

function displayMessage(event) {
  event.preventDefault();
  const name = paymentName.value;
  cartContainer.classList.remove("display-block");
  paymentModal.style.display = "none";
  thankMessageContainer.style.display = "block";
  thankMessageContainer.textContent = `Thanks, ${name}! Your order is on its way!`;
  menuArray.forEach(function (item) {
    item.count = 0;
  });
}
