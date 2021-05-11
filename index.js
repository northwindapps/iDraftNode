const restify = require('restify');
const mongoose = require('mongoose');
const rjwt = require('restify-jwt-community');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});
const server = restify.createServer();

//Middleware
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(process.env.PORT,()=>{
    mongoose.connect(
        process.env.MONGODB_URI,
        {useNewUrlParser:true, useCreateIndex:true,useUnifiedTopology: true,useFindAndModify:false}
    );
});

const db = mongoose.connection;
db.on('error',err => console.log(err));
db.once('open', () =>{
    require('./routes/comments.js')(server);
    require('./routes/users.js')(server);
    require('./routes/posts.js')(server);
    console.log(`Server started on port ${process.env.PORT}`);
});