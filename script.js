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
let isOperatedOn = false;
let impossible = false;

function getInput() {
    let key = this.dataset.key;

    if(key === 'C') {
        this.blur();
        clearDisplay();
        return;
    }

    if(impossible) return;

    if(key === '=') {
        this.blur();
        
        displayValue = calcAnswer();
        
        isOperatedOn = false;
        operator = "";
        
        
    } else if(width === maxWidth) {
        return;
    } 
    else if(this.classList.contains('number')) {
        this.blur();
        // Work out if it's adding to the left side or right side
        if(operatorSelected()) {
            displayValue = "";
        }

        if(isOperatedOn) {
            // right side
            rVal += key;
        } else {
            lVal += key;
        }
        
        if(key === '.') {
            point.disabled = true;
            if(isOperatedOn && !displayValue) {
                displayValue = '0';
            }
        }

        if(displayValue === '0' && !point.disabled) {
            displayValue = key;
        } else {
            displayValue += key;
        }


        toggleSelected(key);
        
    }
    else if(this.classList.contains('operator')) {
        // Work out whether we need to do a calculation or not
        if(rVal)
            displayValue = calcAnswer();
        operator = key;
        isOperatedOn = true;
        point.disabled = false;
        toggleSelected(key);
    }

    display.textContent = displayValue;
    width = display.innerHTML.length;
}

function clearDisplay() {
    displayValue = "0";
    rVal = "";
    lVal = "";
    operator = "";
    display.textContent = displayValue;
    isOperatedOn = false;
    width = 0;
    impossible = false;
    point.disabled = false;
}

function calcAnswer() {
    let answer;

    if(!lVal) {
        return "0";
    }
    else if(!rVal) {
        // just return what we had before
        toggleSelected(-1);
        return displayValue;
    } else {
        answer = operate(operator, parseFloat(lVal), parseFloat(rVal));
    }

    if(impossible) return answer;
    
    lVal = answer;
    rVal = "";

    // Don't let the answer length overflow
    let answerLength = answer;
    answerLength = Math.floor(answerLength).toString().length + 1;
    return parseFloat(answer.toFixed(maxWidth - answerLength));
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