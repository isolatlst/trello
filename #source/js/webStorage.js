function allowSaving(buttons) {
    buttons.addEventListener('click', e => {

        if (e.target.classList.contains('popup__button_allow-save')) {
            createObjects()
            autosave()
            saveAtStorageStatus = true
        } else if (e.target.classList.contains('popup__button_disallow-save')) {
            saveAtStorageStatus = false
        } else if (e.target.classList.contains('popup__button_save-data')) {
            createObjects()
        } else if (e.target.classList.contains('popup__button_remove-data')) {
            localStorage.removeItem('boards')
        }
        autoEvent('click', false, document.body, 0)
    })
}


function createObjects() {
    let boardsData = [];
    class board {
        constructor(title, listItems) {
            this.title = title
            this.listItems = listItems
        }
    }
    let boards = document.querySelectorAll('.board__item');

    for (let i = 0; i < boards.length; i++) {
        let title = '';
        let listItems = [];
        let items = boards[i].querySelectorAll('.list__item')

        title = boards[i].querySelector('.board__title').innerText

        for (let j = 0; j < items.length; j++) {
            listItems[j] = items[j].innerText
        }

        boardsData[i] = new board(title, listItems)
    }
    saveData(boardsData)
}


function saveData(boardsData) {
    localStorage.setItem('boards', JSON.stringify(boardsData))
}
function autosave() {
    setInterval(() => createObjects(), 5 * 60 * 1000)
}

function recoveryData() {
    let data = JSON.parse(localStorage.getItem('boards'));
    let boards = document.querySelector('.boards');
    let boardsItems = boards.children

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
            boards.insertAdjacentHTML('beforeend', boardItem)
            boardsItems[key].children[1].insertAdjacentHTML('beforeend', listItem)
        }
    }

    changeTitle()
    dragNdrop()
}
recoveryData();