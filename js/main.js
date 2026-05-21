document.addEventListener('DOMContentLoaded', () => {
    // إنشاء المحرك بشبكة 12×12 لتستوعب الكلمات بشكل مريح
    const engine = new GameEngine(12);
    const ui = new GameUI(engine);

    function startNewGame() {
        const categoriesArray = Object.keys(gameData.categories);
        const randomCategory = categoriesArray[Math.floor(Math.random() * categoriesArray.length)];

        document.getElementById('category-title').textContent = "الفئة: " + randomCategory;

        ui.foundWordsCount = 0;
        engine.generateGame(randomCategory);
        ui.renderGrid();
        ui.renderWordList();
    }

    document.getElementById('new-game-btn').addEventListener('click', startNewGame);

    document.getElementById('hint-btn').addEventListener('click', () => {
        let remainingWords = Array.from(document.querySelectorAll('#word-list li:not(.found)'));
        if(remainingWords.length === 0) return;

        let wordToHelp = remainingWords[0].dataset.word;
        let wordData = engine.placedWordsCoords.find(w => w.word === wordToHelp);

        if (wordData) {
            let firstLetterCoord = wordData.coords[0];
            let cell = document.querySelector(`.grid-cell[data-r="${firstLetterCoord.r}"][data-c="${firstLetterCoord.c}"]`);
            if(cell) {
                cell.classList.add('hint-anim');
                setTimeout(() => cell.classList.remove('hint-anim'), 1500);
            }
        }
    });

    startNewGame();
});