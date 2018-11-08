let translationData;
$.getJSON('/json/content.json', function (data) {
  translationData = data;
  createHistory("en");
});

function createHistory(lang) {
  let title = $(".history-title");
  let titleImg = $(".history-img");
  let game = $(".history-gameplay");
  let ports = $(".history-ports");
  let a = translationData.history[lang];

  title.html("<h3>" + a.title + "</h3>" + a.desc);
  titleImg.html('<img src="imgs/arcadeflyer.jpg">');
  game.html("<h3>" + a.gametitle + "</h3>" + a.gameplay);
  ports.html("<h3>" + a.portstitle + "</h3>" + a.ports);
}

function createNavbar(lang) {
  let playNow = $(".play-now");
  let playNowStartPage = $(".play-now-start");
  let historyPage = $(".history-page");
  let highScore = $(".highscore-page");
  let otherVersions = $(".other-versions");
  let a = translationData.navbar[lang];

  playNow.html('<a class="nav-link" href="/game">' + a.play + '</a>');
  playNowStartPage.html('<a role="button" href="/game" class="btn btn-outline-light center-me my-5">' + a.playstart + '</a>');
  historyPage.html('<a class="nav-link" href="/history">' + a.history + '</a>');
  highScore.html('<a class="nav-link" href="/high-score">' + a.highscore + '</a>');
  otherVersions.html('<a class="nav-link dropdown-toggle" href="/links.html" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + a.versions + ' ' + '</a>' + '<div class="dropdown-menu" aria-labelledby="navbarDropdown">' +
    '<a class="dropdown-item" href="http://www.spelo.se/arkad/sparkanoid" target="_blank">' + "Sparkanoid" + '</a>' +
    '<a class="dropdown-item" href="http://o.www.spela.se/spel_/breakout_5" target="_blank">' + "Breakout 5" + '</a>' +
    '<a class="dropdown-item" href="https://www.crazygames.com/game/atari-breakout" target="_blank">' + "Atari Breakout" + '</a>' + '</div>')
}

function createStartPage(lang) {
  let cardHead = $(".card-headline");
  let card1 = $(".card1");
  let card2 = $(".card2");
  let card3 = $(".card3");
  let a = translationData.cards[lang];

  cardHead.html('<h4>' + a.cardHeadline + '</h4>');
  card1.html('<h5 class="card-title">' + a.card1Name + '</h5>' +
    '<p class="card-text">' + a.card1Desc + '</p>' +
    '<a role="button" href="http://www.spelo.se/arkad/sparkanoid" target="_blank" class="btn btn-outline-light">' + a.cardButton + '</a>');

  card2.html('<h5 class="card-title">' + a.card2Name + '</h5>' +
    '<p class="card-text">' + a.card2Desc + '</p>' +
    '<a role="button" href="http://o.www.spela.se/spel_/breakout_5" target="_blank" class="btn btn-outline-light">' + a.cardButton + '</a>');

  card3.html('<h5 class="card-title">' + a.card3Name + '</h5>' +
    '<p class="card-text">' + a.card3Desc + '</p>' +
    '<a role="button" href="https://www.crazygames.com/game/atari-breakout" target="_blank" class="btn btn-outline-light">' + a.cardButton + '</a>');
}

function createHighscorePage(lang) {
  let highscore = $(".highscore-row");
  let player = $('.player-name');
  let a = translationData.highscoreHeadline[lang];

  highscore.html('<h2 class="col-12 text-center mt-5 mb-4">' + a.highscore + '</h2>');
  player.html('<tr>' + '<th scope="col">#</th>' + '<th scope="col">' + a.highscoreName + '</th>' + '<th scope="col">' + a.points + '</th>'
    + '</tr>');

}

$('.swe-btn').click(function () {
  createHistory('sv');
  createNavbar('sv');
  createStartPage('sv');
  createHighscorePage('sv');
});

$('.eng-btn').click(function () {
  createHistory('en');
  createNavbar('en');
  createStartPage('en');
  createHighscorePage('en');
});