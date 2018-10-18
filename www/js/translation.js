let historyDaa;

$.getJSON('/json/content.json', function (data) {
  historyData = data;
  createHistory("en");
});

function createHistory(lang) {
  let title = $(".history-title");
  let titleImg = $(".history-img");
  let gameplay = $(".history-gameplay");
  let ports = $(".history-ports");
  let a = historyData.history[lang];
  title.append("<h3>" + a.title + "</h3>");
  title.append("<p>" + a.desc + "</p>");
  titleImg.append('<img src="imgs/arcadeflyer.jpg">');
  gameplay.append("<p>" + a.gameplay + "</P>");
  ports.append("<p>" + a.ports + "</p>");
}