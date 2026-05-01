import * as z from "zod"

export const loginUserValidator = async(req,res,next) =>{
try {
    const loginUserSchema =z.object({
        email: z.email(),
        password: z.string().nonempty("password is required")  
    }).strict()
    const data = loginUserSchema.parse(req.body);
    next()
} catch (error) {
    console.log(error);
    return res.status(500).send({
        status:"error",
        message:error.message
    })
}
}

export const registerUserValidator = async(req,res,next) =>{
try {
    const newUserSchema =z.object({
        name: z.string(),
        email: z.email(),  
        password: z.string().min(6).max(12).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
        confirmPassword: z.string().nonempty("Confirm password is required")      
    }).strict().refine((data) => data.password === data.confirmPassword,{
        message:"password do not match",
        path:["confirmPassword"]
    })
    const data = newUserSchema.parse(req.body);
    next();
} catch (error) {
    console.log(error);
    return res.status(500).send({
        status:"error",
        message:error.message
    })
}
}