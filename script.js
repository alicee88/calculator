const keys = document.querySelectorAll('[data-key]');
const operators = document.querySelectorAll('.operator');
const point = document.querySelector('[data-key="."]');
const display = document.querySelector('.answer');
keys.forEach(key => key.addEventListener('click', getInput));

const maxWidth = 20;
let width = 0;
let displayValue = "";
let rVal = "";
let lVal = "";
let operator = "";
let isOperatedOn = false;
let impossible = false;

function getInput() {
    let key = this.dataset.key;

    if(key === 'C') {
        clearDisplay();
        return;
    }

    if(impossible) return;

    if(key === '=') {
        displayValue = calcAnswer();
        isOperatedOn = false;
        operator = "";
        
    } else if(width === maxWidth) {
        return;
    } 
    else if(this.classList.contains('number')) {
        // Work out if it's adding to the left side or right side
        if(operatorSelected()) {
            displayValue = "";
            console.log("OPERATOR SELECTED");
        }

        if(isOperatedOn) {
            // right side
            rVal += key;
        } else {
            lVal += key;
        }
        displayValue += key;

        if(key === '.') {
            point.disabled = true;
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
    displayValue = "";
    rVal = "";
    lVal = "";
    operator = "";
    display.textContent = "";
    isOperatedOn = false;
    width = 0;
    impossible = false;
    point.disabled = false;
}

function calcAnswer() {
    let answer = operate(operator, parseFloat(lVal), parseFloat(rVal));

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
                return 'Dividing by zero is impossible';
            }
            else
                return divide(a, b);
        }
        default:
            return 'Operator not recognized';
    }
}