const errors = require('restify-errors');
const Post = require('../models/Post');
const User = require('../models/User');

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
            language,
            category,
            thumbUp,
            pictureSharedLink,
            patreonUrl,
            paypalEmail,
            newReply,
            _userId
        } = req.body;
        const post= new Post({
            title,
            body,
            author,
            language,
            category,
            thumbUp,
            pictureSharedLink,
            patreonUrl,
            paypalEmail,
            newReply,
            _userId
        });
        try {
            let guard = await User.findOne({_id:_userId});
            if (!guard){
                return res.send(400);
            }
            const newPost = await post.save();
            res.send(201);
            next();
        } catch (error) {
            return next(new errors.InternalError(error.message));
        }
    });
    //list
    server.get('/posts', async (req,res,next) => {
        // res.send({msg:'test'});
        try{
            const posts =  await Post.find({}).sort({createdAt:1}).limit(100);
            res.send(posts);
            next();
        }catch(err){
            return next(new errors.InvalidContentError(err));
        }
    });
     //search
     server.get('/posts/searches', async (req,res,next) => {
        // resourcename?language=123  
        // https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript
        try{
            let languageStr = await req.query.language;
            let userIdStr = await req.query.userId;
            if (typeof languageStr === 'string') {
                const posts =  await Post.find({language:languageStr}).sort({createdAt:1}).limit(100);
                res.send(posts);
            }
            if (typeof userIdStr === 'string') {
                const posts =  await Post.find({_userId:userIdStr});
                res.send(posts);
            }
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
            console.log(req.params.id);
            const post= await Post.findOneAndRemove({_id:req.params.id});
            res.send(204);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no post with the id of ${req.params.id}`));
        }
    });
    //Delete posts by userid
    server.del('/posts/userid/:userid',async(req,res,next)=>{
        try{
            const post= await Post.deleteMany({_userId:req.params.userid});
            res.send(204);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no post with the userid of ${req.params.userid}`));
        }
    });

    server.get('/posts/notify/:id', async (req,res,next)=>{
        try {
            const result = await Post.findById(req.params.id);
            if (!result){
                return res.send(400);
            }else{
                result.newReply = true;
                result.save();
                res.send(200);
                next();
            }
        } catch (err) {
            return next(new errors.UnauthorizedError(err));
        }
    }); 

    server.get('/posts/notify/off/:id', async (req,res,next)=>{
        try {
            const result = await Post.findById(req.params.id);
            if (!result){
                return res.send(400);
            }else{
                result.newReply = false;
                result.save();
                res.send(200);
                next();
            }
        } catch (err) {
            return next(new errors.UnauthorizedError(err));
        }
    }); 
};