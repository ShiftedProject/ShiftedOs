// backend/index.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');

// --- FIREBASE ADMIN INIT ---
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Assumes you're running this on GCP or with service account creds
});

// --- FIRESTORE INIT ---
const firestore = new Firestore({
  projectId: 'shifted-project-os-deployment',
});
const tasksCollection = firestore.collection('tasks');

// --- EXPRESS APP INIT ---
const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Now you can access req.user.uid, email, etc.
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).send('Unauthorized: Invalid token');
  }
}

// --- TEST ROUTE ---
app.get('/', (req, res) => {
  res.status(200).send('Backend server is live and running!');
});

// --- GET TASKS (Protected) ---
app.get('/api/tasks', authenticateFirebaseToken, async (req, res) => {
  try {
    const snapshot = await tasksCollection.get();
    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Error fetching tasks from database.");
  }
});

// --- POST TASK (Protected) ---
app.post('/api/tasks', authenticateFirebaseToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send('Task text is required.');
    }

    const newTask = {
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid, // attach user info to task
    };

    const docRef = await tasksCollection.add(newTask);
    res.status(201).json({ id: docRef.id, ...newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Error creating task in database.");
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
