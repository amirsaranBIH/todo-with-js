// Data Contoller
var dataContoller = (function() {

const fontAwesomeIcons = 'https://gist.githubusercontent.com/james2doyle/3d7ad018e6b6abed7957/raw/96dc7abc78826618e6ad291f4f042fc5afc50980/fa-icons.json';

var icons;
fetch(fontAwesomeIcons)
  .then(blob => blob.json())
  .then(data => icons = data);


// Item constructor function
function Item(todo, category, place, icon) {
  this.todo = todo;
  this.category = category;
  this.place = place;
  this.time = getFormatedTime();
  this.icon = icon;
}

const items = [];
const completed = [];

function getFormatedTime() {
  var formatedHours;

  var time = new Date();
  var hours = time.getHours();

  if (hours <= 12) {
    formatedHours = `${hours}am`;
  } else {
    formatedHours = `${hours}pm`;
  }
  return formatedHours;
}

return {
  // Creates an item and adds to items array
  createItem(data) {
    var newItem = new Item(data.todo, data.category, data.place, data.icon);
    items.push(newItem);
  },
  // Get items array
  getItems() {
    return items;
  },
  // Get completed array
  getCompletedItems() {
    return completed;
  },
  // Split personal and
  splitCategories(data) {
    var personalCounter = [];
    var businessCounter = [];
    data.forEach(item => {
      if (item.category === 'personal') {
        personalCounter.push(item);
      } else {
        businessCounter.push(item);
      }
    });
    return {
      personalCounter: personalCounter.length,
      businessCounter: businessCounter.length,
      all: personalCounter.length + businessCounter.length
    }
  },
  // Calculating the percent of done todos
  calculatePercentDone() {
    if(!completed.length && !items.length) return 'todo empty';
    var percent = (completed.length / (completed.length + items.length)) * 100;
    if (String(percent).includes('.')) {
      percent = percent.toFixed(0);
    }
    return `${percent}% done`;
  },
  // Add to completed
  addToCompleted(index) {
    completed.push(items[index]);
  },
  // Remove item from items list
  removeItem(index, array) {
    array.splice(index, 1);
  }
}

}());


// UI Contoller
var UIContoller = (function() {

  // All DOM elements
  const DOM = {
    todo: '#todo',
    menuIcon: '#menu-icon',
    addModal: '#add-modal',
    goBack: '#back-todo',
    addTODO: '#add-todo',
    userModal: '#user-modal',
    exitBtn: '#exit',
    createBtn: '#create-todo-btn',
    todoList: '#todo-list',
    input: {
      todo: '#todo-input',
      category: '#category-input',
      place: '#place-input'
    },
    counter: {
      personal: '.personal-counter',
      business: '.business-counter',
      all: '#counter-all',
      completed: '#completed-counter'
    },
    completedList: '#completed-list',
    percentDone: '#percent-done'
  }

  return {
    // Selector function
    select(el, option) {
      var validEl = typeof el === 'string';

      if (validEl) {
        return option === 'all' ? document.querySelectorAll(el) : document.querySelector(el);
      }
    },
    // Adding event listener
    addEvent(el, fn, ev) {
      ev = ev || 'click';
      el.addEventListener(ev, fn);
    },
    // All DOM elements
    getDOM() {
      return DOM;
    },
    // Transition between modals
    fadeInOut(fadeIn, fadeOut) {
      $(fadeOut).fadeOut(200, function() {
        $(fadeIn).fadeIn();
      });
    },
    // Render all items to list
    renderItems(items, location, option) {
      var todoTemplate;
      location.innerHTML = '';
      items.forEach(item => {
        if (option === 'todo') {
          todoTemplate = `<div class="todo-item flex" title="Add item to completed"><div class="item-section"><i class="fa ${item.icon}" aria-hidden="true"></i></div><div class="item-section"><h2 class="item-text">${item.todo}</h2><p class="item-location">${item.place}</p></div><div class="item-section"><span class="item-created">${item.time}</span><div><i class="fa fa-times delete-item-btn" aria-hidden="true" title="Delete this item"></i></div></div></div>`;
        } else if (option === 'completed') {
          todoTemplate = `<div class="completed-item flex"><div class="item-section"><i class="fa fa-check" aria-hidden="true"></i></div><div class="item-section flex"><p>${item.todo}</p></div></div>`;
        }

        location.insertAdjacentHTML('beforeend', todoTemplate);
      });
    },
    // Update counters
    updateCounter(data, personal, business, all) {
      personal.forEach(item => {
        item.innerText = data.personalCounter;
      });
      business.forEach(item => {
        item.innerText = data.businessCounter;
      });
      all.innerText = data.all;
    },
    // Update completed counter
    updateCompletedCounter(data, completed) {
      completed.innerText = data;
    },
    // Update percent done
    updatePercent(el, percent) {
      el.innerText = percent;
    }
  }

}());


