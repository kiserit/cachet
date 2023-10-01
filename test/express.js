const express = require('express');
const cachet = require('../dist/index.js');
const cachetOptions = {
  param: 'v',
  cache: 'no-store',  
  ext: ['js','css']
}

const cachetHandler = cachet(cachetOptions)

const app = express()

app.use(cachetHandler)


app.use((req, res) => {
  res.send(`Response from ${req.originalUrl}`)
})

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})