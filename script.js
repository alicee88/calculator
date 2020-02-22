const keys = document.querySelectorAll('[data-key]');
const operators = document.querySelectorAll('.operator');
const point = document.querySelector('[data-key="."]');
const display = document.querySelector('.answer');
const body = document.querySelector('body');
const rotateButton = document.querySelector('.rotate-button');
const calculator = document.querySelector('.calculator');

keys.forEach(key => key.addEventListener('click', getInput));
body.addEventListener('keydown', getInput);
rotateButton.addEventListener('click', toggleRotate);

const maxWidth = 20;
let width = 0;
let displayValue = "0";
let rVal = "";
let lVal = "";
let operator = "";
let impossible = false;
let lastKey;

function getInput(e) {
    
    // Don't overflow the screen
    if(width === maxWidth) return;

    let key;
    let button;
    if(e.key && isKeyBoardEvent(e.key)) {
        key = e.key;
        button = getButton(key);
        let lastButton = getButton(lastKey)
        if(lastButton)
            lastButton.blur();
        button.focus();
    }
    else {
        key = this.dataset.key;
        button = this;
        button.blur();
        
    }

    if(button.classList.contains('number')) {
        displayValue = handleNumberInput(key);
    } else if(key === 'C') {
        displayValue = '0';
        clearDisplay();
    } else if(key === 'Backspace') {
        displayValue = handleBackspace();
    } else {
        if(key !== '=')
            button.focus();
        displayValue = handleOperatorInput(key);
    }

    lastKey = key;

    if(impossible) {
        clearDisplay();
    }

    display.textContent = displayValue;
    width = display.innerHTML.length;
}

function getButton(keyFromKeyboard) {
    let found;
    keys.forEach(key => {
        if(key.dataset.key === keyFromKeyboard) {
            found = key;
        }
        if(key.dataset.key === '=' && keyFromKeyboard === 'Enter')
            found = key;
    });

    return found;
}

function handleBackspace() {
    if(displayValue.length <= 1)
    {
        clearDisplay();
        return '0';

    }
    // Take off the last digit
    if(rVal) {
        rVal = rVal.slice(0, -1);
        return rVal;
    }
    else if(lVal) {
        lVal = lVal.slice(0, -1)
        return lVal;
    }
}

function handleNumberInput(key) {
    if(key === '0' && !lastKey) return displayValue;

    if(key === '.') {
        point.disabled = true;

        if(!lastKey || displayValue === '0') lVal = '0';
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

    if(lVal && rVal && !impossible) {
        lVal = calcAnswer();
        rVal = "";
        answer = lVal;
    } 

    operator = key;
    return answer.toString();
    
}

function calcAnswer() {
    let answer = operate(operator, parseFloat(lVal), parseFloat(rVal));

    // Don't let the answer length overflow
    if(impossible) return answer;

    let answerLength = answer;
    answerLength = Math.floor(answerLength).toString().length + 1;
    return parseFloat(answer.toFixed(maxWidth - answerLength)).toString();
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
}

function isKeyBoardEvent(key) {
    let regex = new RegExp("[0-9]|[+*\/-]|Enter|Backspace");
    if (key.match(regex)) {
        return true;
    } 
    
    return false;
    
}

function toggleRotate() {
    calculator.classList.toggle('rotate');
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