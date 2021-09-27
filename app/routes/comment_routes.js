const express = require('express')
const passport = require('passport')

const Comment = require('../models/comment')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET
router.get('/comments/', requireToken, (req, res, next) => {
  Comment.find()
    .then(comments => {
      return comments.map(comment => comment.toObject())
    })
    .then(comments => res.status(200).json({ comments: comments }))
    .catch(next)
})

// SHOW
// GET by ID
router.get('/comments/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Comment.findById(id)
    .then(handle404)
    .then(comment => requireOwnership(req, comment))
    .then((comment) => res.status(200).json({ comment: comment }))
    .catch(next)
})
// CREATE
// POST
router.post('/comments/', requireToken, (req, res, next) => {
  req.body.comment.owner = req.user.id
  Comment.create(req.body.comment)
    .then(comment => {
      res.status(201).json({ comment: comment.toObject() })
    })
    .catch(next)
})
// UPDATE
// PATCH
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  // if client tries to change owner by including new owner, prevent that by deleting the key value pair
  delete req.body.comment.owner
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)
      return comment.updateOne(req.body.comment)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})
// DELETE
// DELETE
router.delete('/comments/:id', requireToken, (req, res, next) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)
      comment.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
