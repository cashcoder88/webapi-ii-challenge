const express = require('express');

const db = require('./data/db.js');

const server = express();
server.use(express.json());

server.get('/api/posts', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({
             error: "The users information could not be retrieved." 
        });
    });
});

server.get('/api/posts/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: "The user information could not be retrieved."
        })
    })

})
//come back to this one
server.get('/api/posts/:id/comments', (req, res) => {
    const {id} = req.params;
    db.findCommentById(id)
    .then(comments => {
        if (comments) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: "The comment information could not be retrieved."
        })
    })

})

server.delete('/api/posts/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
    .then(deleted => {
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: "The user could not be removed" 
        })
    })
})






server.listen(6000, () => {
    console.log('Listening On Port 6000')
})