$.getJSON('/json/highscore.json', function (data) {
  jsonData = data;
  createHighscore();
});

function createHighscore() {
  let a = jsonData;
  let highscore = $(".highscoreList");

  for (i = 0; i < 10; i++) {
    highscore.append(' <tr>' +
      ' <th scope="row">' + (i+1) + '</th>' +
      ' <td>' + a[i]["name"] + '</td>' +
      ' <td>' + +a[i]["score"] + '</td>' +
      '</tr>');
  }
}



