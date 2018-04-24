const apikey = "?app_id=eyJUb2tlblR5cGUiOiJBUEkiLCJzYWx0IjoiYTIxZWY5YjktNDJiZC00ZDUzLThmY2MtYWZiYmM0MDQ5YzgwIiwiYWxnIjoiSFM1MTIifQ.eyJqdGkiOiI1Y2I4ZWZiOS01ODAxLTQ5M2ItYTk3Ni04ZDExZGY4NTU5ZmYiLCJpYXQiOjE1MjQ0OTcxMTF9.vFyJz5zqTR1rbfiNHZMy8Q3ortT4TVTJfOx_Y - xUT - CAzUIYDREuyIxuV - o_hPxYOmL2_5VtGNa4iY_wuGFhjw";
const url = 'https://rest.bandsintown.com/artists/';

//Global variables
var artistName = 0;
var startDate = '2018-04-21';
var endDate = '2018-12-31';
var events;
var error1 = 'Nie ma w bazie takiego artysty :(';
var error2 = 'Błąd skryptu :(';

function setArtistName(artist) {
  artistName = artist;
}

function reset() {
  document.getElementById("errors").innerHTML = '';
  document.getElementById("list").innerHTML = '';
}

function setEvents(data) {
  events = data;
  var filtered = events.filter(event => (event.datetime >= startDate && event.datetime <= endDate));
  showEvents(filtered);
}

function getNewArtistUrl(name) {
  return url + name + apikey;
}

function getEventsURL(name) {
  return url + name + "/events/" + apikey;
}

function getAllEvents() {
  if (artistName) {
    var url = getEventsURL(artistName);
    getEventsData(url);
  }
}

function getEventsData(url) {
  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data);
      setEvents(data);
    })
    .catch(error => {
      var errors = document.getElementById("errors");
      list.innerHTML = 'Błąd skryptu :(';
    });
}

function getArtistData(url) {
  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      setArtistName(data.name);
      getAllEvents();
    })
    .catch(error => {
      console.log(error);
      var errors = document.getElementById("errors");
      errors.innerHTML = error1;
      artistName = 0;
    });
}


function showEvents(events) {
  var re = /T.*/g;

  var list = document.getElementById("list");
  var html = '<table class="events-table"><thead><tr><th>Artysta</th><th>Data</th><th>Państwo</th><th>Miasto</th><th>Link</th></tr></thead><tbody>';

  for (var event in events) {

    var newDate = events[event].datetime.replace(re, '');

    html += '<tr>';
    html += '<td>' + artistName + '</td>';
    html += '<td>' + newDate + '</td>';
    html += '<td>' + events[event].venue.country + '</td>';
    html += '<td>' + events[event].venue.city + '</td>';
    html += '<td>' + '<a href="' + events[event].url + '" target="_blank">' + 'Zobacz wydarzenie' + '</a></td>';
    html += '<tr>';
  }
  list.innerHTML = html;
}


function search(artist) {
  var url = getNewArtistUrl(artist);
  getArtistData(url);
}

function getFormData() {
  var artist = document.getElementById('artist').value;
  search(artist);
}


document.addEventListener("DOMContentLoaded", function (event) {
  const element = document.querySelector('#searchForm');
  element.addEventListener('submit', event => {
    event.preventDefault();
    reset();
    getFormData()
  });
});






$(document).ready(function () {
  $(function () {
    $('input[name="daterange"]').daterangepicker({
      locale: {
        format: 'YYYY-MM-DD'
      },
      startDate: startDate,
      endDate: endDate
    });
  });

  $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
    startDate = picker.startDate.format('YYYY-MM-DD');
    endDate = picker.endDate.format('YYYY-MM-DD');
  });
});
