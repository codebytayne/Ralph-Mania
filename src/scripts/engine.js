const state = {
    view: {
      squares: document.querySelectorAll(".square"),
      enemy: document.querySelector(".enemy"),
      timeLeft: document.querySelector("#time-left"),
      score: document.querySelector("#score"),
      livesCount: document.querySelector("#lives-count"),
      backgroundAudio: new Audio("./src/audios/loop.m4a"), 
    },
    values: {
      gameVelocity: 1000,
      hitPosition: 0,
      result: 0,
      curretTime: 60,
      lives: 5, 
    },
    actions: {
      timerId: null, 
      countDownTimerId: null, 
      colorChangeTimerId: null, 
    },
  };
  
  function changeSquareColors() {
    const squares = state.view.squares;
    const colors = ["#1aeaa5", "#ff6347", "#4682b4", "#ffdf00"];
  
    function getRandomInterval() {
      const intervals = [1000, 700, 1300, 900, 500, 1000]; 
      return intervals[Math.floor(Math.random() * intervals.length)];
    }
  
    squares.forEach(square => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      square.style.backgroundColor = randomColor;
    });
  
    const randomInterval = getRandomInterval();
    state.actions.colorChangeTimerId = setTimeout(changeSquareColors, randomInterval);
  }
  
  function countDown() {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;
  
    if (state.values.curretTime <= 0) {
      clearInterval(state.actions.countDownTimerId);
      clearInterval(state.actions.timerId);
      alert("Game Over! O seu resultado foi: " + state.values.result);
    }
  }
  
  function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
  }
  
  function loseLife() {
    state.values.lives--;
    state.view.livesCount.textContent = "x" + state.values.lives;
    playSound("errado"); 
    if (state.values.lives <= 0) {
      clearInterval(state.actions.timerId);
      clearInterval(state.actions.countDownTimerId);
      clearTimeout(state.actions.colorChangeTimerId); 
      state.view.backgroundAudio.pause(); 
      alert("Game Over! O seu resultado foi: " + state.values.result);
    }
  }
  
  function randomSquare() {
    state.view.squares.forEach((square) => {
      square.classList.remove("enemy");
    });
  
    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
  }
  
  function addListenerHitBox() {
    state.view.squares.forEach((square) => {
      square.addEventListener("mousedown", () => {
        if (square.id === state.values.hitPosition) {
          state.values.result++;
          state.view.score.textContent = state.values.result;
          state.values.hitPosition = null;
          playSound("hit");
        } else {
          loseLife();
        }
      });
    });
  }
  
  function showIntroModal() {
    const introModal = document.getElementById("intro-modal");
    introModal.style.display = "block";
    document.getElementById('game-container').classList.add('blur');
  }
  
  function hideIntroModal() {
    const introModal = document.getElementById("intro-modal");
    introModal.style.display = "none";
    document.getElementById('game-container').classList.remove('blur');
  }
  
  function startGame() {
    hideIntroModal();
    initialize(); 
  }
  
  function initialize() {
    addListenerHitBox();
    changeSquareColors(); 
    state.view.backgroundAudio.loop = true;
    state.view.backgroundAudio.volume = 0.1; 
    state.view.backgroundAudio.play();
  
    
    state.view.livesCount.textContent = "x" + state.values.lives;
  
   
    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
  }
  
 
  window.onload = showIntroModal;
  
  document.getElementById("start-game-button").addEventListener("click", startGame);
  