import User from '../Model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const createUser = async (data)=>{
    const createdUser = await User.create(data);

    return createdUser;
}


export default createUser;
