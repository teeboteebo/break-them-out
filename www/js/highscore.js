$.getJSON('/json/highscore.json', function (data) {
  jsonData = data;
  createHighscore();
});

function createHighscore() {
  let a = jsonData;
  let highscore = $(".highscoreList");

  for (i = 1; i <= 10; i++) {
    if (i === 1) {
      highscore.append(' <tr class="first-place">' +
        ' <th scope="row">' + i + '</th>' +
        ' <td>' + a[i]["name"] + '</td>' +
        ' <td>' + a[i]["score"] + '</td>' +
        '</tr>');
    }
    else if (i === 2) {
      highscore.append(' <tr class="second-place">' +
        ' <th scope="row">' + i + '</th>' +
        ' <td>' + a[i]["name"] + '</td>' +
        ' <td>' + a[i]["score"] + '</td>' +
        '</tr>');
    }
    else if (i === 3) {
      highscore.append(' <tr class="third-place">' +
        ' <th scope="row">' + i + '</th>' +
        ' <td>' + a[i]["name"] + '</td>' +
        ' <td>' + a[i]["score"] + '</td>' +
        '</tr>');
    }
    else {

      highscore.append(' <tr>' +
        ' <th scope="row">' + i + '</th>' +
        ' <td>' + a[i]["name"] + '</td>' +
        ' <td>' + +a[i]["score"] + '</td>' +
        '</tr>');
    }
  }
}



