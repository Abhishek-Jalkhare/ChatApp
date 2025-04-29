const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        
    },
    email: {
        type: String,
        
        unique: true
    },
    displayName: {
        type: String,
       
    },
    image: {
        type: String,
        default:'./resources/default-profile-picture.avif'
    },
    socketId: {
        type: String,
        default: ''
    },
    password: {
        type: String,
       
    },
},
    {
        timestamps: true
    }
);


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model("user" , userSchema);
module.exports = User;
