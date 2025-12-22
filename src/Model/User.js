import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    isVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:null
    },
    otp:{
        type:String,
        default:null
    },  
    otpExpiryTime:{
        type:Date,
        default:null
    },
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;