const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const fileUpload = require("express-fileupload")
const proxy = require('http-proxy-middleware')


// set port, listen for requests
const PORT = process.env.PORT || 5000

const app = express()
app.use(fileUpload())
// parse requests of content-type - application/json
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const db = require("./app/models")

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!")
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err)
    process.exit()
  })

require("./app/routes/film.routes")(app)

module.exports = function(app) {
  // add other server routes to path array
  app.use(proxy(['/api', '/api/films', '/api/', ], { target: 'http://localhost:5000' }));
}

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
