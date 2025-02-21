// Function to calculate the greatest common divisor (GCD)
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b]; // Swap values until b reaches 0
    }
    return a;
}

// Function to generate the table
function generateTable() {
    const range = document.getElementById('range').value; // Get table range input
    const container = document.getElementById('table-container'); // Get table container
    container.innerHTML = ''; // Clear previous table

    const table = document.createElement('table'); // Create new table element
    const headerRow = document.createElement('tr'); // Create header row
    const emptyCell = document.createElement('th'); // Empty corner cell
    headerRow.appendChild(emptyCell); // Append empty cell

    // Create table headers
    for (let i = 1; i <= range; i++) {
        const th = document.createElement('th');
        th.textContent = i;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table rows and cells
    for (let i = 1; i <= range; i++) {
        const row = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = i;
        row.appendChild(headerCell);

        for (let j = 1; j <= range; j++) {
            const cell = document.createElement('td');
            const fraction = `${i}/${j}`;
            const divisor = gcd(i, j);
            const simplifiedFraction = divisor > 1 ? `(${i / divisor}/${j / divisor})` : '';
            const decimal = (i / j).toFixed(2);
            const product = i * j;

            cell.innerHTML = `<div>${product}</div><div>${fraction} ${simplifiedFraction}</div><div>${decimal}</div>`;

            if (i === j) {
                cell.classList.add('highlight-square-root'); // Highlight diagonal cells
            }

            cell.addEventListener('mouseover', () => highlight(cell, i, j, range));
            cell.addEventListener('mouseout', clearHighlight);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    container.appendChild(table);
}

// Function to highlight a cell, row, and column
function highlight(cell, row, col, range) {
    clearHighlight();
    const table = document.querySelector('table');
    for (let i = 1; i <= range; i++) {
        table.rows[row].cells[i].classList.add('highlight');
        table.rows[i].cells[col].classList.add('highlight');
    }
    cell.classList.add('highlight-cell');
}

// Function to remove all highlights
function clearHighlight() {
    document.querySelectorAll('.highlight, .highlight-cell').forEach(cell => {
        cell.classList.remove('highlight', 'highlight-cell');
    });
}

// Function to search for an exact match
function searchTable() {
    const value = document.getElementById('search').value.trim();
    if (!value) return;
    const table = document.querySelector('table');
    if (!table) return;

    table.querySelectorAll('td').forEach(cell => {
        const values = cell.innerText.split(/\s+/); // Split text content into separate parts
        if (values.includes(value)) {
            cell.classList.add('highlight-cell');
        } else {
            cell.classList.remove('highlight-cell');
        }
    });
}

// Load table on page load
window.onload = generateTable;
// Function to generate quiz questions based on the table values
function generateQuestion() {
    const range = parseInt(document.getElementById('range').value); // Get table range
    const quizType = document.getElementById('quiz-type').value; // Get quiz type
    const quizBox = document.getElementById('quiz-container');
    const questionEl = quizBox.querySelector('.quiz-question');
    const optionsEl = quizBox.querySelector('.quiz-options');
    const resultEl = quizBox.querySelector('.quiz-result');

    optionsEl.innerHTML = ''; // Clear previous options
    resultEl.innerHTML = ''; // Clear previous results

    let num1 = Math.floor(Math.random() * range) + 1;
    let num2 = Math.floor(Math.random() * range) + 1;
    let correctAnswer, questionText;

    /*** ✅ Section 1: Multiplication, Subtraction, Addition ***/
    if (quizType === "multiplication") {
        let operations = ["+", "-", "×"];
        let operation = operations[Math.floor(Math.random() * operations.length)];
        correctAnswer = eval(`${num1} ${operation === "×" ? "*" : operation} ${num2}`);
        questionText = `${num1} ${operation} ${num2} = ?`;
    }

    /*** ✅ Section 2: Decimal to Fraction ***/
    else if (quizType === "decimal-to-fraction") {
        let fraction = `${num1}/${num2}`;
        correctAnswer = simplifyFraction(num1, num2); // Ensure fraction is simplified
        questionText = `Convert ${(num1 / num2).toFixed(2)} to a fraction:`;
    }

    /*** ✅ Section 3: Fraction to Decimal ***/
    else if (quizType === "fraction-to-decimal") {
        correctAnswer = (num1 / num2).toFixed(2);
        questionText = `Convert ${num1}/${num2} to decimal:`;
    }
/*** ✅ Section 4: Squares, Square Roots, Cubes, Cube Roots ***/
else if (quizType === "squares-cubes") {
    let squareNumbers = [];
    let cubeNumbers = [];

    // ✅ Generate squares (1² to 20²)
    for (let i = 1; i <= 20; i++) {
        squareNumbers.push({ base: i, squared: i * i });
    }

    // ✅ Generate cubes (1³ to 10³)
    for (let i = 1; i <= 10; i++) {
        cubeNumbers.push({ base: i, cubed: i * i * i });
    }

    // ✅ Combine square and cube values
    let allNumbers = [...squareNumbers, ...cubeNumbers];

    // ✅ Pick a random entry
    let chosen = allNumbers[Math.floor(Math.random() * allNumbers.length)];

    // ✅ Determine if it's a square or a cube
    let isSquare = chosen.hasOwnProperty('squared');
    let isCube = chosen.hasOwnProperty('cubed');

    // ✅ Pick a random question type
    let options = [];
    if (isSquare) options.push("square", "square root");
    if (isCube) options.push("cube", "cube root");
    let type = options[Math.floor(Math.random() * options.length)];

    // ✅ Generate the correct answer and question
    if (type === "square") {
        correctAnswer = chosen.squared;
        questionText = `What is ${chosen.base}²?`;
    } else if (type === "square root") {
        correctAnswer = chosen.base;
        questionText = `What is √${chosen.squared}?`;
    } else if (type === "cube") {
        correctAnswer = chosen.cubed;
        questionText = `What is ${chosen.base}³?`;
    } else if (type === "cube root") {
        correctAnswer = chosen.base;
        questionText = `What is ³√${chosen.cubed}?`;
    }
}

    // ✅ Display the question
    questionEl.textContent = questionText;

    // ✅ Generate Answer Choices
    let answers = [correctAnswer];

    while (answers.length < 4) {
        let randomWrong;
        if (quizType === "multiplication") {
            randomWrong = Math.floor(Math.random() * (range * range)) + 1;
        } else if (quizType === "fraction-to-decimal") {
            randomWrong = (Math.random() * 10).toFixed(2);
        } else if (quizType === "decimal-to-fraction") {
            randomWrong = simplifyFraction(
                Math.floor(Math.random() * range) + 1,
                Math.floor(Math.random() * range) + 1
            );
        } else {
            randomWrong = Math.floor(Math.random() * (range * range));
        }

        if (!answers.includes(randomWrong)) answers.push(randomWrong);
    }

    answers.sort(() => Math.random() - 0.5);

    // ✅ Display Answer Options
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('quiz-option');
        button.textContent = answer;
        button.onclick = () => evaluateAnswer(button, answer, correctAnswer, resultEl);
        optionsEl.appendChild(button);
    });
}

// ✅ Function to evaluate the selected answer
function evaluateAnswer(button, givenAnswer, correctAnswer, resultElement) {
    document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

    if (givenAnswer == correctAnswer) {
        button.classList.add('correct');
        resultElement.innerHTML = "<span class='result-text correct'>✅ Correct!</span>";
    } else {
        button.classList.add('wrong');
        resultElement.innerHTML = `<span class='result-text wrong'>❌ Incorrect! The correct answer is <strong>${correctAnswer}</strong></span>`;
    }
}

// ✅ Function to simplify fractions properly
function simplifyFraction(numerator, denominator) {
    let gcd = function (a, b) {
        return b ? gcd(b, a % b) : a;
    };
    let divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
}
