$.getJSON('/json/content.json', function (data) {
  historyData = data;
  createHistory("en");
});

function createHistory(lang) {
  let title = $(".history-title");
  let titleImg = $(".history-img");
  let game = $(".history-gameplay");
  let ports = $(".history-ports");
  let a = historyData.history[lang];

  title.html("<h3>" + a.title + "</h3>" + "<p>" + a.desc + "</p>");
  titleImg.html('<img src="imgs/arcadeflyer.jpg">');
  game.html("<h3>" + a.gametitle + "</h3>" + "<p>" + a.gameplay + "</P>" + "<h3>" + a.portstitle + "</h3>");
  ports.html("<p>" + a.ports + "</p>");
}

function createNavbar(lang){
  let playNow = $(".play-now");
  let historyPage = $(".history-page");
  let highScore = $(".highscore-page");
  let a = navbarData.navbar[lang];

  playNow.html(a.play);
}

$('.swe-btn').click(function () {
  createHistory('sv');
});

$('.eng-btn').click(function () {
  createHistory('en');
});