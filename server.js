const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const flash = require('express-flash');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const crypto = require('crypto');
// Session configuration
const MongoStore = require('connect-mongo');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend connection
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

let dbConnection;
const connectUri = process.env.MONGO_URI;

// Connect to MongoDB and initialize Passport
MongoClient.connect(connectUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        dbConnection = client.db("Storage");
        console.log('Connected to MongoDB');
        const initializePassport = require('./passport-config');
        initializePassport(passport, dbConnection);
    })
    .catch(err => console.error("MongoDB connection error:", err));



app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use('/uploads', express.static('uploads'));

// Nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middleware to check authentication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/userpage');
    next();
}

// User registration route
app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
      const { username, email, password } = req.body;
      const tabs = []
      // Validate fields
      if (!username || !email || !password) {
          return res.status(400).json({ message: 'All fields are required.' });
      }
      if (password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }

      const existingUser = await dbConnection.collection('users').findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists or not allowed' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await dbConnection.collection('users').insertOne({ username, email, password: hashedPassword, tabs });
      res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ message: 'Server error' });
  }
});


// User login route
app.post('/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: 'Login successful' });
        });
    })(req, res, next);
});

// User logout route
app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: 'Failed to logout' });
        }
        req.session.destroy((sessionError) => {
            if (sessionError) {
                console.error("Session destruction error:", sessionError);
                return res.status(500).json({ message: 'Failed to destroy session' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});


// Authentication status endpoint
app.get('/api/auth/status', (req, res) => {  
    const userId = req.user._id; // Get the user's ID from the session
    res.json({ isAuthenticated: req.isAuthenticated(), userID:userId });
});

app.post('/api/notes', checkAuthenticated, async (req, res) => {
  const { notename, description, date, username } = req.body;
  const userId = req.user._id; // Get the user's ID from the session

  if (!notename || !description || !date || !username) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      const note = {
          notename,
          description,
          date: new Date(date).toISOString(),
          username,
          userId: new ObjectId(userId), 
          isFavorite: false,
      };

      const { insertedId } = await dbConnection.collection('notes').insertOne(note);
      res.status(201).json({ ...note, _id: insertedId });
  } catch (error) {
      console.error("Error saving note:", error);
      res.status(500).json({ message: 'Server error' });
  }
});

  

app.post('/forgot', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await dbConnection.collection('users').findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const expiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save hashed token and expiry to password_resets collection
    await dbConnection.collection('password_resets').insertOne({
      email,
      token: hashedToken,
      expiry,
    });

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Hash the provided token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset token in the database
    const resetRecord = await dbConnection.collection('password_resets').findOne({ token: hashedToken });
    if (!resetRecord) {
      console.error('Token not found in database.');
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // Check if the token is expired
    if (resetRecord.expiry < new Date()) {
      console.error('Token has expired.');
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // Validate the new password
    if (newPassword.length < 6) {
      console.error('Password length validation failed.');
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateResult = await dbConnection.collection('users').updateOne(
      { email: resetRecord.email },
      { $set: { password: hashedPassword } }
    );

    if (updateResult.modifiedCount === 0) {
      console.error('Failed to update user password.');
      return res.status(500).json({ message: 'Failed to update password.' });
    }

    // Delete all user sessions (invalidate login sessions)
    const sessionDeletion = await dbConnection.collection('sessions').deleteMany({
      "session.user.email": resetRecord.email,
    });
    console.log(`Deleted ${sessionDeletion.deletedCount} sessions for user: ${resetRecord.email}`);

    // Remove the token from the database
    const tokenDeletion = await dbConnection.collection('password_resets').deleteOne({ token: hashedToken });
    console.log(`Deleted reset token for email: ${resetRecord.email}`);

    res.status(200).json({ message: 'Password reset successful. Please log in with your new password.' });
  } catch (error) {
    console.error('Error in reset password:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Route to validate old password
app.post('/api/validate-password', checkAuthenticated, async (req, res) => {
    const { oldPassword } = req.body;

    try {
        const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(req.user._id) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(oldPassword, user.password);
        res.json({ isValid });
    } catch (error) {
        console.error('Error validating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/tabs', async (req, res) => {
  const {token} = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset token in the database
    const user = await dbConnection.collection('users').findOne({ token: hashedToken });
    
    res.json({tabs:user.tabs})
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  } 
})

app.patch('/api/add_tab', async (req,res) => {
  const {token,tabs} = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the reset token in the database
    const user = await dbConnection.collection('users').findOne({ token: hashedToken });
    await dbConnection.collection('users').updateOne(
      { email: user.email },
      { $set: { tabs: tabs } }
    )
  } catch (error) {
    console.error("Error Adding Tab:", error)
    console.log(error)
    res.status(500).json({ message: 'Server error'})
  }
})

app.listen(PORT, () => {
  console.error("Error Getting Tabs:", error)
  console.log(error)
    console.log(`Server running on port ${PORT}`);
});
