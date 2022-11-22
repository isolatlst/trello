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
    popup.innerHTML = popupIconTemplate

    document.body.addEventListener('click', e => {
        if (e.target.closest('div.popup') == popup) {
            popup.innerHTML = popupTemplate
            let buttons = createPopupButtons();
            allowSaving(buttons)
        } else {
            popup.innerHTML = popupIconTemplate
        }
    })

}
openModal()

function createPopupButtons() {
    let popupButtonsTemplate = '';

    if (saveAtStorageStatus || localStorage.getItem('boards')) {
        popupButtonsTemplate = `
        <button class="popup__button_save-data" role="button">Сохранить данные</button>
        <button class="popup__button_remove-data" role="button">Отчистить память</button>`
    } else {
        popupButtonsTemplate = `
        <button class="popup__button_allow-save" role="button">Разрешить</button>
        <button class="popup__button_disallow-save" role="button">Запретить</button>`
    }
    let buttons = document.querySelector('.popup__buttons');

    buttons.innerHTML = popupButtonsTemplate
    return buttons
}

function autoEvent(ev, bubbles, element, delay) {
    setTimeout(() => {
        let event = new Event(ev, { bubbles: bubbles });
        element.dispatchEvent(event);
    }, delay)
}

if (!localStorage.getItem('boards')) {
    autoEvent('click', true, document.querySelector('.popup__icon'), 2000)
}