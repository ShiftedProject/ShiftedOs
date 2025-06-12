// backend/index.js

const express = require('express');
const cors = require('cors');
// 1. Import the Firestore library
const { Firestore } = require('@google-cloud/firestore');

// --- INITIALIZATION ---
const app = express();
// 2. Initialize Firestore. Because you ran `gcloud auth application-default login` earlier,
// this library will automatically find your credentials and connect to your project's database.
 const firestore = new Firestore({
  projectId: 'shifted-project-os-deployment'
});
// Create a reference to the 'tasks' collection. Firestore will create this collection
// automatically when the first document is added.
const tasksCollection = firestore.collection('tasks');

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.get('/', (req, res) => {
  res.status(200).send('Backend server is live and running!');
});

// 3. NEW ROUTE: Get all tasks from the database
app.get('/api/tasks', async (req, res) => {
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

// 4. NEW ROUTE: Create a new task in the database
app.post('/api/tasks', async (req, res) => {
  try {
    const { text } = req.body; // Get the task text from the request body

    if (!text) {
      return res.status(400).send('Task text is required.');
    }

    const newTask = {
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await tasksCollection.add(newTask);
    res.status(201).json({ id: docRef.id, ...newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Error creating task in database.");
  }
});

// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});