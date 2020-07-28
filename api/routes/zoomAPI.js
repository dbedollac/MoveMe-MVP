var express = require('express');
var router = express.Router();
var http = require("https");

    //Refresh Token -----------------------------------------------------------------------
      router.post('/refresh-token', function(req, res, next) {
        console.log(req.body)

        var options = {
        "method": "POST",
        "hostname": "zoom.us/oauth",
        "port": null,
        "path": "/token?grant_type=refresh_token&refresh_token="+req.body.token,
        "headers": {
          "Authorization": "Basic "+ btoa(req.body.zoomID+':'+req.body.zoomSecret)
        }
        };

        var reqZoom = http.request(options, function (resZoom) {
          console.log(resZoom);
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

// Delete Zoom Meeting------------------------------------------------------------------------
router.post('/delete', function(req, res, next) {
  var http = require("https");

    var options = {
      "method": "DELETE",
      "hostname": "api.zoom.us",
      "port": null,
      "path": "/v2/meetings/"+req.body.meetingID+"?show_previous_occurrences=false",
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
