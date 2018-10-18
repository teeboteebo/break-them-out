let historyDaa;

$.getJSON('/json/content.json', function (data) {
  historyData = data;
  createHistory("en");
});

function createHistory(lang) {
  let title = $(".history-title");
  // for (let history in historyData) {
    let a = historyData.history[lang];
    // for (let data of a[lang]){
      title.append("<p>" + a.title + "</p>");
      title.append("<p>" + a.desc + "</p>");
      title.append("<p>" + a.gameplay + "</p>");
      title.append("<p>" + a.ports + "</p>");
    // }
  // }
}