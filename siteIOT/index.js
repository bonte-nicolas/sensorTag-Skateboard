var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    var MongoClient = require('mongodb').MongoClient;

  var uri = "mongodb+srv://admin:admin@cluster0-hz44e.mongodb.net/test";
  let resString = "";
  MongoClient.connect(uri, function(err, db) {
  	if (err) throw err;
  	var dbo = db.db("IOT");
    res.setHeader('Content-Type', 'text/html');
    var stringHtml = '';
    stringHtml += '<!DOCTYPE html> <html> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>html,body,h1,h2,h3,h4,h5 {font-family: "Raleway", sans-serif} ol {background: #ff9999;padding: 20px;}ul {background: #3399ff;padding: 20px;}ol li {background: #ffe5e5;padding: 5px;margin-left: 35px;}ul li {background: #cce5ff;margin: 5px;} </style> </head> <body class="w3-light-grey"> <div class="w3-bar w3-top w3-black w3-large" style="z-index:4"><button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" onclick="w3_open();"><i class="fa fa-bars"></i>  Menu</button><span class="w3-bar-item w3-right">SkateboardApp</span></div> <div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div><div class="w3-main" style="margin-left:300px;margin-top:43px;"><div class="w3-container"><h5>Mouvements</h5><table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">';
    stringHtml += '<tr><td> Accelerometre X </td> <td> Accelerometre Y </td> <td> Accelerometre Z </td> <td> Gyroscope X </td> <td> Gyroscope Y </td> <td> Gyroscope Z</td></tr>';
    dbo.collection("mouvements").find({}).toArray(function(err, result) {
    for (var r of result) {
    	stringHtml += '<tr><td>'+ r.xAccelerometre + '</td> <td>' + r.yAccelerometre + '</td> <td>' + r.zAccelerometre + '</td> <td>'+ r.xGyroscope + '</td> <td>' + r.yGyroscope + '</td> <td>' + r.zGyroscope + '</td></tr>';
    }
    stringHtml += '</table></div><br><div class="w3-container"><h5>Réferences</h5><table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">';
    stringHtml += '<tr><td> Nom </td> <td> Ordre </td> <td> Accelerometre X </td> <td> Accelerometre Y </td> <td> Accelerometre Z </td> <td> Gyroscope X </td> <td> Gyroscope Y </td> <td> Gyroscope Z</td></tr>';
    dbo.collection("references").find({}).toArray(function(err, result) {
    for (var r of result) {
    	stringHtml += '<tr> <td>' + r.nom +'</td> <td>' + r.ordre +'</td><td>'+ r.xAccelerometre + '</td> <td>' + r.yAccelerometre + '</td> <td>' + r.zAccelerometre + '</td> <td>'+ r.xGyroscope + '</td> <td>' + r.yGyroscope + '</td> <td>' + r.zGyroscope + '</td></tr>';
    }
    stringHtml += '</table></div></body>  <footer class="w3-container w3-padding-16 w3-light-grey"><h4>SkateboardApp</h4><p>Coralie Le Foll - Nicolas Bonte © 2018</p></footer> </html>';
    res.send(stringHtml);
        });
        });
});
});

app.listen(8080);