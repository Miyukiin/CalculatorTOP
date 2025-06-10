
let operandOne = null;
let operatorSymbol = null;
let operandTwo = null;


const orderOfOperationsMap = {
    "*": 1,
    "/": 2,
    "+": 3,
    "-": 4,
}
const operatorsString = "*/+-";

let expressionString = null;
let expressionStack = [];
let resultFlag = false;
let result = null;

const screenDisplay = document.querySelector("div.calculator-screen p");

const equalsButton = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value == "=");
equalsButton[0].addEventListener("click", () => {
    preProcessExpression(screenDisplay.textContent);
    result = operate(parseInt(operandOne), operatorSymbol, parseInt(operandTwo));
    if(result){
        resultFlag = true;
    }
    else{
        return "ERROR: CANNOT OBTAIN RESULT."
    }
    updateCalculatorScreen(result);
});

const clearButton = document.querySelector("button#calculator-clear-button");
clearButton.addEventListener("click", () => clearCalculatorScreen());

const buttonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value !== "=");
buttonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        updateCalculatorScreen(e.currentTarget.value);
    })
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
        text = parseInt(textValue);
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

function resetVariables(){
    operandOne = null;
    operandTwo = null;
    operatorSymbol = null;
    expressionString = null;
    result = null;
    resultFlag = false;
}

function clearCalculatorScreen(){
    screenDisplay.textContent = "0.0";
    resetVariables();
}

function preProcessExpression(string){
    let arrayOfCharacters = string.split("")
    console.log(arrayOfCharacters);

    for(let i=0;i<arrayOfCharacters.length;i++){
        if(!operatorsString.includes(arrayOfCharacters[i]) && operatorSymbol === null){
            if (operandOne == null){
                operandOne = arrayOfCharacters[i];
                continue;
            }
            operandOne += arrayOfCharacters[i];

        }
        else if (!operatorsString.includes(arrayOfCharacters[i]) && operatorSymbol !== null){
            if (operandTwo == null){
                operandTwo = arrayOfCharacters[i];
                continue;
            }
            operandTwo += arrayOfCharacters[i];
        }
        else{
            operatorSymbol = arrayOfCharacters[i];
        }
    }
}