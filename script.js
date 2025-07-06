const itemForm = document.querySelector('#item-form');
const formInput = document.querySelector('.form-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(function (item) {
        addItemToDOM(item);
    });
    checkUI();
};

function onAddItemSubmit (e) {
    e.preventDefault();
    
    const newItem = formInput.value.trim();

    // Validate Input

    if (newItem === '') {
        alert('Please fill in all fields');
        return;
    } 
    
    if (!isEditMode && checkIfItemExists(newItem)) {
    alert('That item already exists!');
    return;
    }

    // Check if we are in edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }  

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemtoStorage(newItem);

    // Need to add checkUI to account for no list items
    checkUI();

    formInput.value = '';
};



function addItemToDOM(item) {
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
};

function createButton (classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
};

function createIcon (classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemtoStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem('item', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('item') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('item'));
    }

    return itemsFromStorage
};

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
};

// function checkIfItemExists(item) {
//     const itemsFromStorage = getItemsFromStorage();

//     // Longer version
//     // if (itemsFromStorage.includes(item)) {
//     //     return true;
//     // } else {
//     //     return false;
//     // }

//     // Shorter version
//     // return itemsFromStorage.includes(item);
//     return itemsFromStorage.includes(item);
// };

function checkIfItemExists(item) {
  const normalizedItem = item.trim().toLowerCase();

  // Check in localStorage
  const itemsFromStorage = getItemsFromStorage();
  const foundInStorage = itemsFromStorage.some (function (item) {
       return item.trim().toLowerCase() === normalizedItem
  });

  if (foundInStorage) return true;

  // Check in DOM (including preloaded <li>)
  const itemsInDOM = itemList.querySelectorAll('li');
  const foundInDOM = Array.from(itemsInDOM).some (function (li) {
        return li.firstChild.textContent.trim().toLowerCase() === normalizedItem
  });

  return foundInDOM;
}


function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(function (item) {
        item.classList.remove('edit-mode');
    })
    item.classList.add('edit-mode');
    formBtn.classList.add('edit-btn');
    // formBtn.style.backgroundColor = '#228B22';
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formInput.value = item.textContent.trim();
};

function removeItem (item) {
    if (confirm('Are you sure?')) {
        // Remove item from DOM
        item.remove();
        // Remove item from Storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
   
};

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter(function (i) {
       return i !== item;
    });

    // Re-set to localstorage
    localStorage.setItem('item', JSON.stringify(itemsFromStorage));

};

function clearItems() {
    // itemList.innerHTML = '';
    while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);

    // Clear from local storage
    localStorage.removeItem('item');

    // Need to add checkUI to account for no list items
    checkUI();
  }
};

function filterItems (e) {

    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach(function (item) {
        const itemName = item.textContent.toLowerCase();
        
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }

    });

};

function checkUI() {
    formInput.value = '';

    // items needs to be defined within function not global scope to reflect the live state of the DOM
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.classList.remove('edit-btn');

    isEditMode = false;
};

// Initialize app
function init() {
    // Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();
};

init();

// localStorage.removeItem('item');