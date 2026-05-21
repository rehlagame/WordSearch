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

        // التقاطع الذكي: ترتيب الكلمات من الأطول إلى الأقصر
        // هذا يجعل الكلمات الكبيرة تتمركز أولاً، وتتداخل معها الكلمات القصيرة بواقعية
        this.wordsToFind = [...category.words].sort((a, b) => b.length - a.length);
        this.secretWordObj = category.secret;

        this.wordsToFind.forEach(word => this.placeWord(word));
        this.placeSecretWord(this.secretWordObj.word);
        this.fillEmptyCells();

        // إعادة ترتيب القائمة أبجدياً أو عشوائياً للمستخدم حتى لا يلاحظ أنها مرتبة بالطول
        this.wordsToFind.sort(() => Math.random() - 0.5);
    }

    placeWord(word) {
        // الواقعية التامة: تفعيل جميع الاتجاهات الثمانية الممكنة في الجرائد
        const directions = [
            { r: 0, c: -1 }, // أفقي: يمين لليسار
            { r: 0, c: 1 },  // أفقي معكوس: يسار لليمين (صعب)
            { r: 1, c: 0 },  // عمودي: أعلى لأسفل
            { r: -1, c: 0 }, // عمودي معكوس: أسفل لأعلى (صعب)
            { r: 1, c: -1 }, // قطري: مائل لأسفل اليسار
            { r: 1, c: 1 },  // قطري: مائل لأسفل اليمين
            { r: -1, c: -1 },// قطري: مائل لأعلى اليسار (تحدي)
            { r: -1, c: 1 }  // قطري: مائل لأعلى اليمين (تحدي)
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
            // التأكد من البقاء داخل حدود الشبكة
            if (r < 0 || r >= this.size || c < 0 || c >= this.size) return false;
            // السماح بالتقاطع فقط إذا كان الحرف مطابقاً
            if (this.grid[r][c] !== '' && this.grid[r][c] !== word[i]) return false;
        }
        return true;
    }

    placeSecretWord(secretWord) {
        this.secretCoords = [];
        let secretIndex = 0;

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