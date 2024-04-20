const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const inputInvalid = document.getElementById("input-invalid");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("items-clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

//   ======== function for GET & SHOW items in localStorage ========

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}
//   =========== function for ADD ITEMS TO LIST =============

const additem = function (e) {
  e.preventDefault();
  const newItem = itemInput.value;

  //   === VALIDATE-INPUT ===
  if (newItem === "") {
    inputInvalid.textContent = "please add an item";
    return;
  } else {
    inputInvalid.textContent = " ";
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
    formBtn.innerHTML = '<i class="bi bi-plus"></i> Add Item';
    formBtn.classList.replace("btn-primary", "btn-dark");
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      inputInvalid.innerText = "That item already exists!";
      return;
    } else {
      inputInvalid.innerText = "";
    }
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  itemInput.value = "";

  checkUI();
};

//   =========== function for check items has exists =============

function checkIfItemExist(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

//   =========== function for CREATE ITEMS =============

function addItemToDOM(item) {
  //   === create <li> ===

  const li = document.createElement("li");
  li.className = "list-item";
  li.textContent = item;
  //   === create <i> ===

  const icon = createIcon("bi bi-x fs-5 text-danger");
  //   === append <i> to <li> ===

  li.appendChild(icon);

  itemList.appendChild(li);
}
//   ======== function for add to localStorage ========

function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//   ======== function for create icon =========
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;

  return icon;
}

//   ======== function for remove <li> ========

function onClickItem(e) {
  if (e.target.classList.contains("bi-x")) {
    removeItem(e.target.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

//   ======== function for onClickItem() =========

function removeItem(item) {
  item.remove();
  removeItemFromStorage(item.textContent);
  checkUI();
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  itemInput.value = item.textContent;
  formBtn.innerHTML = '<i class="bi bi-pencil-fill"></i> update Item';
  formBtn.classList.replace("btn-dark", "btn-primary");
}

//======== function for remove deleted<li> from storage ========

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//   ======== function for clear items(<ul>) ========

function clearItems() {
  itemList.innerHTML = "";
  checkUI();
  localStorage.removeItem("items");
}

//   ======== function for remove filterInput & clearAllbtn ========

function checkUI() {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
}
checkUI();

//   ======== function for filter input ========

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

//   ======== function for GET items in localStorage ========

function getItemFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

// === Event Listener ===
itemForm.addEventListener("submit", additem);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearItems);
itemFilter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems);
