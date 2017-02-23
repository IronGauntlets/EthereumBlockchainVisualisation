offset = 0;
count = 10

var req = [
  "https://etherchain.org/api/difficulty", //diffculty
  "https://etherchain.org/api/basic_stats", //basic stats
  "https://etherchain.org/api/blocks/"+ offset+ "/" + count //Gets count blocks starting from the offest
]


var xhr = new XMLHttpRequest();
xhr.open("GET", req[1], true);
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      res = JSON.parse(xhr.responseText);
      console.log(res.data);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = function (e) {
  console.error(xhr.statusText);
};
xhr.send(null);
