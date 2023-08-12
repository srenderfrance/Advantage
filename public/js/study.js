


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
    this._id = {}
};

let wOne = new MakeVocabWord(false,false,false,audioTis1,audioN1,audioQ1,document.querySelector('#A1'),{});
let wTwo = new MakeVocabWord(false,false,false,audioTis2,audioN2,audioQ2,document.querySelector('#A2'),{});
let wThree = new MakeVocabWord(false,false,false,audioTis3,audioN3,audioQ3,document.querySelector('#A3'),{});
let wFour = new MakeVocabWord(false,false,false, audioTis4,audioN4,audioQ4,document.querySelector('#A4'),{});
let wFive = new MakeVocabWord(false,false,false,audioTis5,audioN5,audioQ5,document.querySelector('#A5'),{});
let wSix = new MakeVocabWord(false,false,false,audioTis6,audioN6,audioQ6,document.querySelector('#A6'),{});
let wSeven = new MakeVocabWord(false,false,false,audioTis7,audioN7,audioQ7,document.querySelector('#A7'),{});
let wEight = new MakeVocabWord(false,false,false,audioTis8,audioN8,audioQ8,document.querySelector('#A8'),{});
let wNine = new MakeVocabWord(false,false,false,audioTis9,audioN9,audioQ9,document.querySelector('#A9'),{});
let wTen = new MakeVocabWord(false,false,false,audioTis10,audioN10,audioQ10,document.querySelector('#A10'),{});
let wEleven = new MakeVocabWord(false,false,false,audioTis11,audioN11,audioQ11,document.querySelector('#A11'),{});
let wTwelve = new MakeVocabWord(false,false,false,audioTis12,audioN12,audioQ12,document.querySelector('#A12'),{});



