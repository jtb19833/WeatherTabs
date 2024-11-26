const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

function initialize(passport, db) {
    const authenticateUser = async (username, password, done) => {
        console.log("Attempting to authenticate user:", username); // Debugging log
    
        try {
            const user = await db.collection('users').findOne({ username });
            console.log("User found in database:", user); // Debugging log
    
            if (!user) {
                console.log("No user found with that username");
                return done(null, false, { message: 'No user found with that username' });
            }
    
            if (await bcrypt.compare(password, user.password)) {
                console.log("Password match, logging in");
                return done(null, user);
            } else {
                console.log("Incorrect password");
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            console.error("Error in authentication:", e);
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));

    passport.serializeUser((user, done) => {
        console.log("Serializing user:", user._id); // Debug log for serialization
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log("Deserializing user with ID:", id); // Debug log for deserialization
        try {
            const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
            if (user) {
                console.log("Found user:", user); // Debug log for successful deserialization
                done(null, user);
            } else {
                console.log("User not found during deserialization"); // Debug log if user not found
                done(null, false);
            }
        } catch (err) {
            console.error("Error in deserializing user:", err); // Error log
            done(err);
        }
    });
}

module.exports = initialize;