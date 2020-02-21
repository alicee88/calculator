const keys = document.querySelectorAll('[data-key]');
const operators = document.querySelectorAll('.operator');
const point = document.querySelector('[data-key="."]');
const display = document.querySelector('.answer');
keys.forEach(key => key.addEventListener('click', getInput));

const maxWidth = 20;
let width = 0;
let displayValue = "0";
let rVal = "";
let lVal = "";
let operator = "";
let impossible = false;
let lastKey;

function getInput() {
    
    // Don't overflow the screen
    if(width === maxWidth) return;

    let key = this.dataset.key;

    if(this.classList.contains('number')) {
        this.blur();
        displayValue = handleNumberInput(key);
    } else if(key === 'C') {
        this.blur();
        displayValue = '0';
        clearDisplay();
    } else {
        displayValue = handleOperatorInput(key);
    }

    lastKey = key;
    toggleSelected(key);

    if(impossible) {
        clearDisplay();
    }

    display.textContent = displayValue;
    width = display.innerHTML.length;
}

function handleNumberInput(key) {
    if(key === '0' && !lastKey) return displayValue;

    if(key === '.') {
        point.disabled = true;

        if(!lastKey) lVal = '0';
    }

    if(isOperator(lastKey) || rVal) {
        rVal += key;
        return rVal;
    } else {
        lVal += key;
        return lVal;
    }
}

function handleOperatorInput(key) {
    point.disabled = false;
    let answer = displayValue;

    if(rVal && !impossible) {
        lVal = calcAnswer();
        rVal = "";
        answer = lVal;
    } 

    operator = key;
    return answer;
    
}

function calcAnswer() {
    console.log(operator, lVal, rVal);
    let answer = operate(operator, parseFloat(lVal), parseFloat(rVal));

    // Don't let the answer length overflow
    if(impossible) return answer;

    let answerLength = answer;
    answerLength = Math.floor(answerLength).toString().length + 1;
    return parseFloat(answer.toFixed(maxWidth - answerLength));
}

function isOperator(key) {
    if(key === '+' || key === '-' || key === '/' || key === '*') return true;

    return false;
}

function clearDisplay() {
    rVal = "";
    lVal = "";
    operator = "";
    width = 0;
    impossible = false;
    point.disabled = false;
    lastKey = "";
    toggleSelected();
}

function toggleSelected(key) {
    operators.forEach(operator => {
        if(operator.dataset.key === key) {
            operator.classList.add('selected');
        } else {
            operator.classList.remove('selected');
        }
    });
}

function operatorSelected() {
    let found = false;
    operators.forEach(operator => {
        if(operator.classList.contains('selected')) {
            found = true;
        }
    });
    return found;
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
        {
            if(b === 0) {
                impossible = true;
                return '!Divide by zero';
            }
            else
                return divide(a, b);
        }
        default:
            return 'Operator not recognized';
    }
}