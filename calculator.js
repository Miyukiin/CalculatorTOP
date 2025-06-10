
const orderOfOperationsMap = {
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
}
const operatorsString = "*/+-";

let expressionString = null;
let rpnStack = [];
let resultFlag = false;
let result = null;
let operatorFlag = false;

const screenDisplay = document.querySelector("div.calculator-screen p");

const equalsButton = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value == "=");
equalsButton[0].addEventListener("click", () => evaluateExpression());

const clearButton = document.querySelector("button#calculator-clear-button");
clearButton.addEventListener("click", () => clearCalculatorScreen());

const backSpaceButton = document.querySelector("button#calculator-backspace-button");
backSpaceButton.addEventListener("click", () => backSpaceFunction())

const NumberButtonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value !== "=" && !operatorsString.includes(item.value));
NumberButtonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        checkOperatorFlagTrue();
        updateCalculatorScreen(e.currentTarget.value);
    })
})

const OperatorButtonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value !== "=" && operatorsString.includes(item.value));
OperatorButtonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        checkOperatorFlagFalse(() => updateCalculatorScreen(e.currentTarget.value));
    })
})

document.addEventListener("keydown", (e) => {
    switch(e.key){
        case "0":
            checkOperatorFlagTrue();
            updateCalculatorScreen("0");
            break;
        case "1":
            checkOperatorFlagTrue();
            updateCalculatorScreen("1");
            break;
        case "2":
            checkOperatorFlagTrue();
            updateCalculatorScreen("2");
            break;
        case "3":
            checkOperatorFlagTrue();
            updateCalculatorScreen("3");
            break;
        case "4":
            checkOperatorFlagTrue();
            updateCalculatorScreen("4");
            break;
        case "5":
            checkOperatorFlagTrue();
            updateCalculatorScreen("5");
            break;
        case "6":
            checkOperatorFlagTrue();
            updateCalculatorScreen("6");
            break;
        case "7":
            checkOperatorFlagTrue();
            updateCalculatorScreen("7");
            break;
        case "8":
            checkOperatorFlagTrue();
            updateCalculatorScreen("8");
            break;
        case "9":
            checkOperatorFlagTrue();
            updateCalculatorScreen("9");
            break;
        case "*":
            checkOperatorFlagFalse(() => updateCalculatorScreen("*"));
            break;
        case "-":
            checkOperatorFlagFalse(() => updateCalculatorScreen("-"));
            break;
        case "+":
            checkOperatorFlagFalse(() => updateCalculatorScreen("+"));
            break;
        case "/":
            checkOperatorFlagFalse(() => updateCalculatorScreen("/"));
            break;
        case "=":
            evaluateExpression();
            break;
        case ".":
            updateCalculatorScreen(".");
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
            return divide(operandOne, operandTwo)
        default:
            return "Invalid operator."
    }
}

// Utility Functions
function checkOperatorFlagTrue(arrowFunction){
    if(operatorFlag === true){
        if(typeof arrowFunction === "function"){
            arrowFunction();
        }
        operatorFlag = false;
    }
}

function checkOperatorFlagFalse(arrowFunction){
    if(operatorFlag === false){
        if(typeof arrowFunction === "function"){
            arrowFunction();
        }
        operatorFlag = true;
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
    resultFlag = false;
    result = null;
    operatorFlag = false;
}

function updateCalculatorScreen(textValue){
    let text = textValue

    if(!typeof textValue === "number" && resultFlag == false){
        text = parseFloat(textValue);
    }
    else if(resultFlag==true){
        text = " = " + result
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
    // Default number is already displayed.
    if(screenDisplay.textContent == "0.0"){
        return;
    }
    let text = screenDisplay.textContent;
    screenDisplay.textContent = text.slice(0, text.length - 1);
    console.log(screenDisplay);

    // Handle cases where we backspace an operator. Allows operators to be inputted again.
    if(operatorsString.includes(text[text.length - 1])){
        checkOperatorFlagTrue();
    }
    // If the are no more characters, call clearCalculatorScreen.
    if(screenDisplay.textContent == ""){
        clearCalculatorScreen();
    }
}

function evaluateExpression(){
    rpnStack = createRPNStack(screenDisplay.textContent);
    result = evaluateRPNStack(rpnStack);
    if(result){
        resultFlag = true;
    }
    else{
        return "ERROR: CANNOT OBTAIN RESULT."
    }
    updateCalculatorScreen(result);
}