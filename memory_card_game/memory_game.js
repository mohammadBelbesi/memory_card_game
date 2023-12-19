let notFirstTime = false;
let jasonLink;
let jasonData;
let pageCounter=0;
//let timeReq=0;
if(notFirstTime===false){
  jasonLink='https://api.disneyapi.dev/character';
}

// let startTime,finishTime;
// $.ajax({
//   url: "get_current_time.php",
//   success: function (result) {
//     startTime = parseInt(result);
//   }
// });

let items = [];

const getImages = async () => {
  let response = await $.ajax(jasonLink);

  if (response) {
    jasonData = response;
    items = randomNumbers.map((i) => jasonData['data'][i]);
    notFirstTime = true;

    let nextPage = jasonData.info.nextPage;
    
    // Check if nextPage starts with "http://"
    if (nextPage && nextPage.startsWith("http://")) {
      // Replace "http://" with "https://"
      jasonLink = nextPage.replace("http://", "https://");
    } else {
      // If it doesn't start with "http://", assume it's already "https://"
      jasonLink = nextPage;
    }

    // Update the pagination link

    pageCounter++;

    if (pageCounter === jasonData.info.totalPages) {
      notFirstTime = false;
      jasonLink = 'https://api.disneyapi.dev/character';
      pageCounter = 0;
    }
  } else {
    alert('Ajax request for data failed');
    console.log(response.text);
  }
};


let randomNumbers=[];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

for(i=0 ; i<10 ; i++){
    randomNumbers[i]=getRandomInt(50);
}

const moves = document.getElementById("moves-count");
let timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

let duration = 1000;
let seconds = 0,
  minutes = 0;
let movesCount = 0,
  winCount = 0;

const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span id="moves_count">Moves:</span>${movesCount}`;
};
const rows=4,columns=5;
const generateRandom = (size = (rows*columns)/2) => {
  let tempArray = [...items];
  let cardValues1 = [];
  let cardValues2 = [];
  size = size / 2;
  let myRandom=[];
  for (let i = 0; i < size; i++) {
    let randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues1.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }

  for (let i = 0; i < size; i++) {
    let randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues2.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }

  // for (let i = 0; i < size; i++) {
  //   let randomIndex = Math.floor(Math.random() * tempArray.length);
  //   if(myRandom.includes(randomIndex)){
  //     while(true){
  //       if(myRandom.includes(randomIndex)){
  //         randomIndex = Math.floor(Math.random() * tempArray.length);
  //         myRandom.push(randomIndex);
  //       }
  //       else{
  //         myRandom.push(randomIndex);
  //         break;
  //       }
  //     }
  //   }
  //   cardValues2.push(tempArray[randomIndex]);
  //   tempArray.splice(randomIndex, 1);
  // }
  
  // Create a copy of the first half of cardValues and concatenate it with itself to form pairs
  const pairs = [...cardValues1.slice(0, size), ...cardValues2.slice(0, size)];
  
  // Shuffle the pairs array
  for (let i = pairs.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  
  return pairs;
};

const matrixGenerator = (cardValues, rows = 4, columns = 5) => {
  // console.log(cardValues)
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // simple shuffle
  cardValues.sort(() => Math.random() - 0.5);

  for (let i = 0; i < cardValues.length; i++) {
    const characterData = cardValues[i];
    gameContainer.innerHTML += `
     <div class="card-container" name-card-value="${characterData.name}" films-card-value="${characterData.films}" tvShows-card-value="${characterData.tvShows}" videoGames-card-value="${characterData.videoGames}" parkAttractions-card-value="${characterData.parkAttractions}">
        <div class="card-before">!</div>
        <div class="card-after">
        <img src="${characterData.imageUrl}" class="image"/>
        <div class="name-overlay">${characterData.name}</div>
        </div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${columns}, auto)`;
  gameContainer.style.gridTemplateRows = `repeat(${rows}, auto)`;
  document.getElementById('back-ground-music').play();

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          firstCard.classList.add("disabled");
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("name-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("name-card-value");
          if (firstCardValue == secondCardValue && !(secondCard.classList.contains("disabled"))) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            document.getElementById('success').play();
            stopClicking();
            // theIndexOfElement('Mickey Mouse', 'https://www.example.com/mickey.jpg').then((index) => {
            //   console.log(index);
            //   // Do something with the index
            // })
            // .catch((error) => {
            // console.error(error);
            // // Handle the error
            // });
            let delay = setTimeout(() => {
              let cardDetails = `Films: ${card.getAttribute('films-card-value')}\nTV Shows: ${card.getAttribute('tvShows-card-value')}\nvideoGames: ${card.getAttribute('videoGames-card-value')} \nparkAttractions: ${card.getAttribute('parkAttractions-card-value')}`;
              alert(`Very nice! You did it!\n${cardDetails}`);
            }, duration);
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              document.getElementById('win').play();
              // let finishTime = fetch('get_current_time.php').then((value)=> {
              //   console.log(value);
              //   timeValue = finishTime-startTime;
              // //result.innerHTML = `<h4>Moves: ${movesCount}</h4>`;
              // });
              // $.ajax({
              //   url: "get_current_time.php", success: function (result) {
              //     finishTime = parseInt(result);
              //     //alert(startTime);
              //     timeReq = finishTime-startTime;
              //   }
              // });

              let delay = setTimeout(() => {
                stopGame();
                alert("Well done! You did it!\n"+"you won in "+ movesCount +" moves!!\n"+"the time is: "+ timeValue.textContent.substring((5)) + "sec");
            }, duration);
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            document.getElementById('fail').play();
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
              //alert("You were wrong! No problem, try again!");
              tempFirst.classList.remove("disabled");
            }, duration);
            stopClicking();
          }
        }
      }
    });
  });
};

const theIndexOfElement = async (elementName, imageUrl) => {
  const response = await fetch(jasonLink);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.status}`);
  }
  const data = await response.json();
  const index = data['data'].findIndex((element) => element.name === elementName && element.imageUrl === imageUrl);
  return index;
};

function stopClicking(){
  gameContainer.classList.add('no-clicking');
  setTimeout(() => {
    gameContainer.classList.remove('no-clicking');
  },duration)
}

//Start game
startButton.addEventListener("click", async () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;

  // controls and buttons visibility
  await getImages(); // Wait for the images to be fetched before proceeding
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");

  // Start timer
  interval = setInterval(timeGenerator, 1000);
  // Initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});


function pauseMusic() {
  var music = document.getElementById("back-ground-music");
  music.currentTime=0;
  music.pause();
};

//Stop game
stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  pauseMusic();
  clearInterval(interval); // Clear the interval when stopping the game
});


//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  // timeValue=0;
  // movesCount=0;
  //timeReq=0;
  let cardValues = generateRandom();
//   console.log(cardValues);
  matrixGenerator(cardValues);
};
