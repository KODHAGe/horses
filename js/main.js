// Global DOM variables
let horsePrompt = document.body.querySelector("#horse"),
  firstChoice = document.body.querySelector("#first-choice"),
  secondChoice = document.body.querySelector("#second-choice"),
  thirdChoice = document.body.querySelector("#third-choice"),
  fourthChoice = document.body.querySelector("#fourth-choice"),
  timer = document.body.querySelector("#timer"),
  choices = [firstChoice, secondChoice, thirdChoice, fourthChoice];

//Global timers & settings
let timerClock,
  game,
  timersetting = 10; // in seconds

// Attach listeners to globals
firstChoice.addEventListener('click', chooseReaction);
secondChoice.addEventListener('click', chooseReaction);
thirdChoice.addEventListener('click', chooseReaction);
fourthChoice.addEventListener('click', chooseReaction);


let horses = [
{
  id: 0,
  name: 'High Horse',
  intro: "Haaaay man, I'm High Horse. But just call me Hi.",
  preference : [10, 5, 7, 10, 0],
  status: [0, 0, 0, 0, 0],
  questions:
      ["Hay man, I really like it. Hay. How bout chu?",
      "So, are you like always this quet?"],
  replies: {
    'wherefrom': 'The galaxy.',
    'childhoodstory':'No. Just no.',
    'definingmoment':'4:20 blazeitfaggot',
    'favouritemovie':'Cheech and Chong'
  }
},
{
  id: 1,
  name: 'Dead Horse',
  intro: '... (This horse looks pretty dead)',
  preference : [0, 0, 0, 0, 0],
  status: [0, 0, 0, 0, 0],
  "questions":
      ["...",
      "..."],
  replies: {
    'wherefrom': '...',
    'childhoodstory':'...',
    'definingmoment':'...',
    'favouritemovie':'...'
  }
}
]

let player = {
intro:'',
reactions: [
  {id:'0', text: 'Smile gently', effect: [1,0.5,2,0,1], chance: 1},
  {id:'1', text: 'Smile awkwardly', effect: [1,0.5,2,0,1], chance: 1},
  {id:'2', text: 'Smize', effect: [1,0.5,2,0,1], chance: 1},
  {id:'3', text: 'Frown a bit', effect: [1,0.5,2,0,1], chance: 1},
  {id:'4', text: 'Bark', effect: [1,0.5,2,0,1], chance: 1},
  {id:'5', text: 'Meow', effect: [1,0.5,2,0,1], chance: 1},
  {id:'6', text: 'Pass a judging glance', effect: [1,0.5,2,0,1], chance: 1},
  {id:'7', text: 'Stare intensly', effect: [1,0.5,2,0,1], chance: 1},
  {id:'8', text: 'Look away', effect: [1,0.5,2,0,1], chance: 1},
  {id:'9', text: 'Laugh out loud', effect: [1,0.5,2,0,1], chance: 1},
  {id:'10', text: 'Facepalm', effect: [1,0.5,2,0,1], chance: 1},
  {id:'11', text: 'Smile mysteriously', effect: [1,0.5,2,0,1], chance: 1},
  {id:'12', text: 'Lick your lips', effect: [1,0.5,2,0,1], chance: 1},
  {id:'13', text: 'Scratch your nose', effect: [1,0.5,2,0,1], chance: 1},
  {id:'14', text: 'Touch your hair nervously', effect: [1,0.5,2,0,1], chance: 1},
  {id:'15', text: 'Touch your hair seductively', effect: [1,0.5,2,0,1], chance: 1}
],
questions: [
  {id: 'wherefrom', text: 'So, where are you from?'},
  {id: 'childhoodstory', text: 'What is your favorite story about your childhood?'},
  {id: 'definingmoment', text: 'If you had to choose one moment in your life that defined you best, what would it be?'},
  {id: 'favouritemovie', text: 'What is your favorite movie?'}
]
}

let state = {
currentHorse: '',
loadedHorses: [],
loadedReactions: [],
horseQuestions: [],
playerQuestions: [],
currentEffect: [0,0,0,0,0]
};

