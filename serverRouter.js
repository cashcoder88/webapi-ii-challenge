const db = require('./data/db.js');

const router = require('express').Router();

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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
router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    db.findCommentById(id)
    .then(comment => {
        console.log(comment)
        if (comment) {
            res.status(200).json(comment);
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

router.delete('/:id', (req, res) => {
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

router.post('/', (req, res) => {
    const {title, contents} = req.body;
    const postInfo = req.body;
    if (!title || !contents ) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    } else {
        db.insert(postInfo)
        .then(posts => {
            res.status(201).json(posts)
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the post to the database"
        })
    })}
});


router.post('/:id/comments', async (req, res) => {
    const comment = req.body;
    try {
        let post = await db.findById(req.params.id)
        if (post.length > 0) {
            console.log('Comment', comment)
            let results = await db.insertComment(comment) 
            if (results && results.id) {
                let newComment = await db.findCommentById(results.id)
                res.status(201).json(newComment)
            } else {
                res.status(500).json({
                    error: "There was an error while saving the comment to the database"
                })
            }
            // console.log('RESULTS', results)
            // res.sendStatus(200);
        } else {
            res.status(404).json({
                message: "the post with specified ID was not found"
            })
        }
        
    }
    catch(err) {
        console.error(err)
        res.status(500).json({
            error: 'something is going wrong, 500'
        })
    }
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    const {title, contents} = req.body;
    const {id} = req.params;
    if (!title || !contents ) {
        res.status(400).json({ 
            errorMessage: "Please provide title and contents to update the post." 
        })
    }
    else 
    db.update(id, changes)
    .then(updated => {
        if (updated) {
            res.status(200).json(updated)
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: "The information could not be modified."
        })
    })
    
})



module.exports = router;