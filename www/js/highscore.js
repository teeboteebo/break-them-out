let highscoreJson;
$.getJSON('/json/highscore.json', function (data) {
  highscoreJson = data;
  createHighscore();
});

function createHighscore() {
  let a = highscoreJson;
  let highscore = $(".highscoreList");

  for (i = 0; i < highscoreJson.length; i++) {
    highscore.append(' <tr>' +
      ' <th scope="row">' + (i+1) + '</th>' +
      ' <td>' + a[i]["name"] + '</td>' +
      ' <td>' + +a[i]["score"] + '</td>' +
      '</tr>');
  }
}



