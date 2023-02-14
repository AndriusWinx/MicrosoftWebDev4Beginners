const quotes = [            //Database of quotes for the game
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
//array to store a quote from quotes[]. Each position of the array will be one word
let words=[];
//an index for the words[] array
let wordIndex=0;
//Getting the element of the quote div
const quoteElement=document.getElementById('quote');
//Getting the element of whatever has been written in the input box
const typedValueElement=document.getElementById('typed-value');
//Getting the elements for the buttons
const startButton=document.getElementById('start');
const rankButton=document.getElementById('ranking-button');
//Initializing the webpage
init();


//Function for initializing localStorage and listeners
function init(){
    //if(JSON.parse(localStorage.getItem('bestValues')===null)){ //Creating the ranking if not already created
            let ranking=[0,0,0,0,0]; //top 5 initial
            localStorage.setItem("bestValues",JSON.stringify(ranking)); //Uploading an empty ranking
    //}
    startButton.addEventListener("click",startEvent);       //Set the event listener on the start button
    rankButton.addEventListener("click",rankEvent);         //Set the event listener on the rank button
}


//The game itself
function startEvent(){         
    //Choosing a random quote from the quotes database
    const quote=quotes[Math.floor(Math.random()*quotes.length)];   
   //const quote=quotes[4]; //This one for testing
    //Splitting the quote in words and storing them in the words[] array.
    words=quote.split(' '); //Splitting using the space ' ' as delimiter. The space following a word sticks to that word, does not disappear
    //Setting the index to zero just in case
    wordIndex=0;
    //Getting each word of the quote as a <span> element
    const spanWords = words.map(function(word) {return `<span>${word} </span>`});
    //Matching the quote element from the HTML with the span elements
    quoteElement.innerHTML = spanWords.join('');
    //Highlighting the first word
    quoteElement.childNodes[wordIndex].className='highlight';
    //Unhiding the quote
    quoteElement.className='';
    //Deleting whatever was written before in the input box
    typedValueElement.value='';
    //Disabling and hiding the buttons
    startButton.disabled=true;
    startButton.className='hidden';
    rankButton.disabled=true;
    rankButton.className='hidden';
    //Enabling and unhiding the input box
    typedValueElement.className='';
    typedValueElement.disabled=false;
    //Setting the cursor at the input box
    typedValueElement.focus();
    //Getting the start time
    startTime=new Date().getTime();
    //Adding the input listener to the input box to enable reading what is written
    typedValueElement.addEventListener('input', inputEvent);
}

//The input listener event triggers every time the user types a character so putting the startTime declaration here
//makes the event get a new startTime every time the user types. Would be great to implement a function that waits for the user
//to type the first character
function inputEvent(){
    //Getting the current word (first word) and what is written in the box
    const currentWord=words[wordIndex];
    const typedValue=typedValueElement.value;

    //If the user is typing the last word and types it correctly ends the game
    if(typedValue===currentWord && wordIndex=== words.length-1){ //End of the phrase
        //Calculates the amount of time used
        const elapsedTime=(new Date().getTime()-startTime)/1000;
        //Disabling and hiding the input box
        typedValueElement.disabled=true;
        typedValueElement.className='hidden';
        //Removing the listener
        typedValueElement.removeEventListener('input',inputEvent);
        //Checking if the score is worth of the top 5
        newRanking(Number(((wordIndex+1)/elapsedTime).toFixed(3)));
        //Showing endgame modal box
        showModalBox(elapsedTime,(wordIndex+1));
    }
    //If the user is not typing the last word but types it completely correct
    else if(typedValue.endsWith(' ') && typedValue.trim()===currentWord){  
        //Deleting whats written in the input box
        typedValueElement.value='';
        //Unhighlighting the written word
        quoteElement.childNodes[wordIndex].className='';
        //Moving the index and highllighting the following word
        wordIndex++;
        quoteElement.childNodes[wordIndex].className='highlight';
    }
   //If the user hasnt typed completely but is typing correctly. This else if is basically for being able to define what a typo is.
    else if(currentWord.startsWith(typedValue)){    //Word being typed (correctly)
        //Removing typo class
        typedValueElement.className='';
    }
    //Typo detected
    else{
        //Highlight in red the input box
        typedValueElement.className='typo';
    }
 }

//Functions that checks if the score given (newMark) is worth of the ranking
function newRanking(newMark){
    //Getting the ranking from localStorage. As it is stored in string and its an array of integers we got to parse it
    let currentRanking=JSON.parse(localStorage.getItem('bestValues'));
    //For loop to check every position of the array
    for (let k=0; k<currentRanking.length;k++){
        if(newMark>currentRanking[k] || currentRanking[k]===0){ //newMark has to be in the ranking
            for(let i=currentRanking.length-1;i>k;i=i-1){   //moving the ranking down
                currentRanking[i]=currentRanking[i-1];  
            }
            currentRanking[k]=newMark;      //Introducing the new score at the rank it belongs
            localStorage.setItem('bestValues',JSON.stringify(currentRanking));  //Modifying the localStorage ranking
            return; //Ending the loop forcefully to avoid copying the new score in various rank positions
        }
    }
}

//Function for showing the endgame modalbox
function showModalBox(elapsedTime,numberWords){
    //Setting the text of the modal box
    document.getElementById('modal-box-text').innerText=`You finished in ${elapsedTime} seconds.`;
    document.getElementById('words-per-second').innerText=`You achieved ${(numberWords/elapsedTime).toFixed(3)} words/second`;
    //Unhiding modal box
    document.getElementById('modal-box').className='modal-box-background';
    document.getElementById('modal-box-content').className='';
    //Adding the closing event listener
    document.getElementById('close-cross').addEventListener('click',function(){
        //Hide the quote (I want it to be visible behind the modal box but not after the modal box is gone)
        quoteElement.className='hidden';
        //Hiding modal boxes
        document.getElementById('modal-box-content').className='hidden';
        document.getElementById('modal-box').className='hidden';
        //reenabling and unhiding buttons
        startButton.className='buttons';
        startButton.disabled=false;
        rankButton.className='buttons';
        rankButton.disabled=false;
    })
}

//Event for showing the ranking
function rankEvent(){
    //Hiding and disabling buttons
    startButton.className='hidden';
    startButton.disabled=true;
    rankButton.className='hidden';
    rankButton.disabled=true;
    //Getting the ranking. localStorage needs parsing to translate from string to its actual type
    let currentRanking=JSON.parse(localStorage.getItem('bestValues'));
    //For loop to get every position of the raking array into a text
    for(let k=0;k<5;k++){
        document.getElementById(`modal-box-ranking${k}`).innerText=currentRanking[k] + 'w/s';
    }
    //Unhiding modal box
    document.getElementById('modal-box-ranking').className='modal-box-background';
    document.getElementById('modal-box-ranking-content').className='';
    //Enabling the closing listener
    document.getElementById('close-cross-ranking').addEventListener('click',function(){
        //Hiding modal box
        document.getElementById('modal-box-ranking-content').className='hidden';
        document.getElementById('modal-box-ranking').className='hidden';
        //Enabling and unhiding buttons
        startButton.className='buttons';
        startButton.disabled=false;
        startButton.addEventListener('click',startEvent);
        rankButton.className='buttons';
        rankButton.disabled=false;
    })
}