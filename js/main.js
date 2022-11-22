"use strict";

function addTask() {
  const lists = document.querySelectorAll('.list');
  const openForm = document.querySelector('.open-form-btn');
  const addTask = document.querySelector('.form__add-item-btn');
  const cancelTask = document.querySelector('.form__cancel-item-btn');
  const formBtns = document.querySelector('.form__buttons');
  const textarea = document.querySelector('.form__textarea');
  const form = document.querySelector('.form');
  let value;
  openForm.addEventListener('click', () => {
    form.style.display = 'block';
    openForm.style.display = 'none';
    addTask.style.display = 'none';
    textarea.addEventListener('input', e => {
      value = e.target.value;

      if (value) {
        addTask.style.display = 'block';
      } else {
        addTask.style.display = 'none';
      }
    });
  });
  formBtns.addEventListener('click', e => {
    // делегирование событий
    if (e.target == addTask) {
      const newItem = document.createElement('div');
      newItem.classList.add('list__item');
      newItem.setAttribute('draggable', 'true');
      newItem.innerHTML = `${value} \n<span class="list__item-remove"></span>`;
      lists[0].append(newItem);
      clearForm(value, textarea, form, openForm);
      dragNdrop();
    } else if (e.target == cancelTask) {
      clearForm(value, textarea, form, openForm);
    }
  });
  document.body.addEventListener('keydown', e => {
    if (e.key == 'Escape') {
      clearForm(value, textarea, form, openForm);
    }
  });
}

addTask();

function clearForm(value, textarea, form, openForm) {
  value = '';
  textarea.value = '';
  form.style.display = 'none';
  openForm.style.display = 'flex';
}

function addBoard() {
  const addBoard = document.querySelector('.add-board-btn');
  addBoard.addEventListener('click', () => {
    const boards = document.querySelector('.boards');
    const board = document.createElement('div');
    board.classList.add('board__item');
    board.innerHTML = `
        <span contenteditable="true" class="board__title">Введите название</span>
        <div class="list"></div>`;
    boards.append(board);
    changeTitle();
    dragNdrop();
  });
}

addBoard();

function changeTitle() {
  const titles = document.querySelectorAll('.board__title');
  titles.forEach(title => {
    title.addEventListener('click', e => e.target.innerHTML = '');
  });
}

changeTitle();
let draggedItem;

function dragNdrop() {
  const listItems = document.querySelectorAll('.list__item');
  const lists = document.querySelectorAll('.list');
  listItems.forEach(listItem => {
    listItem.addEventListener('dragstart', () => {
      draggedItem = listItem;
      setTimeout(() => {
        // для скрытия элемента при драгстарте нужен сеттаймаут, чтобы элемент не исчезал
        listItem.style.display = 'none';
      }, 0);
    });
    listItem.addEventListener('dragend', () => {
      setTimeout(() => {
        listItem.style.display = 'block';
        draggedItem = null;
      }, 0);
    });
    listItem.childNodes[1].addEventListener('click', function () {
      this.parentNode.remove();
    });
  });
  lists.forEach(list => {
    list.addEventListener('dragover', e => e.preventDefault());
    list.addEventListener('dragenter', function () {
      //работаем с this, т.к. стрелочная не имеет своего контекста
      this.style.backgroundColor = 'rgba(0,0,0,.3)';
    });
    list.addEventListener('dragleave', function () {
      this.style.backgroundColor = '';
    });
    list.addEventListener('drop', function (e) {
      e.preventDefault();
      this.style.backgroundColor = '';
      this.append(draggedItem);
    });
  });
}

dragNdrop();

function changingBackground() {
  const timeToChanging = 5 * 60 * 1000; // 5 минут

  setInterval(function () {
    const app = document.querySelector('.app');
    app.style.backgroundImage = `url('img/${Math.floor(Math.random() * 3 + 1)}.jpg')`;
  }, timeToChanging);
}

changingBackground();
let saveAtStorageStatus = false;

