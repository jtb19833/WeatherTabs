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

const whitelist = ["http://localhost:3000"]; 

// Enable CORS for frontend connection
app.use(cors({
    //origin: 'http://localhost:3000',
    origin: true,
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
      const prefs = {units:"imperial", timeFormat:"12h"}
      const hashedPassword = await bcrypt.hash(password, 10);
      await dbConnection.collection('users').insertOne({ username, email, password: hashedPassword, tabs, prefs });
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

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
      return res.json({
          userId: req.user._id,
          username: req.user.username,
          email: req.user.email,
          imagePath: req.user.imagePath || null, // Ensure imagePath is included
      });
  } else {
      return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Authentication status endpoint
app.get('/api/auth/status', (req, res) => {  
    const userId = req.user._id; // Get the user's ID from the session
    res.json({ isAuthenticated: req.isAuthenticated(), userID:userId });
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
    const resetLink = `http://localhost:3000/${token}/reset-password`;
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
  try {
    // Find the reset token in the database
    const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(req.user._id) });
    res.json({tabs:user.tabs})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  } 
})

app.patch('/api/add_tab', async (req,res) => {
  const {token, tabs} = req.body;

  console.log("Tabs: " + tabs)
  try {

    // Find the reset token in the database
    const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(token) });
    await dbConnection.collection('users').updateOne(
      { email: user.email },
      { $set: { tabs: tabs } }
    )
    console.log("Tabs Updated for user " + user.email + "!")
    res.json({message: "Tabs Updated!"})
  } catch (error) {
    console.error("Error Adding Tab:", error)
    console.log(error)
    res.status(500).json({ message: 'Server error'})
  }
})

app.get('/api/prefs', async (req, res) => {
  try {
    // Find the reset token in the database
    const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(req.user._id) });
    console.log("Here")
    res.json({prefs:user.prefs})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  } 
})

app.patch('/api/save_prefs', async (req,res) => {
  const {token, prefs} = req.body;

  console.log("Preferences: " + prefs)
  try {

    // Find the reset token in the database
    const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(token) });
    await dbConnection.collection('users').updateOne(
      { email: user.email },
      { $set: { prefs: prefs } }
    )
    console.log("Preferences Updated for user " + user.email + "!")
    res.json({message: "Preferences Updated!"})
  } catch (error) {
    console.error("Error Updating Preferences:", error)
    console.log(error)
    res.status(500).json({ message: 'Server error'})
  }
})
app.delete('/api/delete_tab', async (req, res) => {
  const { token, position } = req.body;

  if (!token || position === undefined) {
    console.error("Invalid request: Missing token or position.");
    return res.status(400).json({ message: 'Token and position are required.' });
  }

  try {
    // Find the user in the database
    const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(token) });
    if (!user) {
      console.error("User not found for token:", token);
      return res.status(404).json({ message: 'User not found.' });
    }
    // Filter out the tab with the matching position
    const updatedTabs = user.tabs.filter(tab => tab.position !== position);

    if (updatedTabs.length === user.tabs.length) {
      console.error(`Tab with position ${position} not found in user's tabs.`);
      return res.status(404).json({ message: `Tab with position ${position} not found.` });
    }

    // Reassign positions to ensure they are consecutive
    const normalizedTabs = updatedTabs.map((tab, index) => ({
      ...tab,
      position: index // Assign the index as the new position
    }));

    // Update the user's tabs in the database
    const result = await dbConnection.collection('users').updateOne(
      { _id: new ObjectId(token) },
      { $set: { tabs: normalizedTabs } }
    );

    if (result.modifiedCount === 0) {
      console.error("Failed to update tabs for user:", user.email);
      return res.status(500).json({ message: 'Failed to delete tab.' });
    }

    console.log("Tab deleted successfully. for user:", user.email);
    res.status(200).json({ message: 'Tab deleted successfully.', tabs: normalizedTabs });
  } catch (error) {
    console.error("Error deleting tab:", error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

app.post('/api/upload', checkAuthenticated, upload.single('image'), async (req, res) => {
  const { username, password } = req.body;
  const imageFile = req.file;
  const userId = req.user._id;  // Get userId from session (req.user)

  console.log("Updating profile for userId:", userId);
  console.log("Received username:", username);
  console.log("Received password:", password ? "Provided" : "Not provided");
  console.log("Received imageFile:", imageFile ? imageFile.path : "No image");

  try {
      // Fetch the current user
      const user = await dbConnection.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
          console.log("User not found");
          return res.status(404).json({ message: 'User not found' });
      }

      const updates = {};

      // Validate new username if provided
      if (username) {
          if (username !== user.username) {
              const existingUser = await dbConnection.collection('users').findOne({ username });
              if (existingUser) {
                  console.log("Username already exists:", username);
                  return res.status(400).json({ message: 'Username already exists. Please choose a different one.' });
              }
              updates.username = username;
          }
      }

      // Hash the new password if provided
      if (password) {
          updates.password = await bcrypt.hash(password, 10);
      }

      // Update the image path if a file is provided
      if (imageFile) {
          updates.imagePath = imageFile.path;
      }

      // Perform the update
      await dbConnection.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: updates }
      );

      console.log("Profile updated successfully:", updates);
      res.status(200).json({ message: 'Profile updated successfully', data: updates });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.delete('/delete-acct', async(req,res) => {
  console.log("account Delete")
  try {
    const user = await dbConnection.collection('users').findOne({_id: new ObjectId(req.user._id) })
    console.log(user)
    console.log("Deleting...")
    const response = await dbConnection.collection('users').deleteOne({email:user.email})
    console.log("User Deleted.")
    res.json({response})
  }catch {

    res.status(500).json({message: "Failed to delete user."})
  }
})

app.post('/send-report', async(req,res) => {
  console.log(req.body)
  const {reportTitle,reportBody} = req.body;
  console.log(reportTitle + ", " +reportBody)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'weathertabs@gmail.com',
      subject: reportTitle,
      html: `<h1>Request Contents:</h1><p>`+reportBody+`</p>`,
    });
    res.json({message:"email sent!"})
  } catch(exception) {
    res.status(500).json({message:exception})
  }

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