let engine = {}
    engine.theDozen = [wOne, wTwo, wThree, wFour, wFive, wSix, wSeven, wEight, wNine, wTen, wEleven, wTwelve];
    engine.toIntroduce = [wOne, wTwo, wThree, wFour, wFive, wSix, wSeven, wEight, wNine, wTen, wEleven, wTwelve];
    engine.newWord = engine.toIntroduce[0]; //The word being introcuded for the first time.
    engine.introduced = []; //The array of vocabWords that has already been introduced.
    engine.questionList = [];
    engine.currentQuestion = engine.questionList[0]; //The vocabword that is the correct answer to the most recent question.
    engine.lastTwo = [engine.introduced[0], engine.introduced[1]];
    engine.userReviewResults = { //Results to be sent back to the server/DB.
        'activity': '',
        'mistakes': [],
        'wordsSelected': [],
        'numberOfWords': 0,
        'numberOfReviews': 0
        };
    engine.activityId = {},    
    
    engine.createActivity = async function(){
        try {
            const activity = document.querySelector("#title").innerText;
            const response = await fetch("/student/getVocabList", {method: 'PUT',
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify({activity: activity}),
                    });
            const data = await response.json();
            console.log(data)
            let vocabList = data.vocabList;
            console.log('activity id')
            console.log(vocabList[0]._id)
            engine.activityId = vocabList[0].activity;
            console.log(vocabList); 
            const diff = engine.theDozen.length - vocabList.length;
            console.log(`diff = ${diff}`);
            if(diff > 0) {
                for (let index = 0; index < diff; index++) {
                    engine.theDozen.pop();
                    engine.toIntroduce.pop();    
                }
            }    
           for (let i = 0; i < engine.theDozen.length; i++) {
                engine.theDozen[i]._id = vocabList[i]._id; 
                }
            document.getElementById('review').disabled = false;  
            document.getElementById('start').disabled = false;
            document.getElementById('undo').disabled = true;
            document.getElementById('repeatThat').disabled = true;
            document.getElementById('select').disabled = false;
            document.getElementById('showAll').disabled = false; 
            
            console.log('Done')
        
        } catch (error) {
            console.log(error)
        }
    };
   
    
    engine.stopClicks = function(duration){
        let visualArray = engine.theDozen.map(element => element.visual);
        console.log(`Delay is: ${duration}`)
        let delay = 1000 * duration
        console.log('stop clicks is running');
        console.log(`Now Delay is: ${delay}`);
        
        visualArray.forEach(element => {
            element.style.pointerEvents = 'none';
        });

        setTimeout(() => {
            visualArray.forEach(element => {
                element.style.pointerEvents = 'auto';})
                console.log('The wait is over!');
                console.log(delay);
            }, delay);
        
    };
    
    engine.introductions = function(){
        document.getElementById('review').disabled = true;
        document.getElementById('start').disabled = true;
        document.getElementById('select').disabled = true;  
        document.getElementById('addSelection').disabled = true; 
        document.getElementById('undo'),disabled = true;
        document.getElementById('showAll').disabled = true;

        let visualArray = engine.theDozen.map(element => element.visual);
        visualArray.forEach(element => {
            element.style.display = 'none';
            element.removeEventListener('click', engine.simpleIntro);});
        engine.introduceNewWord();
    };
    engine.introduceNewWord = function() {
        if (engine.toIntroduce.length === 0) {
            engine.end()
        } else {
            engine.newWord.visual.classList.toggle('selected');
            engine.newWord.visual.style.display = 'block';
            engine.newWord.introduction.play();
            let duration = engine.newWord.introduction.duration;
            console.log('intro duration');
            console.log(duration);
            engine.stopClicks(duration);
            engine.newWord.introduction.addEventListener('ended', reset);
        };

        function reset(){
            resetStart(conditional)
            
            function conditional(){
            if (engine.introduced.length === 1 ) { 
                engine.introduceNewWord()
            }else{
                let visualArray = engine.introduced.map(element => element.visual)
                visualArray.forEach(element => {element.addEventListener('click', engine.evaluateResponse)})
                engine.makeQuestionList()
                engine.askQuestion() 
            }};

            function resetStart(callback){
            engine.newWord.visual.classList.toggle('selected')
            engine.newWord.introduction.removeEventListener('ended', reset)
            let word = engine.toIntroduce.shift()
            engine.introduced.unshift(word)
            engine.newWord = engine.toIntroduce[0]
            callback()}
    }};
   
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

    engine.makeRandomIndex = function(arr) {
            return Math.floor(Math.random() * arr.length)
            }

    engine.makeRandomElement = function(arr) { //randomly removes an element from an array then returns that element
            let newArray = arr.splice(engine.makeRandomIndex(arr), 1);
            return newArray[0]
            }
    //engine.rmvAndRtnRandElement = function(arr)

    engine.makeVisibleAll = function() {
        let visualArray = engine.theDozen.map(element => element.visual);
        visualArray.forEach(element => {element.style.display = 'block'});

    };

    engine.reviewAll = function() {
        document.getElementById('end').classList.remove('end');
        document.querySelector('#repeatThat').disabled = false;
        document.getElementById('review').disabled = true;
        document.getElementById('start').disabled = true;
        document.getElementById('select').disabled = true;
        document.getElementById('undo'),disabled = true;
        document.getElementById('showAll').disabled = true;

        let visualArray = engine.theDozen.map(element => element.visual);
        visualArray.forEach(element => {
            element.removeEventListener('click', engine.simpleIntro);
        })
        
        engine.toIntroduce = [];
        let tempArray = [];
        engine.theDozen.forEach(element =>{tempArray.push(element)});
        for (i = tempArray.length; i>0; i--) {
            let randomElement = engine.makeRandomElement(tempArray);
            engine.questionList.push(randomElement)};
        engine.theDozen.forEach(element =>{tempArray.push(element)});
        tempArray.forEach(element =>{engine.questionList.splice(engine.makeRandomIndex(engine.questionList), 0, element)});
        engine.makeVisibleAll();
        engine.askQuestion();
        visualArray.forEach(element => {element.addEventListener('click', engine.evaluateResponse)});
        };
    
    
    engine.askQuestion = function(){
        console.log(engine.questionList)
        if (engine.questionList.length > 0) { 
            engine.currentQuestion = engine.questionList[0]
            console.log(engine.currentQuestion)
            engine.currentQuestion.question.play();
            let duration = engine.currentQuestion.question.duration;
            engine.stopClicks(duration);
            engine.currentQuestion.correctAnswer = true
        } else {
            let visualArray = engine.questionList.map(element => element.visual)
            visualArray.forEach(element => {element.removeEventListener('click', engine.evaluateResponse)})
            engine.introduceNewWord()
}}
          
    engine.evaluateResponse = function(Event){
        console.log('evaluating');
        engine.theDozen.forEach(element =>{
                if (element.visual == Event.currentTarget) {
                    if (element.correctAnswer === true) {
                        element.visual.classList.add('thatsRight'); 
                        engine.stopClicks(1);
                        console.log('should have transfomed');
                        engine.currentQuestion.done = true;
                        engine.currentQuestion.correctAnswer = false;
                        engine.questionList.shift();
                        document.getElementById('undo').disabled = true;
                        setTimeout(() => {
                            element.visual.classList.remove('thatsRight')
                            engine.askQuestion()
                        }, 1000);
                        console.log("settimeout over")
                    } else {
                        element.responseN.play();
                        let duration = element.responseN.duration;
                        engine.stopClicks(duration);
                        element.responseN.addEventListener('ended', engine.repeatQuestion);
                        engine.currentQuestion.gotWrong = true;
                        console.log(engine.currentQuestion);
                        console.log(engine.theDozen);
                        let mistake = engine.currentQuestion._id; 
                        engine.userReviewResults.mistakes.push(mistake);
                        console.log(engine.userReviewResults.mistakes);
                        document.getElementById('undo').disabled = false;
                    }}
        })}
    engine.removeMistake = function() {
        engine.userReviewResults.mistakes.pop();
        document.getElementById('undo').disabled = true;
    }
    engine.repeatQuestion = function(){
        engine.currentQuestion.question.play();
        let duration = engine.currentQuestion.question.duration
        engine.stopClicks(duration);
    }
    engine.simpleIntro = function(Event) {   
        let duration = 0   
        engine.theDozen.forEach(element =>{
        if (element.visual == Event.currentTarget) {
            element.introduction.play()
            duration = element.introduction.duration;
        }});
        engine.stopClicks(duration); 
    };
    engine.end = function() {  
        document.getElementById('end').classList.add('end');
        
        console.log('Activity is finished!')
        engine.userReviewResults.numberOfReviews++;
        engine.userReviewResults.numberOfWords = engine.theDozen.length;
        engine.userReviewResults.activity = engine.activityId;
        let visualArray = engine.theDozen.map(element => element.visual)
        console.log(visualArray)
        visualArray.forEach(element => {
            element.removeEventListener('click', engine.evaluateResponse);
            element.addEventListener('click', engine.simpleIntro);
        });
        document.querySelector('#repeatThat').disabled = true;
        document.getElementById('review').disabled = false;
        document.getElementById('select').disabled = false;  
        document.getElementById('addSelection').disabled = true; 
        };     
    engine.selectWord = function(Event){
        engine.makeVisibleAll();
        engine.theDozen.forEach(element => {
                if (element.visual == Event.currentTarget) {
                    element.visual.classList.toggle('selected');
                    console.log(element)
                    element.introduction.play()};
    })};
    engine.makeSelections = function(){
        document.getElementById('end').classList.remove('end');
       
        document.getElementById('addSelection').disabled = false;
        let visualArray = engine.theDozen.map(element => element.visual);
        engine.userReviewResults.wordsSelected.forEach(element1 => {
            engine.theDozen.forEach(element2 => {
                if (element1 == element2._id){
                    element2.visual.classList.add('selected');
            }})});
        visualArray.forEach(element => {
            element.removeEventListener('click', engine.evaluateResponse);
            element.addEventListener('click', engine.selectWord);
            element.removeEventListener('click', engine.simpleIntro);
        });
        engine.makeVisibleAll()                      
    };
                    
    engine.filalizeSelection = async function() {
         
        console.log('filalize Selestion')
        console.log(engine.theDozen)

        let selection = [];
        engine.theDozen.forEach(element => {
            console.log(element.visual.classList.contains('selected'))
            if (element.visual.classList.contains('selected')){
                selection.push(element._id)
                element.visual.classList.remove('selected')};
        })
    engine.userReviewResults.wordsSelected = selection;              
    console.log(`Words Selected: ${engine.userReviewResults.wordsSelected.length}`);
    console.log(engine.userReviewResults.wordsSelected);
    document.getElementById('addSelection').disabled = true; 
    let visualArray = engine.theDozen.map(element => element.visual);
    visualArray.forEach(element => {
        element.removeEventListener('click', engine.selectWord);
        element.addEventListener('click', engine.simpleIntro)});
    };         
    
    engine.saveAndRedirect = async function(){
        engine.sendResults();
        const response = await fetch("/student", {method: 'GET'});
    }
    engine.sendResults = async function() {
        console.log(engine.userReviewResults);
        infoToSend = engine.userReviewResults;
        const response = await fetch("/student/reviewResults", {method: 'POST',
        headers: {"Content-Type": "application/json",},    
            body: JSON.stringify({infoToSend: infoToSend}),
    })
    console.log(response)
}
            
engine.createActivity();    


document.querySelector('#showAll').addEventListener('click', engine.makeVisibleAll);
document.querySelector('#addSelection').addEventListener('click', engine.filalizeSelection);
document.querySelector('#review').addEventListener('click', engine.reviewAll);      
document.querySelector('#repeatThat').addEventListener('click', engine.repeatQuestion);     
document.querySelector('#start').addEventListener('click', engine.introductions);
document.querySelector('#select').addEventListener('click', engine.makeSelections)
document.querySelector('#undo').addEventListener('click', engine.removeMistake);
document.querySelector('#sendResults').addEventListener('click', engine.sendResults);
