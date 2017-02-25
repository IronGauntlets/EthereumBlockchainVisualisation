url = "http://localhost:8081";

http.get(url, (res, err) => {
  if (res != null) {
    console.log(res);
  } else {
    console.error(err);
  }
})
