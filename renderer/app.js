const {ipcRenderer} = require('electron')
const items = require('./items')

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search')

// open modal from menu
ipcRenderer.on('menu-show-modal', () => {
  showModal.click()
})

//open selected item from menu
ipcRenderer.on('menu-open-item', () => {
  items.open()
})

//delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
  let selectedItem = items.getSelectedItem()
  items.delete(selectedItem.index)
})

//open item in native browser from menu
ipcRenderer.on('menu-open-item-native', () => {
  items.openNative()
})

// focus the search input from the manu
ipcRenderer.on('menu-focus-search', () => {
  search.focus()
})


search.addEventListener('keyup', e => {

  Array.from( document.getElementsByClassName('read-item') ).forEach( item => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value)
    item.style.display = hasMatch ? 'flex' : 'none'
  })
})

// Navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key)
  }
})

// Disable & Enable modal buttons
const toggleModalButtons = () => {

  // Check state of buttons
  if (addItem.disabled === true) {
    addItem.disabled = false
    addItem.style.opacity = 1
    addItem.innerText = 'Add Item'
    closeModal.style.display = 'inline'
  } else {
    addItem.disabled = true
    addItem.style.opacity = 0.5
    addItem.innerText = 'Adding...'
    closeModal.style.display = 'none'
  }
}

// Show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex'
  itemUrl.focus()
})

// Hide modal
closeModal.addEventListener('click', e => {
  modal.style.display = 'none'
})

// Handle new item
addItem.addEventListener('click', e => {
  // Check a url exists
  if (itemUrl.value) {
    // Send new item url to main process
    ipcRenderer.send('new-item', itemUrl.value)
    toggleModalButtons()
  }
})

// Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  items.addItem(newItem, true)
  toggleModalButtons()
  modal.style.display = 'none'
  itemUrl.value = ''
})

// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
  if( e.key === 'Enter' ) addItem.click()
})
