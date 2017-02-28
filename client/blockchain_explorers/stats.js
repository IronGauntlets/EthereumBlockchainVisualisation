var offset = 0;
var count = 10

var req = [
  "https://etherchain.org/api/difficulty", //diffculty
  "https://etherchain.org/api/basic_stats", //basic stats
  "https://etherchain.org/api/blocks/"+ offset+ "/" + count //Gets count blocks starting from the offest
]

http.get(req[1], (res) => {
  if (res != null) {
    console.log(JSON.parse(res));
  }
})
