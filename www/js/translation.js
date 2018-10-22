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

  title.append("<h3>" + a.title + "</h3>");
  title.append("<p>" + a.desc + "</p>");
  titleImg.append('<img src="imgs/arcadeflyer.jpg">');
  game.append("<h3>" + a.gametitle + "</h3>");
  game.append("<p>" + a.gameplay + "</P>");
  game.append("<h3>" + a.portstitle + "</h3>");
  ports.append("<p>" + a.ports + "</p>");
}