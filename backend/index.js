const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { getFirestore, query, collection, where, getDocs, doc, updateDoc, deleteDoc, addDoc } = require('firebase-admin/firestore');
// check
// --- FIREBASE ADMIN & FIRESTORE INIT ---
admin.initializeApp();
const db = getFirestore();

// --- EXPRESS APP INIT ---
const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
// This function acts as a gatekeeper for all our API routes.
// It verifies the user's token before allowing the request to proceed.
const authenticateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided');
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Makes user info (like UID) available in our routes
    next(); // Token is valid, proceed to the actual API logic
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

// --- TEST ROUTE (Public) ---
app.get('/', (req, res) => {
  res.status(200).send('Backend server is live and running!');
});

// --- APPLY AUTH MIDDLEWARE TO ALL /api ROUTES ---
// Every route defined after this line will require a valid user token.
app.use('/api', authenticateFirebaseToken);

// --- PROJECT ROUTES (Protected) ---
const projectsCollection = db.collection('projects');

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const snapshot = await projectsCollection.where('ownerId', '==', req.user.uid).get(); // Example: only get projects for the logged-in user
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Error fetching projects.");
  }
});

// POST (create) a new project
app.post('/api/projects', async (req, res) => {
  try {
    const newProjectData = { ...req.body, ownerId: req.user.uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const docRef = await addDoc(projectsCollection, newProjectData);
    res.status(201).json({ id: docRef.id, ...newProjectData });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).send("Error creating project.");
  }
});

// PUT (update) a project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const docRef = doc(db, 'projects', req.params.id);
        const updatedData = { ...req.body, updatedAt: new Date().toISOString() };
        await updateDoc(docRef, updatedData);
        res.status(200).json({ id: req.params.id, ...updatedData });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Error updating project.");
    }
});

// DELETE a project (and its tasks)
app.delete('/api/projects/:id', async (req, res) => {
    try {
        // First, delete all tasks associated with the project
        const tasksQuery = query(collection(db, "tasks"), where("projectId", "==", req.params.id));
        const tasksSnapshot = await getDocs(tasksQuery);
        const deletePromises = tasksSnapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
        await Promise.all(deletePromises);
        
        // Then, delete the project itself
        await deleteDoc(doc(db, 'projects', req.params.id));
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).send("Error deleting project.");
    }
});


// --- TASK ROUTES (Protected) ---
const tasksCollection = db.collection('tasks');

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const snapshot = await tasksCollection.get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks.");
    }
});

// POST (create) a task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTaskData = { ...req.body, createdBy: req.user.uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        const docRef = await addDoc(tasksCollection, newTaskData);
        res.status(201).json({ id: docRef.id, ...newTaskData });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).send("Error creating task.");
    }
});

// PUT (update) a task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const docRef = doc(db, 'tasks', req.params.id);
        const updatedData = { ...req.body, updatedAt: new Date().toISOString() };
        await updateDoc(docRef, updatedData);
        res.status(200).json({ id: req.params.id, ...updatedData });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Error updating task.");
    }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await deleteDoc(doc(db, 'tasks', req.params.id));
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Error deleting task.");
    }
});

// --- USER ROUTES (Protected) ---
app.get('/api/users', async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users.");
    }
});


// --- SERVER START ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
