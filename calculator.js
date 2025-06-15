/*
To do:
    1. Consecutive decimal handling. -> check
    2. Single decimal per operand rule. -> Check
    3. Refresh everything after result evaluation and user input. -> Check
    4. Division by zero error. -> Check
    5. Disable consecutive equals operation. -> Check
    6. Single operand evaluation.

*/
const orderOfOperationsMap = {
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
}
const operatorsString = "*/+-";

let expressionString = null;
let rpnStack = [];
let resultFlag ={value:false};
let result = null;
let operatorFlag = {value:false}; // Enables pass by reference for checkFlagTrue/ checkFlagFalse functions.
let decimalFlag = {value:true}; // Initially true, prevent decimal as first input.
let decimalInOperandFlag = {value:false};

const screenDisplay = document.querySelector("div.calculator-screen p");

const equalsButton = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value == "=");
equalsButton[0].addEventListener("click", () => checkFlagFalse(resultFlag, () => evaluateExpression()));

const clearButton = document.querySelector("button#calculator-clear-button");
clearButton.addEventListener("click", () => clearCalculatorScreen());

const backSpaceButton = document.querySelector("button#calculator-backspace-button");
backSpaceButton.addEventListener("click", () => backSpaceFunction())

const NumberButtonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> !"=.".includes(item.value) && !operatorsString.includes(item.value));
NumberButtonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        checkFlagTrue(operatorFlag);
        if(decimalInOperandFlag.value === false){
            checkFlagTrue(decimalFlag);
        }
        updateCalculatorScreen(e.currentTarget.value);
    })
})

const OperatorButtonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value !== "=" && operatorsString.includes(item.value));
OperatorButtonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        checkFlagFalse(operatorFlag,() => updateCalculatorScreen(e.currentTarget.value));
    })
})

const decimalButton = Array.from(document.querySelectorAll("button.calculator-button")).filter((item) => item.value === ".");
decimalButton[0].addEventListener("click", (e) =>{
    checkFlagFalse(decimalFlag, () => updateCalculatorScreen(e.currentTarget.value));
})

document.addEventListener("keydown", (e) => {
    switch(e.key){
        case "0":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("0");
            break;
        case "1":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("1");
            break;
        case "2":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("2");
            break;
        case "3":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("3");
            break;
        case "4":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("4");
            break;
        case "5":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("5");
            break;
        case "6":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("6");
            break;
        case "7":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("7");
            break;
        case "8":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("8");
            break;
        case "9":
            checkFlagTrue(operatorFlag);
            updateCalculatorScreen("9");
            break;
        case "*":
            checkFlagFalse(operatorFlag,() => updateCalculatorScreen("*"));
            break;
        case "-":
            checkFlagFalse(operatorFlag,() => updateCalculatorScreen("-"));
            break;
        case "+":
            checkFlagFalse(operatorFlag,() => updateCalculatorScreen("+"));
            break;
        case "/":
            checkFlagFalse(operatorFlag,() => updateCalculatorScreen("/"));
            break;
        case "=":
            checkFlagFalse(resultFlag,() => evaluateExpression());
            break;
        case ".":
            checkFlagFalse(decimalFlag,() => updateCalculatorScreen("."));
            break;
        case "Backspace":
            backSpaceFunction();
            break;
        default:
            return;

    }
})

// Functions 
function add(a,b){
    return a+b;
}

function subtract(a,b){
    return a-b;
}

function multiply(a,b){
    return a*b;
}

function divide(a,b){
    return a/b;
}

