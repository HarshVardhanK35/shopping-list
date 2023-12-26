// Declare Global Scope Variables
//---------------------------------------------------------------------------------------------------------------------------------------
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearAllBtn = document.getElementById('clear-all');
const filterBox = document.getElementById('filter');
let isEditMode = false;
const formBtn = itemForm.querySelector('.btn')

// Functions
//---------------------------------------------------------------------------------------------------------------------------------------
const displayItems = () => {

  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => {
    addItemOnDOM(item)
  })

  // Check the UI globally
  checkUI();
}

// Adding new items on submitting the form
//---------------------------------------------------------------------------------------------------------------------------------------
const addItemOnSubmit = (e) => {

  e.preventDefault();

  // Get Input Value
  const newItem = itemInput.value;

  // Validation
  if(newItem === ''){
    alert('Enter a valid item');
    return
  };

  // Check for edit-mode
  /*
    as we can not update the item in localStorage
    so, we delete the element that is already present and
    set the newly updated item into localStorage
  */
  if(isEditMode){
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);

    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }
  else{
    if(checkIfItemExists(newItem)){
      alert('That item already exists!!!');
      return
    }
  }

  // create and add items on DOM object
  addItemOnDOM(newItem);

  // Add item to localStorage
  addItemOnStorage(newItem);

  // Check the UI globally
  checkUI();

  itemInput.value = ''


}

// Add item on DOM
//---------------------------------------------------------------------------------------------------------------------------------------
const addItemOnDOM = (item) => {

  // Create List Item
  const listItem = document.createElement('li');
  listItem.appendChild(document.createTextNode(item));

  const button = createBtn('remove-item btn-link text-red');
  listItem.appendChild(button);

  // Adding an Item
  itemList.appendChild(listItem);
}

// Create Button
//---------------------------------------------------------------------------------------------------------------------------------------
const createBtn = (classes) => {

  const btn = document.createElement('button');
  btn.className = classes;
  btn.appendChild(createIcon('fa-solid fa-xmark'));
  return btn;

};

// Create Icon
//---------------------------------------------------------------------------------------------------------------------------------------
const createIcon = (classes) => {

  const icon = document.createElement('i');
  icon.className = classes;
  return icon;

}

// Add items on storage
//---------------------------------------------------------------------------------------------------------------------------------------
const addItemOnStorage = (item) => {

  // used DRY here
  //---------------------------------------------------------------------------------------------------------------------------------------
  const itemsFromStorage = getItemsFromStorage(); // Represent items that are present on local storage

  // This code has repeated in 'getItemsFromStorage()' function...

  // if(localStorage.getItem('items') === null){ // Using KEY-Items -> fetching data from localStorage and checking if it is empty.
  //   itemsFromStorage = []; // if there are no items on localsStorage -> Set itemsFromStorage to an empty array
  // }
  // else{
  //   itemsFromStorage = JSON.parse(localStorage.getItem('items')); // we parsed localStorage.getItem('items') which returns a string of array
  // }

  // Taking the items that's been passed into the 'addItemOnStorage' function and adding it to the 'itemsFromStorage' array
  itemsFromStorage.push(item);
  // Now convert 'itemsFromStorage' to string and put it into the localStorage.
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

// Retrieve items from storage
//---------------------------------------------------------------------------------------------------------------------------------------
const getItemsFromStorage = (item) => {

  let itemsFromStorage; // Represent items that are present on local storage

  if(localStorage.getItem('items') === null){ // Using KEY-Items -> fetching data from localStorage and checking if it is empty.
    itemsFromStorage = []; // if there are no items on localsStorage -> Set itemsFromStorage to an empty array
  }
  else{
    itemsFromStorage = JSON.parse(localStorage.getItem('items')); // we parsed localStorage.getItem('items') which returns a string of array
  }

  return itemsFromStorage;
}

// Prevent duplicate items
const checkIfItemExists=(item)=>{
  const itemsFromStorage = getItemsFromStorage();

  // if(itemsFromStorage.includes(item)){
  //   return true
  // }
  // else{
  //   return false
  // }
  // ---------------------- or ----------------------
  return itemsFromStorage.includes(item);
}

// onClickItem -> to edit the item, remove it from both UI and storage
//---------------------------------------------------------------------------------------------------------------------------------------
const onClickItem = (e) => {

  // Event Delegation --- where we put the actual event on the item list which is UL.
  // Here we are targeting the "X" mark which is the Icon element
  if(e.target.parentElement.classList.contains('remove-item')){
    removeItem(e.target.parentElement.parentElement);
  }
  else{
    setItemToEdit(e.target)
  }
}

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((elem)=>{elem.classList.remove('edit-mode')})

  item.classList.add('edit-mode')

  formBtn.innerHTML = '<i class="fa-solid fa-wrench"></i> Update Item';
  formBtn.style.backgroundColor = '#00fd0e'
  itemInput.value = item.textContent
}

