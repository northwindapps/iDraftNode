const errors = require('restify-errors');
const User = require('../models/User');
const Verify = require('../models/Verify');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});

var nodemailer = require('nodemailer');
module.exports = server =>{
    server.post('/register',async (req,res,next)=>{
        const {email,password} = req.body;
        let result = await User.findOne({email:email});
        if (result) {
            console.log("Duplicate. the same email already exsists");
            //TODO Resend Confirmation Email route
            //NOT TODO Password reminder
            return res.send(400);
        }
        const user = new User({
            email,
            password
        });

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt, async(err,hash) =>{
                user.password = hash;
                try{
                    user.save(function(err,result){
                    // const userid = result.id
                    //Send email
                    console.log(req.headers.host);
                    var rand = Math.floor((Math.random() * 10000) + 54);
                    var host=req.headers.host;
                    var link = "http://"+host+"/verify?id="+rand;
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: process.env.FROM_EMAIL,
                          pass: process.env.FROM_PASS
                        }
                      });
                      
                    var mailOptions = {
                        from: process.env.FROM_EMAIL,
                        to: email,
                        subject: 'Complete verification process.',
                        html: "Wellcome to iDraft a language learning community,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });

                    const verify = new Verify({
                        _userId: user._id,
                        randomString:rand
                    });
                    verify.save();
                    res.send(201);
                    next();
                });
                }catch(err){
                    return next(new errors.InternalError(err.message));
                }
            });
        });
    });

    server.post('/login', async (req,res,next)=>{
        const {email,password} = req.body;
        try {
            //If it is not unique here, that means the design has error.
            let result = await User.findOne({email:email});
            if (result) {
                if (!result.isVerified) {
                    console.log(result);
                    return res.send(400);
                }
            }
 
                const user = await auth.authenticate(email,password);
            // const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET,{
            //     expiresIn:'15m'
            // });
                const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET,{});
                const {iat, exp} = jwt.decode(token);
                res.send({iat,exp,token});
                next();
        } catch (err) {
            return next(new errors.UnauthorizedError(err));
        }
    }); 

    server.get('/verify', async (req,res,next)=>{
        try {
        let reqRandomString = await req.query.id;
        // console.log(req.query.id);
       let result = await Verify.find({randomString:reqRandomString});
            if (!result){
                return res.send(400);
            }else{
            result.forEach( async element => {
                let usr = await User.findOne(element._userId);
                usr.isVerified = true;
                usr.save();
                // element.randomString = '';
                // element.save();
                console.log(usr);
                });
                res.send(result);
                next();
            }
        } catch (err) {
            return next(new errors.UnauthorizedError(err));
        }
    }); 

    //TODO leave the service, shutdown account
     //Delete
     server.del('/users/:id',async(req,res,next)=>{
        try{
            const user= await User.findOneAndRemove({_id:req.params.id});
            res.send(204);
            next();
        }catch(err){
            return next(
                new errors.ResourceNotFoundError(
                    `There is no post with the id of ${req.params.id}`));
        }
    });
}