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
        form.style.display = 'block'
        openForm.style.display = 'none'
        addTask.style.display = 'none'

        textarea.addEventListener('input', e => {
            value = e.target.value

            if (value) {
                addTask.style.display = 'block'
            } else {
                addTask.style.display = 'none'
            }
        })
    })

    formBtns.addEventListener('click', e => { // делегирование событий
        if (e.target == addTask) {
            const newItem = document.createElement('div');
            newItem.classList.add('list__item')
            newItem.setAttribute('draggable', 'true')
            newItem.innerHTML = `${value} \n<span class="list__item-remove"></span>`
            lists[0].append(newItem)

            clearForm(value, textarea, form, openForm)
            dragNdrop()

        } else if (e.target == cancelTask) {
            clearForm(value, textarea, form, openForm)
        }
    })
    document.body.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            clearForm(value, textarea, form, openForm)
        }
    })
}
addTask()

function clearForm(value, textarea, form, openForm) {
    value = ''
    textarea.value = ''
    form.style.display = 'none'
    openForm.style.display = 'flex'
}

function addBoard() {
    const addBoard = document.querySelector('.add-board-btn');

    addBoard.addEventListener('click', () => {
        const boards = document.querySelector('.boards');
        const board = document.createElement('div')
        board.classList.add('board__item')

        board.innerHTML = `
        <span contenteditable="true" class="board__title">Введите название</span>
        <div class="list"></div>`

        boards.append(board)

        changeTitle()
        dragNdrop()
    })
}
addBoard()

function changeTitle() {
    const titles = document.querySelectorAll('.board__title');

    titles.forEach(title => {
        title.addEventListener('click', e => e.target.innerHTML = '')
    })

}
changeTitle()

let draggedItem;

function dragNdrop() {
    const listItems = document.querySelectorAll('.list__item');
    const lists = document.querySelectorAll('.list');

    listItems.forEach(listItem => {
        listItem.addEventListener('dragstart', () => {
            draggedItem = listItem
            setTimeout(() => {  // для скрытия элемента при драгстарте нужен сеттаймаут, чтобы элемент не исчезал
                listItem.style.display = 'none'
            }, 0)
        })

        listItem.addEventListener('dragend', () => {
            setTimeout(() => {
                listItem.style.display = 'block'
                draggedItem = null
            }, 0)
        })
        listItem.childNodes[1].addEventListener('click', function () { this.parentNode.remove() })
    })

    lists.forEach(list => {
        list.addEventListener('dragover', e => e.preventDefault())

        list.addEventListener('dragenter', function () { //работаем с this, т.к. стрелочная не имеет своего контекста
            this.style.backgroundColor = 'rgba(0,0,0,.3)'
        })

        list.addEventListener('dragleave', function () {
            this.style.backgroundColor = ''
        })

        list.addEventListener('drop', function (e) {
            e.preventDefault()
            this.style.backgroundColor = ''
            this.append(draggedItem)
        })
    })
}
dragNdrop()

