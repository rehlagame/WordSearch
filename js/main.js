document.addEventListener('DOMContentLoaded', () => {
    // 1. إنشاء المحرك والواجهة
    const engine = new GameEngine(12); // شبكة 12x12 لتستوعب الكلمات الطويلة براحة
    const ui = new GameUI(engine);

    // 2. دالة بدء اللعبة
    function startNewGame() {
        // اختيار فئة عشوائية من قاعدة البيانات
        const categoriesArray = Object.keys(gameData.categories);
        const randomCategory = categoriesArray[Math.floor(Math.random() * categoriesArray.length)];

        document.getElementById('category-title').textContent = "الفئة: " + randomCategory;

        ui.foundWordsCount = 0;
        engine.generateGame(randomCategory);
        ui.renderGrid();
        ui.renderWordList();
    }

    // 3. ربط زر "لعبة جديدة"
    document.getElementById('new-game-btn').addEventListener('click', startNewGame);

    // 4. ربط زر "مساعدة 💡"
    document.getElementById('hint-btn').addEventListener('click', () => {
        // البحث عن كلمة لم يتم شطبها بعد
        let remainingWords = Array.from(document.querySelectorAll('#word-list li:not(.found)'));
        if(remainingWords.length === 0) return;

        let wordToHelp = remainingWords[0].dataset.word;
        // البحث عن مكان هذه الكلمة في المحرك
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

    // 5. إطلاق اللعبة فور فتح الصفحة
    startNewGame();
});