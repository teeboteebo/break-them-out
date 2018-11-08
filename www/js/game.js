function loadGame() {
  // Main variables
  let lives;
  let score;
  let paused;
  const bricks = [];
  const keysPressed = {};
  let initialPaddleSpeed = 300;
  let initialBallSpeed = 320;
  const paddle = {};
  const ball = {};
  let gameBorders = loadGameBorders();
  let aiming = true;
  let level = 0;
  let stage = 1;

  let backgrounds = [
    "url('/imgs/backgrounds/stage1.jpg')",
    "url('/imgs/backgrounds/stage2.jpg')",
    "url('/imgs/backgrounds/stage3.jpg')"
  ];
  let paddles = [
    "url('/imgs/paddles/paddle1.png')",
    "url('/imgs/paddles/paddle2.png')",
    "url('/imgs/paddles/paddle3.png')"
  ];
  let bricksstyle = [
    "url('/imgs/bricks/brick1.png')",
    "url('/imgs/bricks/brick2.png')",
    "url('/imgs/bricks/brick3.png')"
  ];
  let balls = [
    "url('/imgs/balls/ball1.png')",
    "url('/imgs/balls/ball2.png')",
    "url('/imgs/balls/ball3.png')"
  ];

  let levelClear = new sound("/gameSounds/levelCleared.mp3");
  let ballCollide = new sound("/gameSounds/ballCollide.mp3");
  let ballMiss = new sound("/gameSounds/loseLife.mp3");
  let themeSong = new sound("/gameSounds/themeSong.mp3");
  let gameOver = new sound("/gameSounds/gameOver.mp3");

  // remove previous event listener
  // (since this code might be run multiple times)
  $('.sound-btn').unbind('click');

  let soundMuted = false;
  $(".sound-btn").click(function () {
    soundMuted = !soundMuted;
    $('audio').prop('muted', soundMuted);
  });

  $(function () {
    $('.SoundOff').click(function () {
      var wasPlay = $(this).hasClass('fa-volume-up');
      $(this).removeClass('fa-volume-up fa-volume-off');
      var klass = wasPlay ? 'fa-volume-off' : 'fa-volume-up';
      $(this).addClass(klass)
    });
  });



  // Setup key listeners before starting the first game
  setupKeyListeners();
  startNewGame();

  // Reset starting variables etc
  function startNewGame() {
    lives = 3;
    score = 0;
    paused = false;
    aiming = true;
    level = 0;
    stage = 1;
    resetPaddle();
    resetBall();
    spawnBricks();
    levelUp();
    updateInterface();
    startInterval();
    themeSong.play();
    $(".shootBtn").show();
  }

  // Loads in a new set of bricks in allowing you to keep on player upon clearing
  function startNewRound() {
    paused = false;
    aiming = true;
    resetBall();
    resetPaddle();
    spawnBricks();
    levelUp();
    
    updateInterface();

    levelClear.play();
    $(".shootBtn").show();
  }

  //This stops movement of paddle and ball while paused
  function updateGame(deltaTime) {
    if (paused) {
      return
    }
    movePaddle(deltaTime);
    moveBall(deltaTime);
  }
  //
  function movePaddle(deltaTime) {
    const direction = calculatePaddleDirection();
    const velocity = direction * paddle.speed * deltaTime;
    paddle.left += velocity;
    if (aiming) { resetBall(); moveBall(); }
    if (paddle.left < gameBorders.left) { paddle.left = 0; }
    if (paddle.left + paddle.width > gameBorders.width) { paddle.left = gameBorders.width - paddle.width; }
    paddle.$.css('left', paddle.left);
  }

  function moveBall(deltaTime) {
    if (!aiming) {
      ball.left += ball.direction.x * ball.speed * deltaTime;
      ball.top += ball.direction.y * ball.speed * deltaTime;
    }

    if (!collisionDetectBallAndGame()) { return; }
    collisionDetectBallAndBricks();
    collisionDetectBallAndPaddle();

    ball.$.css('left', ball.left);
    ball.$.css('top', ball.top);
  }

  function calculatePaddleDirection() {
    let movementVelocity = 0;
    if (keysPressed.left) { --movementVelocity; }
    else if (keysPressed.right) { ++movementVelocity; }
    return movementVelocity;
  }

  function loseLife() {
    --lives;
    aiming = true;
    updateInterface();
    resetBall();
    ballMiss.play();
    $(".shootBtn").show();
  }

  function collisionDetectBallAndGame() {
    if (ball.left < gameBorders.left) {
      ball.left = 0;
      ball.direction.x *= -1;
      ballCollide.play();
    } else if (ball.left + ball.width > gameBorders.width) {
      ball.left = gameBorders.width - ball.width;
      ball.direction.x *= -1;
      ballCollide.play();
    }

    if (ball.top < gameBorders.top) {
      ball.top = 0;
      ball.direction.y *= -1;
      ballCollide.play();
    } else if (ball.top + ball.height > gameBorders.height) {
      loseLife();
      return false;
    }
    return true;
  }

  function collisionDetectBallAndPaddle() {
    if (!isRectAOutsideRectB(ball, paddle)) {
      // this if statement changes the direction the ball goes on the x axis (left and right)
      // when the ball hits the paddle
      if (paddle.left + (paddle.width / 2) > ball.left + (ball.width / 2)) {
        ball.direction.x = -1;
      }
      else {
        ball.direction.x = 1;
      }
      // paddle center hitbox
      if (paddle.left + (paddle.width / 2) > ball.left + (ball.width / 2) - 10 && paddle.left + (paddle.width / 2) < ball.left + (ball.width / 2) + 10) {
        ball.direction.x = 0
      }
      ball.direction.y *= -1;
      // ball.direction.x *= 1;
      ball.top = paddle.top - ball.height;
      //Score is not added while aiming
      if (!aiming) {
        // score += 5;
        ballCollide.play();
      }
      updateInterface();
    }
  }

  function collisionDetectBallAndBricks() {
    for (let i = bricks.length - 1; i >= 0; --i) {
      const brick = bricks[i];
      if (!isRectAOutsideRectB(ball, brick)) {
        if (getHorizontalOrVerticalDirection(brick, ball) == 'horizontal') {
          // If it bounced on the side of the brick
          ball.direction.x *= -1;
        } else {
          // If it bounced above/below a brick
          ball.direction.y *= -1;
        }
        brick.$.remove();
        bricks.splice(i, 1);
        score += 25;
        updateInterface();
        ballCollide.play();
      }
    }
    if (bricks.length == 0) {
      paused = true;
      updateInterface();
    }
  }

  // Assumes the properties: left, top, width, height
  function isRectAOutsideRectB(a, b) {
    if (a.left > b.left + b.width) return true; // to the right
    if (a.left + a.width < b.left) return true; // to the left
    if (a.top > b.top + b.height) return true; // below
    if (a.top + a.height < b.top) return true; // above
    return false;
  }

  // Does not work for rectangles, only squares
  function getHorizontalOrVerticalDirection(objA, objB) {
    return 'vertical'; // Always return 'vertical' for non-square bricks
    // Todo: fix code for rectangle bricks
    const aY = objA.top + objA.height / 2;
    const aX = objA.left + objA.width / 2;
    const bY = objB.top + objB.height / 2;
    const bX = objB.left + objB.width / 2;
    const direction = Math.abs(Math.atan2(aY - bY, aX - bX));
    return (Math.abs(direction) < Math.PI / 4 || Math.abs(direction) > Math.PI / 4 * 3) ? 'horizontal' : 'vertical';
  }

  function updateInterface() {
    $('.score span').text((score + '').padStart(5, '0'));
    $('.lives span').text(lives);
    $('.main-text').hide();
    if (lives < 1) {
      $('.main-text').text('GAME OVER - press "ENTER" to play again');
      themeSong.stop();
      gameOver.play();
      aiming = false;
      paused = true;
      postNewHighscore();
      initialBallSpeed = 320;
      initialPaddleSpeed = 300;
    } else if (!bricks.length) {
      startNewRound();
    } else if (paused) {
      $('.main-text').text('PAUSED - press "ENTER" or click Pause button to continue...');
      themeSong.stop();
    } else {
      $('.main-text').text('');
      themeSong.play();
    }
    $('.main-text').fadeIn(500);
  }

  //Pause the game
  function onEnterPress() {
    if (keysPressed.enter) { return; }
    keysPressed.enter = true;

    if (lives > 0) {
      paused = !paused;
    } else {
      startNewGame();
    }

    updateInterface();
  }
  //Added Spacebar (32) for releasing the ball
  function setupKeyListeners() {
    $(window).keydown(function (e) {
      if (e.which === 37) { keysPressed.left = true; }
      if (e.which === 39) { keysPressed.right = true; }
      if (e.which === 13) { onEnterPress(); }
      if (e.which === 32) { aiming = false; e.preventDefault(); }
    });

    $(window).keyup(function (e) {
      if (e.which === 37) { keysPressed.left = false; }
      if (e.which === 39) { keysPressed.right = false; }
      if (e.which === 13) { keysPressed.enter = false; }
    });

    $(".rightBtn").on("touchstart mousedown", function () {
      console.log("keysPressed");

      keysPressed.right = true;
    });

    $(".leftBtn").on("touchstart mousedown", function () {
      console.log("keysPressed");

      keysPressed.left = true;
    });

    $(".shootBtn").on("touchstart mousedown", function () {
      console.log("keysPressed");

      aiming = false; 
      $(".shootBtn").hide();
    });

    $(".rightBtn").on("touchend mouseup", function () {
      keysPressed.right = false;
    });

    $(".leftBtn").on("touchend mouseup", function () {
      keysPressed.left = false;
    });

    $(".shootBtn").on("touchend mouseup", function () {
      aiming = false; 
      $(".shootBtn")
    });

    $(".pause-game").on("mousedown", function () {
      // keysPressed.left = true;
      if (lives > 0) {
        paused = !paused;
      } else {
        startNewGame();
      }
      updateInterface();
    });

    // $(".pause-game").on("mouseup", function () {
    //   keysPressed.left = false;
    // });
  }

  function loadGameBorders() {
    return {
      left: 0,
      top: 0,
      width: $('.game').width(),
      height: $('.game').height()
    };
  }

  function resetPaddle() {
    paddle.$ = $('.paddle');
    paddle.speed = initialPaddleSpeed;

    paddle.top = paddle.$.position().top;
    paddle.left = paddle.$.position().left;
    paddle.width = paddle.$.width();
    paddle.height = paddle.$.height();

    paddle.$.css('left', (paddle.left = gameBorders.width / 2 - paddle.width / 2));
  }

  function resetBall() {
    ball.$ = $('.ball');
    ball.speed = initialBallSpeed;

    ball.width = ball.$.width();
    ball.height = ball.$.height();

    ball.$.css('left', (ball.left = paddle.left + paddle.width / 2 - ball.width / 2));
    ball.$.css('top', (ball.top = paddle.top - ball.height));
    ball.direction = { x: 0, y: -1 };

  }

  function spawnBricks() {
    const brickCSS = getBrickCSS('left', 'top', 'width', 'height');

    const colors = [
      0, 0, 0, 0, 0
    ];

    if (gameBorders.width < 490){
      colors.pop();
      colors.pop();
    }

    let prevLeft = brickCSS.left;

    for (let color of colors) {
      const brick = createBrick(prevLeft, brickCSS.top, brickCSS.width, brickCSS.height);

      bricks.push(brick);
      $('.game').append(brick.$);

      prevLeft += brickCSS.width * 1.5;
    }
    prevLeft = brickCSS.left;

    for (let color of colors) {
      const brick = createBrick(prevLeft, brickCSS.top + 50, brickCSS.width, brickCSS.height);

      bricks.push(brick);
      $('.game').append(brick.$);

      prevLeft += brickCSS.width * 1.5;
    }
    prevLeft = brickCSS.left;

    if (gameBorders.height > 500){

      for (let color of colors) {
        const brick = createBrick(prevLeft, brickCSS.top + 100, brickCSS.width, brickCSS.height);

        bricks.push(brick);
        $('.game').append(brick.$);

        prevLeft += brickCSS.width * 1.5;
      }
      prevLeft = brickCSS.left;

      for (let color of colors) {
        const brick = createBrick(prevLeft, brickCSS.top + 150, brickCSS.width, brickCSS.height);

        bricks.push(brick);
        $('.game').append(brick.$);

        prevLeft += brickCSS.width * 1.5;
      }
    }
  }

  function createBrick(left, top, width, height) {
    const brick = $('<div class="brick">').css({ left, top });
    return {
      $: brick,
      left,
      top,
      width,
      height
    };
  }

  function getBrickCSS(...properties) {
    const tempBrick = $('<div class="brick">').appendTo('.game');
    const css = {}
    for (let prop of properties) {
      css[prop] = parseInt(tempBrick.css(prop));
    }
    tempBrick.remove();
    return css;
  }

  function startInterval() {
    const updateSpeed = 10; // lower = faster
    clearInterval(window.gameInterval);
    // Wait a short delay before starting to let the player prepare
    setTimeout(() => {
      window.gameInterval = setInterval(() => {
        updateGame(updateSpeed / 1000);
      }, updateSpeed);
    }, 1000);
  }

  // Function for sounds to be able
  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    }
    this.stop = function () {
      this.sound.pause();
    }
  }

  function levelUp() {
    // "paddle.speed = initialPaddleSpeed*1.25" doesn't work for some reason?
    // Paddle.speed limit is 750
    if (paddle.speed < 750) {
      initialPaddleSpeed = initialPaddleSpeed * 1.25;
      paddle.speed = initialPaddleSpeed;
    }
    initialBallSpeed = initialBallSpeed * 1.25;

    if (level > 2.1) {
      level = 0;
    }
    if (level <= 2) {
      $('.game').css("background-image", backgrounds[level]);
      $('.paddle').css("background-image", paddles[level]);
      $('.ball').css("background-image", balls[level]);
      $('.brick').css("background-image", bricksstyle[level]);
    }
    level++;
    $(".current-level").text(stage);
    stage++;
  }

  function levelDown() {
    if (paddle.speed > 300) {
      initialPaddleSpeed = initialPaddleSpeed * 0.8;
      paddle.speed = initialPaddleSpeed;
    }
    initialBallSpeed = initialBallSpeed * 0.8;

    if (level < 0) {
      level = 2;
    }
    if (level >= 0) {
      $('.game').css("background-image", backgrounds[level]);
      $('.paddle').css("background-image", paddles[level]);
      $('.ball').css("background-image", balls[level]);
      $('.brick').css("background-image", bricksstyle[level]);
    }
    level--;
    $(".current-level").text(stage);
    stage--;
  }

  $(".higher-level").on("click", function (){
    levelUp();
  });

  $(".lower-level").on("click", function (){
    levelDown();
  });

  // disables "rightclick" on the game
  $(".game").on("contextmenu", function () {
    return false;
  });



  //$('.send-to-highscore').on('click', postNewHighscore);

  
  $('.save-hi-score-name').unbind('click'); // so that we don't doublebind our click event handöler
  $('.save-hi-score-name').click(function(){
     let name = $('.player-name').val();
     console.log("name",name);

     if(name.length >=4){
       $('.validate-message').text('Please enter max 3 character!').show();
       return;
     }

     $('.validate-message').hide();
     $('#highscore-name-modal').modal('hide');
  
     $.post("/add-score", { name:name, score:score }, function (responseData) {
      console.log('the new highscore-list is:', responseData);
      //console.error('append/use the new highscore-list then remove this console.error');
      history.pushState('', '', '/high-score');
      frontendRouter('/high-score');    
    });

  });
  

  function postNewHighscore() {

    $('.validate-message').hide();
    $('#highscore-name-modal').modal('show');

  }
}
