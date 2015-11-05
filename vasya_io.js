module.exports = function(app, io){

  var fs = require('fs');
  
  var users = [];
  var url = 'mongodb://85.143.218.29:27017/images';

  var mongodb = require('mongodb');
      MongoClient = mongodb.MongoClient;

  function onCollection(err, collection) {
      var cursor = collection.find({}, { tailable: true, awaitdata: true } ),
      cursorStream = cursor.stream(),
      itemsProcessed = 0

      cursorStream.on('data', function (data) {
          console.log(data);
          itemsProcessed++;
      });
  }

  function onConnected(err, db) {
      db.collection('images', onCollection);
  }

  MongoClient.connect(url, onConnected);

// Setup the ready route, and emit talk event.
  app.io.route('connection', function(req) {
      users.push[req.io.request.socket.id];

      console.log(req.io.request.socket.id);
      req.io.emit('total', {})
  })

  // Send the client html.
  app.get('/', function(req, res) {
      console.log('/');
      res.sendfile(__dirname + '/index.html')
  })

  app.post('/upload', function(req, res) {
      var fstream;

      console.log("CAM: " +req.headers['camid']);

      console.log(req.io);
      console.log(io.sockets );

      // app.io.to(users[0]).emit('total', {cam: req.headers['camid']})

      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
          console.log("Uploading: " + filename); 
          fstream = fs.createWriteStream(__dirname + '/files/' + filename);
          file.pipe(fstream);
          fstream.on('close', function () {
              res.redirect('back');
          });
      });
  });
};