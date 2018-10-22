$.getJSON('/json/content.json', function (data) {
  jsonData = data;
  createHistory("en");
});

function createHistory(lang) {
  let title = $(".history-title");
  let titleImg = $(".history-img");
  let game = $(".history-gameplay");
  let ports = $(".history-ports");
  let a = jsonData.history[lang];

  title.html("<h3>" + a.title + "</h3>" + "<p>" + a.desc + "</p>");
  titleImg.html('<img src="imgs/arcadeflyer.jpg">');
  game.html("<h3>" + a.gametitle + "</h3>" + "<p>" + a.gameplay + "</P>" + "<h3>" + a.portstitle + "</h3>");
  ports.html("<p>" + a.ports + "</p>");
}

function createNavbar(lang){
  let playNow = $(".play-now");
  let playNowStartPage = $(".play-now-start");
  let historyPage = $(".history-page");
  let highScore = $(".highscore-page");
  let a = jsonData.navbar[lang];

  playNow.html('<a class="nav-link" href="/game">' + a.play + '</a>');
  playNowStartPage.html('<a role="button" href="/game" class="btn btn-outline-light center-me my-5">' + a.playstart + '</a>');
  historyPage.html('<a class="nav-link" href="/history">' + a.history + '</a>');
  highScore.html('<a class="nav-link" href="/high-score">' + a.highscore + '</a>');
}

$('.swe-btn').click(function () {
  createHistory('sv');
  createNavbar('sv');
});

$('.eng-btn').click(function () {
  createHistory('en');
  createNavbar('en');
});