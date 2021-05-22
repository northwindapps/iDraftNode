const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CommentSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
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
    commentatorName:{
        type:String,
        default:"anonymous"
    },
    popularity:{
        type:Number,
        default:0
    },
    hasReply:{
        type:Boolean,
        default:false
    },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
    postUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

CommentSchema.plugin(timestamp);
const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;