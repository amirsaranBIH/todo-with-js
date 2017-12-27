const fontAwesomeIcons = 'https://gist.githubusercontent.com/james2doyle/3d7ad018e6b6abed7957/raw/96dc7abc78826618e6ad291f4f042fc5afc50980/fa-icons.json';

// Data Contoller
var dataContoller = (function() {

  // Items of the todo list
  var items = {
    personal: [],
    business: []
  };


  return {
    // Puches item to 'items'
    createItem(todo, category, place, time, icon) {
      items[category].push({todo, place, time, icon});
    },
    // Returns the 'items' object
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
    barsIcon: '#menu-icon',
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
      time: '#time-input',
      place: '#place-input'
    },
    counter: {
      personal: '.personal-counter',
      business: '.business-counter',
      all: '#counter-all'
    }
  }

  return {
    // Easier selector function
    select(el) {
      var validEl = typeof el === 'string';
      if (validEl) {
        return el.startsWith('.') ? document.querySelectorAll(el) : document.querySelector(el);
      }
      console.error('Function select() doesn\'t have a valid argument');
    },
    // Returns the DOM elements
    getDOM() {
      return DOM;
    },
    // Fades in and out given elements
    fadeInOut(fadeIn, fadeOut) {
      $(fadeOut).fadeOut(100, function() {
        $(fadeIn).fadeIn();
      });
    },
    // Formats todo item template with given inputs
    formatTemplate(todo, place, time, icon) {
      var todoTemplate = `<div class="todo-item flex"><div class="item-section"><i class="fa ${icon}" aria-hidden="true"></i></div><div class="item-section"><h2 class="item-text">${todo}</h2><p class="item-location">${place}</p></div><div class="item-section"><span class="item-created">${time}</span></div></div>`;

      return todoTemplate;
    },
    // Renders the item on the page
    renderItem(item, list) {
      list.insertAdjacentHTML('beforeend', item);
    },
    // Updates the item counters
    updateCounter(data, personal, business, all) {
      personal.forEach(per => {
        per.innerText = data.personal.length;
      });
      business.forEach(bus => {
        bus.innerText = data.business.length;
      });
      all.innerText = data.personal.length + data.business.length;
    }

  }

}());

// Controller
var contoller = (function(dataCtrl, UICtrl) {

  var select = UICtrl.select;
  var DOM = UICtrl.getDOM();

  // Sets up events
  function setUpEvents() {
    select(DOM.barsIcon).addEventListener('click', function() {
      UICtrl.fadeInOut(DOM.userModal, DOM.todo);
    });

    select(DOM.goBack).addEventListener('click', function() {
      UICtrl.fadeInOut(DOM.todo, DOM.addModal);
    });

    select(DOM.addTODO).addEventListener('click', function() {
      UICtrl.fadeInOut(DOM.addModal, DOM.todo);
    });

    select(DOM.exitBtn).addEventListener('click', function() {
      UICtrl.fadeInOut(DOM.todo, DOM.userModal);
    });

    select(DOM.createBtn).addEventListener('click', function(e) {
      e.preventDefault();

      var todoInput = select(DOM.input.todo).value;
      var categoryInput = select(DOM.input.category).value;
      var placeInput = select(DOM.input.place).value;
      var timeInput = select(DOM.input.time).value;
      var formatedTemplate = UICtrl.formatTemplate(todoInput, placeInput, timeInput, 'fa-paint-brush');

      dataCtrl.createItem(todoInput, categoryInput, placeInput, timeInput, 'fa-paint-brush', formatedTemplate);

      UICtrl.renderItem(UICtrl.formatTemplate(todoInput, placeInput, timeInput, 'fa-paint-brush'), select(DOM.todoList));
      UICtrl.fadeInOut(DOM.todo, DOM.addModal);

      console.log(dataCtrl.getItems());
      UICtrl.updateCounter(dataCtrl.getItems(), select(DOM.counter.personal), select(DOM.counter.business), select(DOM.counter.all));
    });
  }

  return {
    // Initializes the app
    init() {
      setUpEvents();
      UICtrl.updateCounter(dataCtrl.getItems(), select(DOM.counter.personal), select(DOM.counter.business), select(DOM.counter.all));
    }
  }

}(dataContoller, UIContoller));

// Starts the app
contoller.init();
