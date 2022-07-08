const express = require('express')
const Gun = require('gun')
const app = express()
const port = 4040

app.use(Gun.serve)

const server = app.listen(port, () => {
  console.log(`gun server listening at http://localhost:${port}`)
})

Gun({ web: server })
