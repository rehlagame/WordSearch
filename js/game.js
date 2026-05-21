class GameEngine {
    constructor(size = 12) {
        this.size = size;
        this.grid = [];
        this.wordsToFind = [];
        this.secretWordObj = {};
        this.placedWordsCoords = [];
    }

    initGrid() {
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(''));
        this.placedWordsCoords = [];
    }

    generateGame(categoryName) {
        this.initGrid();
        const category = gameData.categories[categoryName];
        this.wordsToFind = [...category.words];
        this.secretWordObj = category.secret;

        this.wordsToFind.forEach(word => this.placeWord(word));
        this.placeSecretWord(this.secretWordObj.word);
        this.fillEmptyCells();
    }

    placeWord(word) {
        const directions = [
            { r: 0, c: -1 },
            { r: 1, c: 0 },
            { r: 1, c: -1 }
        ];

        let placed = false;
        let attempts = 0;

        // تم رفع المحاولات لـ 500 لضمان زرع كل الكلمات
        while (!placed && attempts < 500) {
            let dir = directions[Math.floor(Math.random() * directions.length)];
            let startRow = Math.floor(Math.random() * this.size);
            let startCol = Math.floor(Math.random() * this.size);

            if (this.canPlaceWord(word, startRow, startCol, dir)) {
                let coords = [];
                for (let i = 0; i < word.length; i++) {
                    let r = startRow + (dir.r * i);
                    let c = startCol + (dir.c * i);
                    this.grid[r][c] = word[i];
                    coords.push({ r, c });
                }
                this.placedWordsCoords.push({ word, coords });
                placed = true;
            }
            attempts++;
        }
    }

    canPlaceWord(word, row, col, dir) {
        for (let i = 0; i < word.length; i++) {
            let r = row + (dir.r * i);
            let c = col + (dir.c * i);
            if (r < 0 || r >= this.size || c < 0 || c >= this.size) return false;
            if (this.grid[r][c] !== '' && this.grid[r][c] !== word[i]) return false;
        }
        return true;
    }

    placeSecretWord(secretWord) {
        this.secretCoords = [];
        let secretIndex = 0;

        // زرع أحرف كلمة السر بالترتيب لقراءتها بشكل طبيعي بعد الفوز
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === '' && secretIndex < secretWord.length) {
                    this.grid[r][c] = secretWord[secretIndex];
                    this.secretCoords.push({ r, c, char: secretWord[secretIndex] });
                    secretIndex++;
                }
            }
        }
    }

    fillEmptyCells() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === '') {
                    let randomChar = arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];
                    this.grid[r][c] = randomChar;
                }
            }
        }
    }
}