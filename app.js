
let inputBox1 = document.getElementById('inputBox1')
let inputBox2 = document.getElementById('inputBox2')
let buttons = document.querySelectorAll('button')

let expression = ''
let value = ''
let history = []
let historyCount = 0

 //---------------------- Adding click event listener -----------------------

buttons.forEach(element =>{
    element.addEventListener('click', (e)=>{
        if(e.target.innerText == '='){
            handleEqual();
        }
        else if (e.target.innerText == 'AC'){
            handleErase();
        }
        else if(e.target.innerText == 'C'){
            handleDelete();
        }
        else if(e.target.id == 'history'){
            handleHistory();
        }
        else{
            handleInput(e);
        }
    })
})

//--------------------------- Event Handlers -------------------------------

function handleEqual(){
    try{
        value = String(evaluateExpression(expression))
        inputBox2.value = value;
        history.push({
            express : expression,
            val : value
        })
    }
    catch(err){
        // console.log(err);
        inputBox1.value = err.message;
        inputBox2.value = "Error";
    }
}

function handleErase(){
    expression = ''
    value = ''
    inputBox1.value = expression;
    inputBox2.value = value;
}

function handleDelete(){
    expression = expression.substring(0,expression.length-1)
    inputBox1.value = expression;
    inputBox2.value = expression;
}

function handleInput(e){
    expression += e.target.innerText
    inputBox1.value = expression;
    inputBox2.value = expression;
    historyCount = history.length;   //reset history count 
}


//------------------------------- Show calculation history ----------------------------

function handleHistory() {
    if(historyCount == 0){
        console.log("End");
        inputBox1.value = "End";
        inputBox2.value = "End";
        return
    }
    // console.log(history);
    let obj  = history[historyCount-1];
    historyCount--;
    // console.log(obj);
    inputBox1.value = "←  " + obj.express;
    inputBox2.value = obj.val;
}


//------------------------------ Adding  key event listener --------------------------

window.addEventListener("keydown", (e) => {
    
    if (e.key === "x") {
      clickOperation("*");
    } else if (e.key == "Enter" || e.key === "=") {
        clickOperation("=");
    }
    else if (e.key == "Backspace") {
        clickOperation("C");
    }
    else if (e.key == "Delete") {
        clickOperation("AC");
    }
    else if (e.key == "H" || e.key == 'h') {
        clickOperation("H");
    }
    else{
        clickOperation(e.key);
    }
  });


function clickOperation(key) {
    buttons.forEach((operation) => {
      if (operation.innerText === key) {
        operation.click();
      }
    });
}
  

//--------------------------------- Adding the evaluate function --------------------------------

function isNumber(char) {
    return /\d|\./.test(char);
}

function isOperator(char) {
    return /\+|\-|\*|\//.test(char);
}

function precedence(operator) {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        default:
            return 0;
    }
}

function isValidFloat(value) {
    var floatValue = parseFloat(value);
    return !isNaN(floatValue) && typeof floatValue === 'number';
}

function applyOperator(operator, b, a) {
    if(!isValidFloat(a) || !isValidFloat(b) || !isOperator(operator)){  
        throw new Error("Invalid expression");    // validating the operands
    }
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b !== 0) {
                return a / b;
            } else {
                throw new Error("Division by zero");
            }
        default:
            throw new Error("Invalid expression");
    }
}

function formatDecimalWithoutZeros(number) {
    var formattedNumber = Number(number).toFixed(6);
    formattedNumber = formattedNumber.replace(/\.?0+$/, '');
    return formattedNumber.toString();
}

function evaluateExpression(expression) {
    let stack = [];
    let operators = [];
    let variable = ""
    let hasDot = false;
    
    for (let char of expression) {
        if(char == '.'){
            if(hasDot) throw new Error("Invalid expression")  // handlimg 
            hasDot = true;
        }
        if (isNumber(char)) {
            variable += char;
        } 
        else if (isOperator(char)) {
            stack.push(parseFloat(variable));
            variable = "";                      // reset the operand value
            hasDot = false;
            while (operators.length > 0 && precedence(operators[operators.length - 1]) >= precedence(char)) {
                stack.push(applyOperator(operators.pop(), stack.pop(), stack.pop()));
            }
            operators.push(char);
        }
    }

    if(variable != "") stack.push(parseFloat(variable));
    while (operators.length > 0) {
        stack.push(applyOperator(operators.pop(), stack.pop(), stack.pop()));
    }

    return formatDecimalWithoutZeros(stack[0]);
}
