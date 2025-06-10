
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

const screenDisplay = document.querySelector("div.calculator-screen p");

const equalsButton = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value == "=");
equalsButton[0].addEventListener("click", () => evaluateExpression());

const clearButton = document.querySelector("button#calculator-clear-button");
clearButton.addEventListener("click", () => clearCalculatorScreen());

const buttonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value !== "=");
buttonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        updateCalculatorScreen(e.currentTarget.value);
    })
})

document.addEventListener("keydown", (e) => {
    switch(e.key){
        case "0":
            updateCalculatorScreen("0");
            break;
        case "1":
            updateCalculatorScreen("1");
            break;
        case "2":
            updateCalculatorScreen("2");
            break;
        case "3":
            updateCalculatorScreen("3");
            break;
        case "4":
            updateCalculatorScreen("4");
            break;
        case "5":
            updateCalculatorScreen("5");
            break;
        case "6":
            updateCalculatorScreen("6");
            break;
        case "7":
            updateCalculatorScreen("7");
            break;
        case "8":
            updateCalculatorScreen("8");
            break;
        case "9":
            updateCalculatorScreen("9");
            break;
        case "*":
            updateCalculatorScreen("*");
            break;
        case "-":
            updateCalculatorScreen("-");
            break;
        case "+":
            updateCalculatorScreen("+");
            break;
        case "/":
            updateCalculatorScreen("/");
            break;
        case "=":
            evaluateExpression();
            break;
        case ".":
            updateCalculatorScreen(".");
            break;
        default:
            return;

    }
})

// Functions 

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

function createRPNStack(string){
    let arrayOfCharacters = string.split("")
    let operandToken = null;
    let outputQueue = [];
    let operatorStack = [];

    // Shunting Yard Algorithm. Tailored for */-+ operators. "32+4*5" ["3", "2", "+", "4", "*", "5"] -> ['32', '4', '56', '*', '+']
    for(let i=0;i<arrayOfCharacters.length;i++){
        // Check is not an operator, and would be a number. If so, this is an operand lexeme.
        if(!operatorsString.includes(arrayOfCharacters[i]) && !isNaN(parseInt(arrayOfCharacters[i]))){
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

// Utility Functions

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
}

function clearCalculatorScreen(){
    screenDisplay.textContent = "0.0";
    resetVariables();
}