// Controller
var contoller = (function(dataCtrl, UICtrl) {

var select = UICtrl.select;
var DOM = UICtrl.getDOM();
var addEvent = UICtrl.addEvent;
var fadeInOut = UICtrl.fadeInOut;

function setUpEvents() {
  // Fade in user modal, fade out main todo
  addEvent(select(DOM.menuIcon), function() {
    fadeInOut(select(DOM.userModal), select(DOM.todo));
  });

  // Fade in main todo, fade out user modal
  addEvent(select(DOM.exitBtn), function() {
    fadeInOut(select(DOM.todo), select(DOM.userModal));
  });

  // Fade in add modal, fade out main todo
  addEvent(select(DOM.addTODO), function() {
    fadeInOut(select(DOM.addModal), select(DOM.todo));
  });

  // Fade in main todo, fade out add modal
  addEvent(select(DOM.goBack), function() {
    fadeInOut(select(DOM.todo), select(DOM.addModal));
  });

  // Form button to make a new item
  addEvent(select(DOM.createBtn), function(e) {
    e.preventDefault();
    var newItem = {
      todo: select(DOM.input.todo).value,
      category: select(DOM.input.category).value,
      place: select(DOM.input.place).value,
      icon: 'fa-paint-brush'
    };
    dataCtrl.createItem(newItem);
    UICtrl.renderItems(dataCtrl.getItems(), select(DOM.todoList), 'todo');
    UICtrl.updateCounter(dataCtrl.splitCategories(dataCtrl.getItems()), select(DOM.counter.personal, 'all'), select(DOM.counter.business, 'all'), select(DOM.counter.all));
    fadeInOut(select(DOM.todo), select(DOM.addModal));
    UICtrl.updatePercent(select(DOM.percentDone), dataCtrl.calculatePercentDone());
  });

  // Add item to completed
  $(select(DOM.todoList)).on('click', '.todo-item', function() {
    var index = Array.prototype.indexOf.call(this.parentNode.childNodes, this);
    dataCtrl.addToCompleted(index);
    UICtrl.renderItems(dataCtrl.getCompletedItems(), select(DOM.completedList), 'completed');
    dataCtrl.removeItem(index, dataCtrl.getItems());
    UICtrl.renderItems(dataCtrl.getItems(), select(DOM.todoList), 'todo');
    UICtrl.updateCounter(dataCtrl.splitCategories(dataCtrl.getItems()), select(DOM.counter.personal, 'all'), select(DOM.counter.business, 'all'), select(DOM.counter.all));
    UICtrl.updateCompletedCounter(dataCtrl.getCompletedItems().length, select(DOM.counter.completed));
    UICtrl.updatePercent(select(DOM.percentDone), dataCtrl.calculatePercentDone());
  });

  // Delete item
  $(select(DOM.todoList)).on('click', '.delete-item-btn', function(e) {
    var selectedItem = this.parentElement.parentElement.parentElement;
    var index = Array.prototype.indexOf.call(selectedItem.parentNode.childNodes, selectedItem);
    dataCtrl.removeItem(index, dataCtrl.getItems());
    UICtrl.renderItems(dataCtrl.getItems(), select(DOM.todoList), 'todo');
    // Stops the todo-item event from invoking
    e.stopPropagation();
    UICtrl.updateCounter(dataCtrl.splitCategories(dataCtrl.getItems()), select(DOM.counter.personal, 'all'), select(DOM.counter.business, 'all'), select(DOM.counter.all));
    UICtrl.updatePercent(select(DOM.percentDone), dataCtrl.calculatePercentDone());
  });

  $(select(DOM.completedList)).on('click', '.completed-item', function() {
    var index = Array.prototype.indexOf.call(this.parentNode.childNodes, this);
    dataCtrl.removeItem(index, dataCtrl.getCompletedItems());
    UICtrl.renderItems(dataCtrl.getCompletedItems(), select(DOM.completedList), 'completed');
    UICtrl.updatePercent(select(DOM.percentDone), dataCtrl.calculatePercentDone());
    UICtrl.updateCompletedCounter(dataCtrl.getCompletedItems().length, select(DOM.counter.completed));
  });
}

return {
  init() {
    setUpEvents();
  }
}

}(dataContoller, UIContoller));

// Initializes the app
contoller.init();