function createRPNStack(string){
    let arrayOfCharacters = string.split("")
    let operandToken = null;
    let outputQueue = [];
    let operatorStack = [];

    // Shunting Yard Algorithm. Tailored for */-+ operators. "32+4*5" ["3", "2", "+", "4", "*", "5"] -> ['32', '4', '56', '*', '+']
    for(let i=0;i<arrayOfCharacters.length;i++){
        // if char is not an operator and would be a number || is a period then this is an operand lexeme.
        if((!operatorsString.includes(arrayOfCharacters[i]) && !isNaN(parseInt(arrayOfCharacters[i])) || arrayOfCharacters[i] == ".")){
            // Handle the case of the last operandToken.
            if(i == arrayOfCharacters.length - 1){
                // Handle last operandLexeme is a single digit.
                operandToken == null ? operandToken = arrayOfCharacters[i] : operandToken += arrayOfCharacters[i];
                outputQueue.push(operandToken);
                operandToken = null;
            }
            // If operand is null, assign current char to operand One. To avoid implicit conversion of null as a result of null + string operation.
            else if (operandToken == null){
                operandToken = arrayOfCharacters[i];
                continue;
            }
            // Default case, just append the current char to the operandToken.
            else{
                operandToken += arrayOfCharacters[i];
            }
        }
        // Check if character is an operator.
        else if(operatorsString.includes(arrayOfCharacters[i])){
            // Push operand token to the output queue and reset.
            outputQueue.push(operandToken);
            operandToken = null;

            // While operatorStack is not empty, and there is an operator in the operatorStack with a higher or equal precedence.
            // This ensures that higher precedence operators are evaluated first.
            while(!operatorStack.length == 0 && getPrecedence(arrayOfCharacters[i]) <= getPrecedence(peekStack(operatorStack))){
                outputQueue.push(operatorStack.pop());
            }

            // Push the operator to the operatorStack.
            operatorStack.push(arrayOfCharacters[i]);
        }
    }
    
    // If there are no more tokens to be processed, construct final rpnStack;
    while(!operatorStack.length == 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}


function evaluateRPNStack(rpnStack){
    let operandStack = [];
    let operandOne = null;
    let operandTwo = null;
    let result = null;
    
    while (rpnStack.length !== 0){
        // Check if stack item is a number and rpnStack length is > 1, if so, push to operandStack.
        if(!isNaN(parseFloat(rpnStack[0])) && rpnStack.length > 1){
            operandStack.push(rpnStack.shift());
            continue;
        }

        // Handle case where the number is the last one in the stack.
        else if(!isNaN(parseFloat(rpnStack[0])) && rpnStack.length == 1){
            return result;
        }
        else{
            // Pop the last two as operandTwo and operandOne respectively, and get operator.
            operandTwo = parseFloat(operandStack.pop());
            operandOne = parseFloat(operandStack.pop());
            operatorSymbol = rpnStack[0];
            // Remove Operator from the rpnStack
            rpnStack.shift()
            // Evaluate, and add back the result to the rpnStack
            result = operate(operandOne, operatorSymbol, operandTwo);
            if (result === "Division Error" || result === "Invalid Operator"){
                return result;
            }
            rpnStack.unshift(String(result));
        }
    }
}

function operate(operandOne, operatorSymbol, operandTwo){
    switch(operatorSymbol){
        case("+"):
            return add(operandOne, operandTwo)
        case("-"):
            return subtract(operandOne, operandTwo)
        case("*"):
            return multiply(operandOne, operandTwo)
        case("/"):
            return operandTwo === 0.0 && operatorSymbol === "/" ? "Division Error" : divide(operandOne, operandTwo);
        default:
            return "Invalid operator"
    }
}

// Utility Functions
function checkFlagTrue(flag){
    if(flag.value === true){
        flag.value = false;
    }
}

function checkFlagFalse(flag, arrowFunction){
    // Prevent multiple decimal points in a single operand value.
    if (flag === decimalFlag && decimalInOperandFlag.value === true){
        return;
    }

    if(flag.value === false){
        if(typeof arrowFunction === "function"){
            arrowFunction();
            // Set decimalInOperandFlag value to true after successful decimal input, and false after successful operator input.
            if (flag === decimalFlag){
                decimalInOperandFlag.value = true;
            }
            else if(flag === operatorFlag && decimalInOperandFlag.value === true){
                decimalInOperandFlag.value = false;
                decimalFlag.value = true; // Prevent immediate decimal input after an operator.
            }
        }
        flag.value = true;
    }
}

function peekStack(stack){
    return stack[stack.length - 1];
}

function getPrecedence(char){
    return operatorsString.includes(char) ? orderOfOperationsMap[char] : -1;
}

function resetVariables(){
    expressionString = null;
    rpnStack = [];
    result = null;
    operatorFlag.value = false;
    decimalFlag.value = true;
    decimalInOperandFlag.value = false;
}

function updateCalculatorScreen(textValue){
    let text = textValue

    if(!typeof parseFloat(textValue) === "number" && resultFlag.value == false){
        text = parseFloat(textValue);
    }
    else if(textValue === "Division Error" || textValue === "Invalid Operator"){
        screenDisplay.textContent = textValue;
        resultFlag.value = true;
        resetVariables();
        return;
    }
    else if(resultFlag.value===true){
        // User inputs after a previous result evaluation.
        if(result === null){
            text ? screenDisplay.textContent = text : screenDisplay.textContent = "0.0";
            resultFlag.value = false;
            return;
        }
        text = " = " + result;
        resetVariables();
    }

    if(screenDisplay.textContent === "0.0"){
        screenDisplay.textContent = text;
    }
    else{
        screenDisplay.textContent += text;
    }

}

function clearCalculatorScreen(){
    screenDisplay.textContent = "0.0";
    resetVariables();
}

function backSpaceFunction(){
    if (resultFlag.value === true){
        updateCalculatorScreen()
    }

    // Default number is already displayed.
    if(screenDisplay.textContent == "0.0"){
        return;
    }
    let text = screenDisplay.textContent;
    screenDisplay.textContent = text.slice(0, text.length - 1);

    // Handle cases where we backspace an operator. Allows operators to be inputted again.
    if(operatorsString.includes(text[text.length - 1])){
        checkFlagTrue(operatorFlag);
    }

    // Handle cases where we backspace a decimal within an operand.
    if(".".includes(text[text.length - 1])){
        checkFlagTrue(decimalFlag);
        decimalInOperandFlag.value = false;
    }

    // If the are no more characters, call clearCalculatorScreen.
    if(screenDisplay.textContent == ""){
        clearCalculatorScreen();
    }
}

function evaluateExpression(){
    rpnStack = createRPNStack(screenDisplay.textContent);
    result = evaluateRPNStack(rpnStack);
    if(result && (result !== "Division Error" && result !== "Invalid Operator")){
        resultFlag.value = true;
    }
    updateCalculatorScreen(result);
}