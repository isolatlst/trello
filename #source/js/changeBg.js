function changingBackground() {
    const timeToChanging = 5 * 60 * 1000; // 5 минут

    setInterval(function () {
        const app = document.querySelector('.app');
        app.style.backgroundImage = `url('../img/${Math.floor(Math.random() * 3 + 1)}.jpg')`
    }, timeToChanging)
}
changingBackground()