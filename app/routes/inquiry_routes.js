// require express and passport
const express = require('express')
const passport = require('passport')

// pull in the mongoose model
const Inquiry = require('../models/inquiry')

// pull in some error handlers and other middleware
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// middleware to remove blanks if needed
const removeBlanks = require('../../lib/remove_blank_fields')

// require token for authentication
const requireToken = passport.authenticate('bearer', { session: false })

// now we bring in the router function
const router = express.Router()

// we can now create our routing functions

// INDEX
// GET /inquiry
router.get('/inquiries', requireToken, (req, res, next) => {
  Inquiry.find()
    .then(inquiries => {
      return inquiries.map(inquiry => inquiry.toObject())
    })
    .then(inquiries => res.status(200).json({ inquiries: inquiries }))
    .catch(next)
})

// SHOW
// GET/inquiries/:id
router.get('/inquiries/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Inquiry.find({ owner: req.user.id, _id: id })
    .then(handle404)
    .then((inquiry) => res.status(200).json({ inquiry: inquiry }))
    .catch(next)
})

// CREATE
// POST /inquiries
router.post('/inquiries', requireToken, (req, res, next) => {
  req.body.inquiry.owner = req.user.id
  Inquiry.create(req.body.inquiry)
    .then(inquiry => {
      res.status(201).json({ inquiry: inquiry.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /inquiries/:id
router.patch('/inquiries/:id', requireToken, removeBlanks, (req, res, next) => {
  // if client tries to change the owner by including a new owner, prevent that by deleting the key/value pair
  delete req.body.inquiry.owner
  Inquiry.findById(req.params.id)
    .then(handle404)
    .then(inquiry => {
      // throws an error if the user updating isnt the owner
      requireOwnership(req, inquiry)
      // pass the result to mongoose's updateOne method
      return inquiry.updateOne(req.body.inquiry)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /inquiries/:id
router.delete('/inquiries/:id', requireToken, (req, res, next) => {
  Inquiry.findById(req.params.id)
    .then(handle404)
    .then(inquiry => {
      requireOwnership(req, inquiry)
      inquiry.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