//console.log(horses);

function loadHorse(state){
//Empty question states for new horse
state.horseQuestions = [];
state.playerQuestions = [];

//Load the next random horse
let id = Math.floor(Math.random() * horses.length);
let tries = 0;
//console.log(state.loadedHorses);
let checkPast = state.loadedHorses.find((horse) => {
  return horse.id === id;
});
while(checkPast !== undefined){
  id = Math.floor(Math.random() * horses.length);
  checkPast = state.loadedHorses.find((horse) => {
    return horse.id === id;
  });
  tries++;
  if(tries >= horses.length){
    console.log("<— STAHP —>");
    stopTimer();
    console.log(state.loadedHorses);
    alert('You exhausted all the horses. Good jaaaab.');
    return false;
  }
}

state.currentHorse = horses.find((horse)=>{
  return horse.id === id;
})
horsePrompt.textContent = state.currentHorse.intro;
}

function loadReactions(ask){
for(let i = 0; i <= 3; i++){
  choices[i].classList.remove('hidden');
}
// Fill reaction slots with random reactions
//If ask is true, only 3 reactions and the ask option
if(ask){
  choices[0].textContent = "Ask question";
  choices[0].classList.add('ask');
  for (let i = 1; i <= 3; i++){
    let id = Math.floor(Math.random() * player.reactions.length);
    let selectedReaction = player.reactions[id];
    choices[i].textContent = selectedReaction.text;
    choices[i].classList.remove('question');
    choices[i].setAttribute('reaction-id', selectedReaction.id);
    //state.loadedReactions.push(selectedReaction);
  }
} else {
  for (let i = 0; i <= 3; i++){
    let id = Math.floor(Math.random() * player.reactions.length);
    let selectedReaction = player.reactions[id];
    choices[i].textContent = selectedReaction.text;
    //state.loadedReactions.push(selectedReaction);
    choices[i].classList.remove('question');
    choices[i].setAttribute('reaction-id', selectedReaction.id);
  }
}
}

function chooseReaction(){
//Select reactions or questions
if(this.classList.contains('question')){
  let id = this.getAttribute('question-id');
  horsePrompt.textContent = state.currentHorse.replies[id];
  clearReactions();
  setTimeout(()=>{
    horsePrompt.textContent = state.currentHorse.questions[Math.floor(Math.random() * state.currentHorse.questions.length)];
    loadReactions(false);
  }, 2000);
} else if(this.classList.contains('ask')){
  //If ask was chosen, present questions
  for (let i = 0; i <= 3; i++){
    let id = Math.floor(Math.random() * player.questions.length);
    let selectedQuestion = player.questions[id];
    choices[i].textContent = selectedQuestion.text;
    choices[i].classList.add('question');
    choices[i].setAttribute('question-id', selectedQuestion.id);
    state.loadedReactions.push(selectedQuestion);
  }
  this.classList.remove('ask');
} else {
  //Manipulate horse values
  let id = this.getAttribute('reaction-id');
  chosenReaction = player.reactions.find((reaction)=>{
    return reaction.id === id;
  });
  state.currentHorse.status = chosenReaction.effect.map((number, index) => {
    return number + state.currentHorse.status[index];
  });
  console.log(state.currentHorse.status);

  //Else load some more reactions
  loadReactions(true);
}
}

function clearReactions(){
for(let i = 0; i <= 3; i++){
  choices[i].textContent = '';
  choices[i].classList.add('hidden');
}
}

function startGame(){
startTimer();
loadHorse(state);
loadReactions();
}

function startTimer(){
timer.textContent = timersetting;
timerClock = setInterval(() => {
  timer.textContent = timer.textContent - 1;
}, 1000);
game = setInterval(() => {
  stopTimer();
  state.loadedHorses.push(state.currentHorse);
  startGame();
  //console.log(state.loadedHorses);
}, 1000 * timersetting);
}

function stopTimer(){
clearInterval(timerClock);
clearInterval(game);
}

startGame();
console.log("<______START______>");
