const express = require('express')
const path = require('path')
const app = express();
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '4ffd7220f901470a86aed2e398d41b79',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

rollbar.log('Hello world!')

app.get('/api/robots', (req, res) => {
    rollbar.log('bots endpoints hit')
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        rollbar.critical('error getting bots', error)
    }
})

app.get('/api/robots/five', (req, res) => {
    rollbar.log('five bots endpoints hit')
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
       rollbar.critical('error grtting FIVE bots', error)
    }
})

app.post('/api/duel', (req, res) => {
    rollbar.log('deul duos')
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        rollbar.critical('error Dueling', error)
    }
})

app.get('/api/player', (req, res) => {
    rollbar.log('player stats')
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
       rollbar.critical('error getting Player Stats', error)
    }
})

app.listen(4000, () => {
  console.log(`Listening on 4000`)
})
