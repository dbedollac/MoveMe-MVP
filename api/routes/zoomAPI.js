var express = require('express');
var router = express.Router();
var http = require("https");

//CreateZoomMeeting -----------------------------------------------------------------------
  router.post('/', function(req, res, next) {

    var options = {
    "method": "POST",
    "hostname": "api.zoom.us",
    "port": null,
    "path": "/v2/users/me/meetings",
    "headers": {
      "content-type": "application/json",
      "authorization": "Bearer "+req.body.token
    }
  };

    var reqZoom = http.request(options, function (resZoom) {
      var chunks = [];

      resZoom.on("data", function (chunk) {
        chunks.push(chunk);
      });

      resZoom.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        res.send(body.toString())
      });
    });

    reqZoom.write(JSON.stringify(
      req.body.settings
     ));

    reqZoom.end();

    });

  // GetZoomMeeting Details------------------------------------------------------------------------
  router.post('/getdata', function(req, res, next) {
    var http = require("https");

      var options = {
        "method": "GET",
        "hostname": "api.zoom.us",
        "port": null,
        "path": "/v2/meetings/"+req.body.meetingID,
        "headers": {
          "authorization": "Bearer "+req.body.token
        }
      };

      var reqZoom = http.request(options, function (resZoom) {
        var chunks = [];

        resZoom.on("data", function (chunk) {
          chunks.push(chunk);
        });

        resZoom.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
          res.send(body.toString())
        });
      });

      reqZoom.end();
    });

module.exports = router;
