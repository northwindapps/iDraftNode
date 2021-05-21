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
        default:"anonymous"
    },
    language:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:"general"
    },
    thumbUp:{
        type:String,
        default:"0"
    },
    pictureSharedLink:{
        type:String,
        default:"none"
    },
    patreonUrl:{
        type:String,
        default:"none"
    },
    paypalEmail:{
        type:String,
        default:"none"
    },
    newReply:{
        type:Boolean,
        default:false
    },
    popularity:{
        type:Number,
        default:0
    },
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

PostSchema.plugin(timestamp);
const Post = mongoose.model('Post',PostSchema);
module.exports = Post;