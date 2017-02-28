var host = "http://localhost";
var port = "3000";

var url = host + ':' + port;

var requestURL = url + '/block';


http.get(url, (res) => {
  if (res != null) {
    console.log(res);
  }
});
