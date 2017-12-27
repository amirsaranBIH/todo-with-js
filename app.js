const fontAwesomeIcons = 'https://gist.githubusercontent.com/james2doyle/3d7ad018e6b6abed7957/raw/96dc7abc78826618e6ad291f4f042fc5afc50980/fa-icons.json';

var dataContoller = (function() {

  var items = {
    personal: [],
    business: []
  };


  return {
    select(el) {
      var validEl = typeof el === 'string';
      if (validEl) {
        return el.startsWith('.') ? document.querySelectorAll(el) : document.querySelector(el);
      }
      console.error('Function select() doesn\'t have a valid argument');
    },

    createItem(todo, category, place, time, icon) {
      items[category].push({todo, place, time, icon});
    },

    getItems() {
      return items;
    }
  }

}());


var UIContoller = (function() {

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
      personal: '#personal-project-counter',
      business: '#business-project-counter'
    }
  }

  return {

    getDOM() {
      return DOM;
    },

    fadeInOut(fadeIn, fadeOut) {
      $(fadeOut).fadeOut(100, function() {
        $(fadeIn).fadeIn();
      });
    },

    formatedTemplate(todo, place, time, icon) {
      var todoTemplate = `<div class="todo-item flex"><div class="item-section"><i class="fa ${icon}" aria-hidden="true"></i></div><div class="item-section"><h2 class="item-text">${todo}</h2><p class="item-location">${place}</p></div><div class="item-section"><span class="item-created">${time}</span></div></div>`;

      return todoTemplate;
    },

    renderItem(item, list) {
      list.insertAdjacentHTML('beforeend', item);
    },

    updateCounter(data, personal, business) {
      personal.innerText = data.personal.length;
      business.innerText = data.business.length;
    }

  }

}());


var contoller = (function(dataCtrl, UICtrl) {

  var select = dataCtrl.select;
  var DOM = UICtrl.getDOM();

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
      var formatedTemplate = UICtrl.formatedTemplate(todoInput, placeInput, timeInput, 'fa-paint-brush');

      dataCtrl.createItem(todoInput, categoryInput, placeInput, timeInput, 'fa-paint-brush', formatedTemplate);

      UICtrl.renderItem(UICtrl.formatedTemplate(todoInput, placeInput, timeInput, 'fa-paint-brush'), select(DOM.todoList));
      UICtrl.fadeInOut(DOM.todo, DOM.addModal);

      console.log(dataCtrl.getItems());
      UICtrl.updateCounter(dataCtrl.getItems(), select(DOM.counter.personal), select(DOM.counter.business));
    });
  }

  return {
    init() {
      setUpEvents();
      UICtrl.updateCounter(dataCtrl.getItems(), select(DOM.counter.personal), select(DOM.counter.business));
    }
  }

}(dataContoller, UIContoller));

contoller.init();
