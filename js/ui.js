class GameUI {
    constructor(engine) {
        this.engine = engine;
        this.container = document.getElementById('grid-container');
        this.wordListEl = document.getElementById('word-list');
        this.isDragging = false;
        this.startCell = null;
        this.currentSelection = [];
        this.foundWordsCount = 0;

        this.setupEventListeners();
    }

    renderGrid() {
        this.container.innerHTML = '';
        // تحديث متغير CSS ليناسب حجم الشبكة
        this.container.style.setProperty('--grid-size', this.engine.size);

        for (let r = 0; r < this.engine.size; r++) {
            for (let c = 0; c < this.engine.size; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.r = r;
                cell.dataset.c = c;
                cell.textContent = this.engine.grid[r][c];
                this.container.appendChild(cell);
            }
        }
    }

    renderWordList() {
        this.wordListEl.innerHTML = '';
        this.engine.wordsToFind.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.dataset.word = word;
            this.wordListEl.appendChild(li);
        });
        document.getElementById('secret-clue').textContent = "اللغز: " + this.engine.secretWordObj.clue;
    }

    setupEventListeners() {
        // دعم الماوس (للكمبيوتر)
        this.container.addEventListener('mousedown', (e) => this.handleStart(e.target));
        document.addEventListener('mousemove', (e) => this.handleMove(e.clientX, e.clientY));
        document.addEventListener('mouseup', () => this.handleEnd());

        // دعم اللمس (للآيفون والتابلت)
        this.container.addEventListener('touchstart', (e) => {
            e.preventDefault(); // منع نزول الشاشة
            this.handleStart(e.touches[0].target);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if(!this.isDragging) return;
            e.preventDefault();
            this.handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        document.addEventListener('touchend', () => this.handleEnd());
    }

    handleStart(target) {
        if (!target.classList.contains('grid-cell')) return;
        this.isDragging = true;
        this.startCell = target;
        this.highlightCells(target, target);
    }

    handleMove(x, y) {
        if (!this.isDragging || !this.startCell) return;
        const target = document.elementFromPoint(x, y);
        if (target && target.classList.contains('grid-cell')) {
            this.highlightCells(this.startCell, target);
        }
    }

    highlightCells(startNode, endNode) {
        // إزالة التحديد السابق
        document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
        this.currentSelection = [];

        let r1 = parseInt(startNode.dataset.r);
        let c1 = parseInt(startNode.dataset.c);
        let r2 = parseInt(endNode.dataset.r);
        let c2 = parseInt(endNode.dataset.c);

        let dr = r2 - r1;
        let dc = c2 - c1;
        let steps = Math.max(Math.abs(dr), Math.abs(dc));

        if (steps === 0) {
            startNode.classList.add('highlighted');
            this.currentSelection.push(startNode);
            return;
        }

        // التأكد أن السحب في خط مستقيم (أفقي، عمودي، قطري)
        if (Math.abs(dr) === Math.abs(dc) || dr === 0 || dc === 0) {
            let stepR = dr / steps;
            let stepC = dc / steps;

            for (let i = 0; i <= steps; i++) {
                let r = r1 + (stepR * i);
                let c = c1 + (stepC * i);
                let cell = document.querySelector(`.grid-cell[data-r="${r}"][data-c="${c}"]`);
                if (cell) {
                    cell.classList.add('highlighted');
                    this.currentSelection.push(cell);
                }
            }
        }
    }

    handleEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;

        // تجميع الكلمة من الخلايا المحددة
        let selectedWord = this.currentSelection.map(cell => cell.textContent).join('');
        let reversedWord = selectedWord.split('').reverse().join(''); // فحص الاتجاهين

        let foundWord = this.engine.wordsToFind.find(w => w === selectedWord || w === reversedWord);

        if (foundWord) {
            // هل تم إيجادها مسبقاً؟
            let listItem = document.querySelector(`li[data-word="${foundWord}"]`);
            if (!listItem.classList.contains('found')) {
                listItem.classList.add('found');
                this.currentSelection.forEach(cell => {
                    cell.classList.add('found-cell');
                    cell.dataset.partOfWord = 'true';
                });
                this.foundWordsCount++;
                this.checkWinCondition();
            }
        }

        // إزالة التظليل الأصفر
        document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
        this.currentSelection = [];
    }

    checkWinCondition() {
        if (this.foundWordsCount === this.engine.wordsToFind.length) {
            setTimeout(() => this.revealSecretWord(), 1000);
        }
    }

    revealSecretWord() {
        // السحر: إخفاء كل الأحرف العشوائية!
        const allCells = document.querySelectorAll('.grid-cell');
        allCells.forEach(cell => {
            let r = parseInt(cell.dataset.r);
            let c = parseInt(cell.dataset.c);

            // هل هذه الخلية جزء من كلمة السر؟
            let isSecret = this.engine.secretCoords.find(sc => sc.r === r && sc.c === c);

            if (isSecret) {
                cell.classList.remove('found-cell');
                cell.classList.add('secret-reveal');
            } else if (!cell.dataset.partOfWord) {
                // تلاشي الأحرف التي لا معنى لها
                cell.classList.add('fade-out');
            }
        });

        alert("أحسنت! لقد شطبت جميع الكلمات.. اقرأ الأحرف المضيئة المتبقية لتعرف كلمة السر!");
    }
}