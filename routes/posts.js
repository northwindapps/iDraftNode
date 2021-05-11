const errors = require('restify-errors');
const Post = require('../models/Post');

module.exports = server =>{
    //Add 
    server.post('/posts',async(req,res,next)=>{
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        const {
            title,
            body,
            author,
            lang,
            category,
            thumbUp,
            pictureSharedLink,
            patreonUrl,
            paypalEmail,
            _userId
        } = req.body;
        const post= new Post({
            title,
            body,
            author,
            lang,
            category,
            thumbUp,
            pictureSharedLink,
            patreonUrl,
            paypalEmail,
            _userId
        });
        try {
            const newPost = await post.save();
            res.send(201);
            next();
        } catch (error) {
            return next(new errors.InternalError(err.message));
        }
    });
    //list
    server.get('/posts', async (req,res,next) => {
        // res.send({msg:'test'});
        try{
            const posts =  await Post.find({});
            res.send(posts);
            next();
        }catch(err){
            return next(new errors.InvalidContentError(err));
        }
    });
    //single cutomer, show
    server.get('/posts/:id', async (req,res,next) => {
        try{
            const post=  await Post.findById(req.params.id);
            res.send(post);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no post with the id of ${req.params.id}`));
        }
    });
    //Update
    server.put('/posts/:id',async(req,res,next)=>{
        try {
            const post= await Post.findOneAndUpdate(
            { _id: req.params.id },
                req.body
            );
            res.send(200);
            next();
        } catch (error) {
            return next(
                new errors.ResourceNotFoundError(
                    `There is no post with the id of ${req.params.id}`));
        }
    });
    //Delete
    server.del('/posts/:id',async(req,res,next)=>{
        try{
            const post= await Post.findOneAndRemove({_id:req.params.id});
            res.send(204);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no post with the id of ${req.params.id}`));
        }
    });
};