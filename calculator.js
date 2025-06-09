
let operandOne = null;
let operatorSymbol = null;
let operandTwo = null;

const buttonsArray = Array.from(document.querySelectorAll("button.calculator-button")).filter((item)=> item.value !== "=");
const screenDisplay = document.querySelector("div.calculator-screen p");
const clearButton = document.querySelector("button#calculator-clear-button");

clearButton.addEventListener("click", () => clearCalculatorScreen());


buttonsArray.map((item) => {
    item.addEventListener("click", (e) => {
        updateCalculatorScreen(e.currentTarget.value);
    })
})

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

function operate(operatorSymbol, operandOne, operandTwo){
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
    if(!typeof textValue === "number"){
        text = parseInt(textValue);
    }

    if(screenDisplay.textContent === "0.0"){
        screenDisplay.textContent = text;
    }
    else{
        screenDisplay.textContent += text;
    }

}

function clearCalculatorScreen(){
    screenDisplay.textContent = "0.0"
}