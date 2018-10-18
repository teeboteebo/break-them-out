let historyDaa;

$.getJSON('/json/content.json', function (data) {
  historyData = data;
  createHistory("sv");
});

function createHistory(lang) {
  let title = $(".history-title");
  let a = historyData.history[lang];
  title.append("<p>" + a.title + "</p>");
  title.append("<p>" + a.desc + "</p>");
  title.append("<p>" + a.gameplay + "</p>");
  title.append("<p>" + a.ports + "</p>");
}