import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {config} from "./config.js";
import {User} from "../models/userModel.js"

passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: 'http://localhost:5004/api/v1/auth/google/callback'
},
async (accesstoken, refreshToken, profile, done) =>{
    try {
        //check if user Exists
        let user = await User.findOne({email: profile.emails[0].value})
        if(user){
            if(!user.googleId){
                user.googleId = profile.id;
                user.isVerified = true;
                await user.save();
            }
            return done(null, user);
        }   
        //create a new user
        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            isVerified: true
        });
        return done(null, user)    
    } catch (error) {
        done(error, null);
    }
}))

//Serializer/ Deserialize user
passport.serializeUser((user,done) =>done(null, user.id))
passport.deserializeUser(async(id,done) => {
    try {
        const user = await User.findById(id);
        done(null,user);
    } catch (error) {
        done(error,null);
    }
});

export default passport;