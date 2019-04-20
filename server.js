const express = require('express');
const bodyParser = require('body-parser')

const path = require('path')
const fs = require('fs')

const sanitizeFilename = require('sanitize-filename')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

var database = 'mememe';

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// //Home
// app.get('/api/:username', (req, res) => {
//   var usernamenaka=req.params.username
//   var db = mongojs(database, [usernamenaka]);
//   module.exports = {connect: db };
//    // drop database collection
//   //db.usernamenaka.drop()
//   db.usernamenaka.find(function(err,docs){
//     console.log(docs)
//     res.send(docs)
//   });
// });

const dataPath = path.join(process.cwd(), './data')

app.post('/:username/:templateID', (req, res) => {
  const { username, templateID } = req.params
  const targetFolder = path.join(dataPath, sanitizeFilename(username))
  if(!fs.existsSync(targetFolder)) {
    console.log('user does not exists')
    fs.mkdirSync(targetFolder)
  }
  const filename = sanitizeFilename(templateID)
  const targetFile = path.join(targetFolder, `${filename}.yaml`)

  if(fs.existsSync(targetFile)) {
    res.status(409).send('template already exists')
    return
  }

  fs.writeFileSync(targetFile, req.body)
  res.status(200).send('OK')
})

app.get('/:username/:templateID', (req, res) => {
  const { username, templateID } = req.params
  const targetFile = path.join(dataPath, sanitizeFilename(username), `${sanitizeFilename(templateID)}.yaml`)
  if(!fs.existsSync(targetFile)) {
    res.status(404).send('template not found')
  } else {
    res.sendFile(targetFile)
  }
})

// //Create
// app.post('/api/:username',(req,res)=>{
//   var usernamenaka=req.params.username
//   var db = mongojs(database, [usernamenaka]);
//     db.usernamenaka.find(function(err,docs){
//     console.log(docs.length)
//     var newmeme={
//       text: req.body.text
//     }
//     console.log(newmeme)
//     db.usernamenaka.insert(newmeme)
//   });
// });

// //Remove
// app.get('/api/:username/:memeid', (req, res) => {
//   var usernamenaka=req.params.username
//   var db = mongojs(database, [usernamenaka]);
//     console.log("remove id: "+ObjectId(req.params.memeid))
//     var mq={_id:ObjectId(req.params.memeid)}
//     db.usernamenaka.remove(mq)
// });
