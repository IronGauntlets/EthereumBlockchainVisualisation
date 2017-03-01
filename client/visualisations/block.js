var host = "http://localhost";
var port = "3000";

var url = host + ':' + port;
var requestURL = url + '/api/block';

http.get(requestURL, (res) => {
  console.log(res);
});
