import mongoose from 'mongoose';

const userSchema = new mongoose.schema({
    username: {
        type:String,
        required:[true,'Username is required'],
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        trim:true,
        validate:{
            validator:(value)=>{
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                return emailRegex.test(value);
            },
            message:'Please enter a valid email address'
        },
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        maxLength:[12,'Password cannot be more than 12 characters long'],
        minLength:[6,'Password must be at least 6 characters long']
    },
    role:{
        type:String,
        enum:['USER','GUIDE','ADMIN'],
        default:'USER'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    profileImageUrl:{
        type:String,
    }
})

const User = mongoose.model('User',userSchema);

export default User;