"use strict"

const {authen} = require('../lib/authen')

function validateParams() {
  return function(req, res, next) {
    if (req.body.number) {
      next()
    } else {
      res.status(400).json({ error: 'Bad parameters'})
    }
  }
}

function getActivateCode(helpers) {
  return function(req, res, next) {
    helpers.Database.ORDER.find({uid: `= ${req.uid}`, number: `= ${req.body.number}`})
    .then( data => {
      if (data && data.length > 0) {
        req.code = data[0].activationCode
        next()
      } else {
        res.status(404).json({ error: 'Not found'})
      }
    })
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'FIND order',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

function deleteOrder(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const number = req.body.number
    helpers.Database.batchWrite({
      ORDER: {
        remove: [{uid, number}]
      },
      ACTIVECODE: {
        remove: [{ code: req.code }]
      }
    })
    .then( () => res.status(200).json({ status: 'success' }))
    .catch(err => {
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'DELETE /me/order',
        error: err
      })
      res.status(500).json({ reason: 'Failed to Access Database' })
    })
  }
}

module.exports = [authen, validateParams, getActivateCode, deleteOrder]
