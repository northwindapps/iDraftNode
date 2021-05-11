const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    lang:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    thumbUp:{
        type:String,
        required:true
    },
    pictureSharedLink:{
        type:String,
        required:true
    },
    patreonUrl:{
        type:String,
        required:true
    },
    paypalEmail:{
        type:String,
        required:true
    },
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

PostSchema.plugin(timestamp);
const Post = mongoose.model('Post',PostSchema);
module.exports = Post;