function openModal() {
  const popup = document.querySelector('.popup');
  const popupTemplate = `
    <div class="popup__body">
        <div class="popup__title">Cохранять данные в память браузера?</div>
        <div class="popup__text">Данные будут записаны в память Вашего ком&shy;пьютера. При возобнавлении
        работы сайта инфор&shy;мация о созданных досках будет вос&shy;становлена!</div>
        <div class="popup__buttons"></div>
    </div>`;
  const popupIconTemplate = `<div class="popup__icon">i</div>`;
  popup.innerHTML = popupIconTemplate;
  document.body.addEventListener('click', e => {
    if (e.target.closest('div.popup') == popup) {
      popup.innerHTML = popupTemplate;
      let buttons = createPopupButtons();
      allowSaving(buttons);
    } else {
      popup.innerHTML = popupIconTemplate;
    }
  });
}

openModal();

function createPopupButtons() {
  let popupButtonsTemplate = '';

  if (saveAtStorageStatus || localStorage.getItem('boards')) {
    popupButtonsTemplate = `
        <button class="popup__button_save-data" role="button">Сохранить данные</button>
        <button class="popup__button_remove-data" role="button">Отчистить память</button>`;
  } else {
    popupButtonsTemplate = `
        <button class="popup__button_allow-save" role="button">Разрешить</button>
        <button class="popup__button_disallow-save" role="button">Запретить</button>`;
  }

  let buttons = document.querySelector('.popup__buttons');
  buttons.innerHTML = popupButtonsTemplate;
  return buttons;
}

function autoEvent(ev, bubbles, element, delay) {
  setTimeout(() => {
    let event = new Event(ev, {
      bubbles: bubbles
    });
    element.dispatchEvent(event);
  }, delay);
}

if (!localStorage.getItem('boards')) {
  autoEvent('click', true, document.querySelector('.popup__icon'), 2000);
}

function allowSaving(buttons) {
  buttons.addEventListener('click', e => {
    if (e.target.classList.contains('popup__button_allow-save')) {
      createObjects();
      autosave();
      saveAtStorageStatus = true;
    } else if (e.target.classList.contains('popup__button_disallow-save')) {
      saveAtStorageStatus = false;
    } else if (e.target.classList.contains('popup__button_save-data')) {
      createObjects();
    } else if (e.target.classList.contains('popup__button_remove-data')) {
      localStorage.removeItem('boards');
    }

    autoEvent('click', false, document.body, 0);
  });
}

function createObjects() {
  let boardsData = [];

  class board {
    constructor(title, listItems) {
      this.title = title;
      this.listItems = listItems;
    }

  }

  let boards = document.querySelectorAll('.board__item');

  for (let i = 0; i < boards.length; i++) {
    let title = '';
    let listItems = [];
    let items = boards[i].querySelectorAll('.list__item');
    title = boards[i].querySelector('.board__title').innerText;

    for (let j = 0; j < items.length; j++) {
      listItems[j] = items[j].innerText;
    }

    boardsData[i] = new board(title, listItems);
  }

  saveData(boardsData);
}

function saveData(boardsData) {
  localStorage.setItem('boards', JSON.stringify(boardsData));
}

function autosave() {
  setInterval(() => createObjects(), 5 * 60 * 1000);
}

function recoveryData() {
  let data = JSON.parse(localStorage.getItem('boards'));
  let boards = document.querySelector('.boards');
  let boardsItems = boards.children;

  for (let key in data) {
    let boardItem = `
            <div class="board__item">
                <span contenteditable="true" class="board__title">${data[key].title}</span>
                <div class="list"></div> 
            </div>`;
    let listItem = '';

    for (let i = 0; i < data[key].listItems.length; i++) {
      listItem += `
                <div class="list__item" draggable="true">
                    ${data[key].listItems[i]}
                    <span class="list__item-remove"></span>
                </div>`;
    }

    if (key == 0) {
      boardsItems[key].children[0].innerHTML = data[key].title;
      boardsItems[key].children[1].innerHTML = listItem;
    } else {
      boards.insertAdjacentHTML('beforeend', boardItem);
      boardsItems[key].children[1].insertAdjacentHTML('beforeend', listItem);
    }
  }

  changeTitle();
  dragNdrop();
}

recoveryData();