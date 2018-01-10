const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // sets up layout in database (eg tables)
    _id: mongoose.Schema.Types.ObjectId, // serial id, long string ued internally
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        // match can be middleware or regEx
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        
    }, // unique dosn;t add validation, just makes it easiler to seach knowing that there will only be one value
    password: { type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);