// Remove an item from both DOM and Storage.
//---------------------------------------------------------------------------------------------------------------------------------------
const removeItem = (item) => {

  // Remove from DOM
  if(confirm(`Are you sure?`)){
    item.remove();
  }

  // Remove from storage
  removeItemFromStorage(item.textContent);

  // Every time we have to run the checkUI --- after removing an item
  checkUI()
}

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out the item to be removed
  itemsFromStorage = itemsFromStorage.filter((elem)=>{
    if(elem !== item){
      return(elem)
    }
  })

  // Re-set the localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}


// Clear All Items.
//---------------------------------------------------------------------------------------------------------------------------------------
const clearItems = () => {

  // 1st - Method --- The simplest way:
  if(confirm('Are you sure, you want to clear all items?')){

    itemList.innerText = '' // --------------------Cleared all items--------------------

    // Clear all items from localStorage
    localStorage.clear('items')
  }

  // 2nd-Method:
  // while(itemList.firstChild){
  //   itemList.removeChild(itemList.firstChild)
  // }

  // We also run checkUI when we clear all items
  checkUI();
}

// Filter Items:
//---------------------------------------------------------------------------------------------------------------------------------------
const filterItems = (e) => {

  const arrListItems = itemList.querySelectorAll('li'); // returns Node-list
  const inpTxt = e.target.value.toLowerCase(); // Filter Box Text
  arrListItems.forEach((item) => {

    const itemName = item.innerText.toLowerCase();

    if(itemName.includes(inpTxt) === true){
      console.log(item)
      item.style.display = 'flex'; // HOW FLEX? --> go to... console -> elements tab -> hover on list -> we get display as = 'flex'
    }
    else{
      item.style.display = 'none';
    };
  })
}


// Clear UI state --- Do not show the FILTER ITEMS BOX and CLEAR ALL BUTTON on UI, If there are no Shopping items
//---------------------------------------------------------------------------------------------------------------------------------------
function checkUI(){

  itemInput.value = ''

  const items = itemList.querySelectorAll('li'); // gets all the list items

  if(items.length === 0){
    // Removing the clear all button and filter box
    clearAllBtn.style.display = 'none';
    filterBox.style.display = 'none';
  }
  else{
    clearAllBtn.style.display = 'block';
    filterBox.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#ffa580';
  isEditMode = false;


}

// Event Listeners
// Just one 'init()' on global scope instead of having all event listeners on the global scope
//---------------------------------------------------------------------------------------------------------------------------------------

const init = () => {

  itemForm.addEventListener('submit', addItemOnSubmit); //--- Add an item
  // -> "onClickItem" not only focuses on 'X' button but also when we click anywhere on the list item the item goes into the input box to get updated.
  itemList.addEventListener('click', onClickItem);
  clearAllBtn.addEventListener('click', clearItems); //--- Clear all item
  filterBox.addEventListener('input', filterItems); // Filter items
  document.addEventListener('DOMContentLoaded', displayItems); // Display the storage items after document loading
  // When the page loads it runs the checkUI function
  checkUI() // --- Global Scope

}
init();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ NOTE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This checkUI runs every time the page loads and not whenever we add an item into the List.
So check addItem function.

Every time we add an item we have to do it on ourselves --- in Vanilla JS (It is not gonna do it on its own)

But in Frameworks like React, has it's mechanisms where things happen automatically in DOM or Virtual DOM.
So, in Vanilla JS we have to do every thing on our own.
*/