class GameEngine {
    constructor(size = 10) {
        this.size = size;
        this.grid = [];
        this.wordsToFind = [];
        this.secretWordObj = {};
        this.placedWordsCoords = []; // لتتبع أماكن الكلمات
    }

    // تهيئة شبكة فارغة
    initGrid() {
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(''));
        this.placedWordsCoords = [];
    }

    // توليد لعبة جديدة بناءً على فئة
    generateGame(categoryName) {
        this.initGrid();
        const category = gameData.categories[categoryName];
        this.wordsToFind = [...category.words];
        this.secretWordObj = category.secret;

        // 1. زرع الكلمات الأساسية
        this.wordsToFind.forEach(word => this.placeWord(word));

        // 2. زرع أحرف كلمة السر في أماكن فارغة (عشوائياً)
        this.placeSecretWord(this.secretWordObj.word);

        // 3. ملء باقي الفراغات بأحرف عشوائية
        this.fillEmptyCells();
    }

    placeWord(word) {
        // الاتجاهات المسموحة (للمستوى المتوسط): أفقي يسار، عمودي أسفل، قطري أسفل يسار
        const directions = [
            { r: 0, c: -1 }, // من اليمين لليسار (عربي طبيعي)
            { r: 1, c: 0 },  // من الأعلى للأسفل
            { r: 1, c: -1 }  // مائل من أعلى اليمين لأسفل اليسار
        ];

        let placed = false;
        let attempts = 0;

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
            // التأكد من عدم الخروج عن الشبكة
            if (r < 0 || r >= this.size || c < 0 || c >= this.size) return false;
            // التأكد من أن المربع فارغ أو يحتوي على نفس الحرف (تقاطع مسموح)
            if (this.grid[r][c] !== '' && this.grid[r][c] !== word[i]) return false;
        }
        return true;
    }

    placeSecretWord(secretWord) {
        this.secretCoords = [];
        for (let i = 0; i < secretWord.length; i++) {
            let placed = false;
            while (!placed) {
                let r = Math.floor(Math.random() * this.size);
                let c = Math.floor(Math.random() * this.size);
                if (this.grid[r][c] === '') {
                    this.grid[r][c] = secretWord[i];
                    // نضع علامة سرية لتمييز أحرف كلمة السر
                    this.secretCoords.push({ r, c, char: secretWord[i] });
                    placed = true;
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