const mongoose = require('mongoose');
//A record lives 1 day.
const VerifySchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    randomString:{
        type:String,
        required:true
    },
    createdAt: { type: Date, default: Date.now, expires: '60m' }
});

const Verify = mongoose.model('Verify',VerifySchema);
module.exports = Verify;