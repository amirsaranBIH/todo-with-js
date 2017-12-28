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
  createItem(data) {
    var newItem = new Item(data.todo, data.category, data.place, data.icon);
    items.push(newItem);
  },
  getItems() {
    return items;
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
      all: '#counter-all'
    }
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
    renderItems(items, location) {
      location.innerHTML = '';
      items.forEach(item => {
        var todoTemplate = `<div class="todo-item flex" title="Add item to completed"><div class="item-section"><i class="fa ${item.icon}" aria-hidden="true"></i></div><div class="item-section"><h2 class="item-text">${item.todo}</h2><p class="item-location">${item.place}</p></div><div class="item-section"><span class="item-created">${item.time}</span><div><i class="fa fa-times delete-item-btn" aria-hidden="true" title="Delete this item"></i></div></div></div>`;

        location.insertAdjacentHTML('beforeend', todoTemplate);
      });
    },
    // Update counters
    updateCounter(data, personal, business, all) {
      var personalCounter = 0;
      var businessCounter = 0;
      data.forEach(item => {
        if (item.category === 'personal') {
          personalCounter++;
        } else {
          businessCounter++;
        }
      });

      personal.forEach(item => {
        item.innerText = personalCounter;
      });
      business.forEach(item => {
        item.innerText = businessCounter;
      });
      all.innerText = personalCounter + businessCounter;
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
    UICtrl.renderItems(dataCtrl.getItems(), select(DOM.todoList));
    UICtrl.updateCounter(dataCtrl.getItems(), select(DOM.counter.personal, 'all'), select(DOM.counter.business, 'all'), select(DOM.counter.all));
    fadeInOut(select(DOM.todo), select(DOM.addModal));
  });

  // Add item to completed
  $(select(DOM.todoList)).on('click', '.todo-item', function() {
    var selectedItem = this;
  });

  // Delete item
  $(select(DOM.todoList)).on('click', '.delete-item-btn', function() {
    var selectedItem = this.parentElement.parentElement.parentElement;
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
