import authService from '../Service/authService.js';

const createUser = async (req,res)=>{
    try {
        const data = await authService.createUser(req.body);
        res.status(201).json({
            message: "User created successfully",
            data
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export default { createUser }