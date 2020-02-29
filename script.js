const keys = document.querySelectorAll('[data-key]');
const operators = document.querySelectorAll('.operator');
const point = document.querySelector('[data-key="."]');
const displayInput = document.querySelector('.input');
const displayEquation = document.querySelector('.equation');
const body = document.querySelector('body');
const rotateButton = document.querySelector('.rotate-button');
const calculator = document.querySelector('.calculator');

keys.forEach(key => key.addEventListener('click', getInput));
body.addEventListener('keydown', getInput);
rotateButton.addEventListener('click', toggleRotate);

const maxWidth = 13;
let input = "0";
let equation = "";
let impossible = false;
let lastKey;
const tokens = [];
let numVal = "";
let opVal = "";

function getInput(e) {

    let key;
    let button;

    let inputWidth = displayInput.innerHTML.length;
    let equationWidth = displayEquation.innerHTML.length * 0.4;
    
    // Is input keyboard or click?
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

    if(key === 'C') {
        clearDisplay();
    }
    else if (key === 'Backspace' && !impossible) {
        handleBackspace();
    }
    // Don't allow any input if the length of the equation is too long, or if we've divided by zero
    else if(impossible || equationWidth > maxWidth) {
        return;
    } else if (button.classList.contains('number')) {
        
        // Handle number input
        if(key === '.') {
            point.disabled = true;
            if(!numVal) {
                numVal = '0';
                equation = '0';
            }
        }
        
        // Build the number up, if valid
        if(inputWidth < maxWidth || opVal) {
            numVal += key;
            equation += key;
        }

        // Restart after =
        if(lastKey === '=') {
            numVal = key;
            equation = key;
        }

        // Finished building the number, push it to the tokens queue
        if(opVal) {
            tokens.push(opVal);
            opVal = "";
        }

        input = numVal;

    } else if (button.classList.contains('operator')) {
        
        if(opVal) {
            // Hit another operator after an existing operator - delete it and replace with the new one
            opVal = key;
            equation = equation.slice(0, -1);
            equation += key;
        }
        
        // Valid operator, push it to the tokens queue
        if(numVal) {
            tokens.push(parseFloat(numVal));
            numVal = "";
            equation += key;
            opVal = key;
        }

        // Perform the calculation
        if(key === '=') {
            numVal = shuntingYard();
            equation = numVal;
            input = numVal;
            opVal = "";
        }
    }

    if(key != 'Backspace') {
        lastKey = key;
    }

    displayEquation.textContent = equation;
    displayInput.textContent = input;

   
}

/*
 Convert the equation to Reverse Polish Notation (Dijkstra's shunting yard algorithm): 
     * All numbers are pushed to the queue when they are read.
     * At the end of reading the expression, pop all operators off the stack and onto the queue.
*/
function shuntingYard() {
    let queue = [];
    let stack = [];

    for(let i = 0; i < tokens.length; i++) {
        let currToken = tokens[i];
        if(isOperator(currToken)) {
            // Find the operator with highest precedence and put it on top of the queue
            let topOfStack = peek(stack);
            while(topOfStack && (precedence[currToken] <= precedence[topOfStack])) {
                queue.push(topOfStack);
                stack.pop();
                topOfStack = peek(stack);
            }
            stack.push(currToken);
        } else {
            // Push number to queue
            queue.push(currToken);
        }
    }

    // Push any remaining operators onto the queue
    while(stack.length) {
        queue.push(stack.pop());
    }

    return calc(queue);
}

const precedence = { '*' : 2,  '/' : 2,  '+' : 1,  '-' : 1 };

function peek(arr) {
    return arr.slice(-1)[0];
}

/* Evaluate our RPN array - push the tokens onto a stack until we find an operator, 
then pop the last 2 elements from the stack and perform the operation on them.
Push the result onto the stack and repeat until only the final answer remains. 
*/
function calc(rpn) {
    let stack = [];
    let answer;
    for(let i = 0; i < rpn.length; i++) {
        if(!isOperator(rpn[i])) {
            stack.push(rpn[i]);
        } else {
            let rhs = stack.pop();
            let lhs = stack.pop();
            let calc = operate(rpn[i], parseFloat(lhs), parseFloat(rhs));
            stack.push(calc);
        }
    }
    answer = stack.pop();
    tokens.length = 0;
    tokens.push(answer);
    return trim(answer);
}

function trim(answer) {
    // Make sure the answer doesn't overflow the screen
    let answerLength = answer;
    answerLength = Math.floor(answerLength).toString().length;
    let fixedPoints = maxWidth - answerLength;
    if(fixedPoints < 0)
        fixedPoints = maxWidth - 4;
    return parseFloat(answer.toPrecision(fixedPoints)).toString();
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

// Backspace only deletes numbers
function handleBackspace() {
    if(isNumber(lastKey) || lastKey === '.') {
        input = input.slice(0, -1);
        if(!input) input = '0';
        numVal = numVal.slice(0, -1);
        if (!numVal) numVal = "";
        equation = equation.slice(0, -1);

        if(lastKey === '.')
            point.disabled = false;
    }
}

function isOperator(key) {
    if(key === '+' || key === '-' || key === '/' || key === '*') return true;

    return false;
}

function isNumber(key) {
    if(Number(key)) {
        return true;
    }
    return false;
}

function clearDisplay() {
    impossible = false;
    point.disabled = false;
    lastKey = "";
    tokens.length = 0;
    numVal = "";
    opVal = "";
    equation = "";
    input = '0';
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