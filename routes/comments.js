const errors = require('restify-errors');
const Comment = require('../models/Comment');

module.exports = server =>{
    //Add 
    server.post('/comments',async(req,res,next)=>{
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        const {
            body,
            pictureSharedLink,
            thumbUp,
            patreonUrl,
            paypalEmail,
            senderName,
            postId,
            _userId
        } = req.body;
        const comment= new Comment({
            body,
            pictureSharedLink,
            thumbUp,
            patreonUrl,
            paypalEmail,
            senderName,
            postId,
            _userId
        });
        try {
            const newComment = await comment.save();
            res.send(201);
            next();
        } catch (error) {
            return next(new errors.InternalError(err.message));
        }
    });
    //list
    server.get('/comments', async (req,res,next) => {
        // res.send({msg:'test'});
        try{
            const comments =  await Comment.find({});
            res.send(comments);
            next();
        }catch(err){
            return next(new errors.InvalidContentError(err));
        }
    });
    //single cutomer, show
    server.get('/comments/:id', async (req,res,next) => {
        try{
            const comment=  await Comment.findById(req.params.id);
            res.send(comment);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no comment with the id of ${req.params.id}`));
        }
    });
    //Update
    server.put('/comments/:id',async(req,res,next)=>{
        try {
            const comment= await Comment.findOneAndUpdate(
            { _id: req.params.id },
                req.body
            );
            res.send(200);
            next();
        } catch (error) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no comment with the id of ${req.params.id}`));
        }
    });
    //Delete
    server.del('/comments/:id',async(req,res,next)=>{
        try{
            const comment= await Comment.findOneAndRemove({_id:req.params.id});
            res.send(204);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no comment with the id of ${req.params.id}`));
        }
    });
};