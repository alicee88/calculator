const keys = document.querySelectorAll('[data-key');
const display = document.querySelector('.answer');
keys.forEach(key => key.addEventListener('click', getInput));

let displayValue = "";
let rVal = "";
let lVal = "";
let operator = "";
let isOperatedOn = false;

function getInput(e) {
    let key = this.dataset.key;

    if(key === 'C') {
        clearDisplay();
        return;
    }

    if(key === '=') {
        calcAnswer();
        return;
    }

    if(this.classList.contains('operator')) {
        isOperatedOn = true;
        operator = key;
    }

    if(isOperatedOn && this.classList.contains('number')) {
        rVal += key;
    }
    else if(this.classList.contains('number')) {
        lVal += key;
    }

    displayValue += this.dataset.key;
    display.textContent = displayValue;
}

function clearDisplay() {
    displayValue = "";
    rVal = "";
    lVal = "";
    operator = "";
    display.textContent = displayValue;
    isOperatedOn = false;
}

function calcAnswer() {
    isOperatedOn = false;
    let answer = operate(operator, parseInt(lVal), parseInt(rVal));
    lVal = answer;
    rVal = "";
    operator = "";
    displayValue = answer;
    display.textContent = answer;
}

/* ****************************
Mathematical operator functions
******************************* */
const add = (a, b) => (a + b);
const subtract = (a, b) => (a - b);
const multiply = (a, b) => (a * b);
const divide = (a, b) => (a / b);

function operate(op, a, b) {
    switch(op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return 'Operator not recognized';
    }
}