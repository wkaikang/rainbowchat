const express = require('express')
const Joi = require('@hapi/joi')
const { addAgent, findAgents} = require('./db')

const router = express.Router()

const itemSchema = Joi.object().keys({
  name: Joi.string(),
  tag: Joi.array(),
  Availability: Joi.boolean()
})

router.post('/agent', (req, res) => {
    // We get the item from the request body
    const agent = req.body
    console.log(req.body)
    // The itemSchema is used to validate the fields of the item
    const result = itemSchema.validate(agent)
    if (result.error) {
      // if any of the fields are wrong, log the error and return a 400 status
      console.log(result.error)
      res.status(400).end()
      return
    }
  
    // If the validation passes, insert the item into the DB
    addAgent(agent)
      .then(() => {
        // Once the item is inserted successfully, return a 200 OK status
        res.status(200).end()
      })
      .catch((err) => {
        // If there is any error in inserting the item, log the error and
        // return a 500 server error status
        console.log(err)
        res.status(500).end()
      })
  })

  router.get('/agents', (req, res) => {
    findAgents()
      .then((agents) => {
        agents = agents.map((agent) => ({
          id: agent._id,
          tag: agent.tag,
          availability: agent.availability
        }))
        res.json(agents)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).end()
      })
  })
  
  module.exports = router
