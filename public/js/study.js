

const yes1 = document.querySelector('#yes1')


const audioTis1 = document.querySelector('#audioTis1')
const audioQ1 = document.querySelector('#audioQ1')
const audioN1 = document.querySelector('#audioN1')

const audioTis2 = document.querySelector('#audioTis2')
const audioQ2 = document.querySelector('#audioQ2')
const audioN2 = document.querySelector('#audioN2')

const audioTis3 = document.querySelector('#audioTis3')
const audioQ3 = document.querySelector('#audioQ3')
const audioN3 = document.querySelector('#audioN3')

const audioTis4 = document.querySelector('#audioTis4')
const audioQ4 = document.querySelector('#audioQ4')
const audioN4 = document.querySelector('#audioN4')

const audioTis5 = document.querySelector('#audioTis5')
const audioQ5 = document.querySelector('#audioQ5')
const audioN5 = document.querySelector('#audioN5')

const audioTis6 = document.querySelector('#audioTis6')
const audioQ6 = document.querySelector('#audioQ6')
const audioN6 = document.querySelector('#audioN6')

const audioTis7 = document.querySelector('#audioTis7')
const audioQ7 = document.querySelector('#audioQ7')
const audioN7 = document.querySelector('#audioN7')

const audioTis8 = document.querySelector('#audioTis8')
const audioQ8 = document.querySelector('#audioQ8')
const audioN8 = document.querySelector('#audioN8')

const audioTis9 = document.querySelector('#audioTis9')
const audioQ9 = document.querySelector('#audioQ9')
const audioN9 = document.querySelector('#audioN9')

const audioTis10 = document.querySelector('#audioTis10')
const audioQ10 = document.querySelector('#audioQ10')
const audioN10 = document.querySelector('#audioN10')

const audioTis11 = document.querySelector('#audioTis11')
const audioQ11 = document.querySelector('#audioQ11')
const audioN11 = document.querySelector('#audioN11')

const audioTis12 = document.querySelector('#audioTis12')
const audioQ12 = document.querySelector('#audioQ12')
const audioN12 = document.querySelector('#audioN12')

function MakeVocabWord(done,correctAnswer,gotWrong,introduction,responseN,question,visual){
    this.done = done
    this.correctAnswer = correctAnswer
    this.gotWrong = gotWrong
    this.introduction = introduction
    this.responseN = responseN
    this.question = question
    this.visual = visual
};

let wOne = new MakeVocabWord(false,false,false,audioTis1,audioN1,audioQ1,document.querySelector('#A1'));
let wTwo = new MakeVocabWord(false,false,false,audioTis2,audioN2,audioQ2,document.querySelector('#A2'));
let wThree = new MakeVocabWord(false,false,false,audioTis3,audioN3,audioQ3,document.querySelector('#A3'));
let wFour = new MakeVocabWord(false,false,false, audioTis4,audioN4,audioQ4,document.querySelector('#A4'));
let wFive = new MakeVocabWord(false,false,false,audioTis5,audioN5,audioQ5,document.querySelector('#A5'));
let wSix = new MakeVocabWord(false,false,false,audioTis6,audioN6,audioQ6,document.querySelector('#A6'));
let wSeven = new MakeVocabWord(false,false,false,audioTis7,audioN7,audioQ7,document.querySelector('#A7'));
let wEight = new MakeVocabWord(false,false,false,audioTis8,audioN8,audioQ8,document.querySelector('#A8'));
let wNine = new MakeVocabWord(false,false,false,audioTis9,audioN9,audioQ9,document.querySelector('#A9'));
let wTen = new MakeVocabWord(false,false,false,audioTis10,audioN10,audioQ10,document.querySelector('#A10'));
let wEleven = new MakeVocabWord(false,false,false,audioTis11,audioN11,audioQ11,document.querySelector('#A11'));
let wTwelve = new MakeVocabWord(false,false,false,audioTis12,audioN12,audioQ12,document.querySelector('#A12'));



