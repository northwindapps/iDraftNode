const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CommentSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    pictureSharedLink:{
        type:String,
        required:true
    },
    thumbUp:{
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
    senderName:{
        type:String,
        required:true
    },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

CommentSchema.plugin(timestamp);
const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;