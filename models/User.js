const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    didLeave:{
        type:Boolean,
        default:false
    },
    profile:{
        type:String,
        default:"none"
    },
    popularity:{
        type:String,
        default:"0"
    }
});
const User = mongoose.model('User',UserSchema);
module.exports = User;