let engine = {}
    engine.theDozen = [wOne, wTwo, wThree, wFour, wFive, wSix, wSeven, wEight, wNine, wTen, wEleven, wTwelve]
    engine.toIntroduce = [wOne, wTwo, wThree, wFour, wFive, wSix, wSeven, wEight, wNine, wTen, wEleven, wTwelve]
    engine.newWord = engine.toIntroduce[0] //The word being introcuded for the first time.
    engine.introduced = [] //The array of vocabWords that has already been introduced.
    engine.questionList = []
    engine.currentQuestion = engine.questionList[0] //The vocabword that is the correct answer to the most recent question.
    engine.lastTwo = [engine.introduced[0], engine.introduced[1]]
    engine.introductions = function(){
        
        introduceNewWord()
        
        function introduceNewWord (){
           
            engine.newWord.visual.classList.toggle('selected')
            engine.newWord.visual.style.display = 'block'
            engine.newWord.introduction.play()
            engine.newWord.introduction.addEventListener('ended', reset)
           
        }

            function reset(){
                resetStart(conditional)
            
                function conditional(){
                if (engine.introduced.length === 1 ) { 
                    introduceNewWord()
                }else{
                    let visualArrray = engine.introduced.map(element => element.visual)
                    visualArrray.forEach(element => {element.addEventListener('click', engine.evaluateResponse)})
                    engine.makeQuestionList()
                    //(engine.questionList.length)
                    engine.askQuestion()    
                }}

                function resetStart(callback){
                engine.newWord.visual.classList.toggle('selected')
                engine.newWord.introduction.removeEventListener('ended', reset)
                let word = engine.toIntroduce.shift()
                engine.introduced.unshift(word)
                engine.newWord = engine.toIntroduce[0]
                callback()}
                }}
   
    engine.makeQuestionList = function(){
        let tempArray = [] //This array is to be used create a copy of the array engine.introduced
        engine.questionList = []
        if (engine.introduced.length < 8) {
            engine.introduced.forEach(element =>{tempArray.push(element)}) //This copies engine.introduced into tempArray
             for (i = tempArray.length; i>0; i--) { //This iterates through tempArray, randamly removing an element and pushing it into questionList
            let randomElement = engine.makeRandomElement(tempArray)
            engine.questionList.push(randomElement)}
        }else{ 
            let tempArray2 =[]
            engine.introduced.forEach(element =>{tempArray.push(element)}) //This copies engine.introduced into tempArray
            for (i = 0; i<4; i++){ //this moves the 4 most recent elements into tempArray2
                tempArray2.push(tempArray.pop())}
                //engine.introduced.forEach(element =>{tempArray.push(element)})
           for (i=0; i<4; i++){
                let randomElement = engine.makeRandomElement(tempArray)
                tempArray2.push(randomElement)}
            for (i = tempArray2.length; i>0; i--) {
                let randomElement = engine.makeRandomElement(tempArray2)
                engine.questionList.push(randomElement)}}

        if (engine.introduced.length > 7){
            engine.lastTwo = [engine.introduced[0], engine.introduced[1]]
            randomIndex = engine.makeRandomIndex(engine.questionList)
            randomIndex2 = engine.makeRandomIndex(engine.questionList)
            console.log(randomIndex)
            console.log(randomIndex2)
            engine.questionList.splice(randomIndex, 0, engine.lastTwo[0])
            engine.questionList.splice(randomIndex2, 0, engine.lastTwo[1])
            console.log(engine.questionList)
        }else if(engine.introduced.length > 5){
            console.log('3')
            engine.lastTwo = [engine.introduced[0], engine.introduced[1]]
            randomIndex = engine.makeRandomIndex(engine.questionList)
            randomIndex2 = engine.makeRandomIndex(engine.questionList)
            console.log(randomIndex)
            console.log(randomIndex2)
            engine.questionList.splice(randomIndex, 0, engine.lastTwo[0])
            engine.questionList.splice(randomIndex2, 0, engine.lastTwo[1])
        }else if(engine.introduced.length > 3){
            let randomIndex = engine.makeRandomIndex(engine.questionList)
            let randomIndex2 
            let randElement
            if (randomIndex === 0) {
                let elementArray = [2,3,4]
                randElement =engine.makeRandomIndex(elementArray)
                randomIndex2 = elementArray[randElement]
            } else if (randomIndex === 1){
                let elementArray = [0,3,4]
                randElement =engine.makeRandomIndex(elementArray)
                randomIndex2 = elementArray[randElement]
            }else if (randomIndex === 2){
                let elementArray = [0,1,4]
                randElement =engine.makeRandomIndex(elementArray)
                randomIndex2 = elementArray[randElement]
            }else if (randomIndex === 3){
                let elementArray = [0,1,2]
                randElement =engine.makeRandomIndex(elementArray)
                randomIndex2 = elementArray[randElement]
            }else{
                let elementArray = [0,1,4]
                randElement = engine.makeRandomIndex(elementArray)
                randomIndex2 = elementArray[randElement]
            }
            engine.questionList.splice(randomIndex2, 0, engine.questionList[randomIndex])
            //let randomElement = engine.questionList[randomIndex]
           
            }}

    engine.makeRandomIndex = function(arr){
            return Math.floor(Math.random() * arr.length)
            }

    engine.makeRandomElement = function(arr){ //randomly removes an element from an array then returns that element
            let newArray = arr.splice(engine.makeRandomIndex(arr), 1);
            return newArray[0]
            }
    //engine.rmvAndRtnRandElement = function(arr)
    engine.reviewAll = function(){
        let tempArray = []
        engine.theDozen.forEach(element =>{tempArray.push(element)})
        for (i = tempArray.length; i>0; i--) {
            let randomElement = engine.makeRandomElement(tempArray)
            engine.questionList.push(randomElement)}
        engine.theDozen.forEach(element =>{tempArray.push(element)})
        tempArray.forEach(element =>{engine.questionList.splice(engine.makeRandomIndex(engine.questionList), 0, element)})
        makeVisibleAll()
        engine.askQuestion()
        function makeVisibleAll(){
            engine.theDozen.forEach(element => {
                element.visual.style.display = 'block'
               // element.visual.addEventListener('click', engine.evaluateResponse)
            });
            let visualArrray = engine.theDozen.map(element => element.visual)
            visualArrray.forEach(element => {element.addEventListener('click', engine.evaluateResponse)})}
        }
    
    
    engine.askQuestion = function(){
        console.log(engine.questionList)
        if (engine.questionList.length > 0) { 
            engine.currentQuestion = engine.questionList[0]
            console.log(engine.currentQuestion)
            engine.currentQuestion.question.play();
            engine.currentQuestion.correctAnswer = true
        } else {
            let visualArrray = engine.questionList.map(element => element.visual)
            visualArrray.forEach(element => {element.removeEventListener('click', engine.evaluateResponse)})
            engine.introductions()
}}
          
    engine.evaluateResponse = function(Event){
        console.log('evaluating')
        engine.theDozen.forEach(element =>{
                if (element.visual == Event.currentTarget) {
                    if (element.correctAnswer === true) {
                        yes1.play()  
                        engine.currentQuestion.done = true
                        engine.currentQuestion.correctAnswer = false
                        engine.questionList.shift()
                        yes1.addEventListener('ended', engine.askQuestion)
                    } else {
                        element.responseN.play()
                        element.responseN.addEventListener('ended', engine.repeatQuestion)
                        engine.currentQuestion.gotWrong = true}}})
     }

    engine.repeatQuestion = function(){engine.currentQuestion.question.play()}
   
                   
                        
                  
                    
               
                
            
    
    // turn on the "next" button
document.querySelector('#review').addEventListener('click', engine.reviewAll);      
document.querySelector('#repeatThat').addEventListener('click', engine.repeatQuestion);     
document.querySelector('#start').addEventListener('click', engine.introductions);
//document.querySelector('#start').addEventListener('click', engine.makeQuestionList);
