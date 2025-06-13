const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
// Use the modular imports for Firestore for better organization
const { getFirestore, query, collection, where, getDocs, doc, updateDoc, deleteDoc, addDoc } = require('firebase-admin/firestore');

// --- INITIALIZATION ---
admin.initializeApp();
const db = getFirestore();
const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE COLLECTION REFERENCES ---
const projectsCollection = collection(db, 'projects');
const tasksCollection = collection(db, 'tasks');
const usersCollection = collection(db, 'users');

// --- AUTHENTICATION MIDDLEWARE ---
const authenticateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided');
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

// --- PUBLIC TEST ROUTE ---
app.get('/', (req, res) => {
  res.status(200).send('Backend server is live and running!');
});

// --- APPLY AUTH MIDDLEWARE TO ALL /api ROUTES ---
app.use('/api', authenticateFirebaseToken);

// --- PROJECT API ROUTES ---
app.get('/api/projects', async (req, res) => {
  try {
    const q = query(projectsCollection);
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(projects);
  } catch (error) { res.status(500).send("Error fetching projects."); }
});
app.post('/api/projects', async (req, res) => {
  try {
    const newProjectData = { ...req.body, ownerId: req.user.uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const docRef = await addDoc(projectsCollection, newProjectData);
    res.status(201).json({ id: docRef.id, ...newProjectData });
  } catch (error) { res.status(500).send("Error creating project."); }
});
app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectDoc = doc(db, 'projects', req.params.id);
        const updatedData = { ...req.body, updatedAt: new Date().toISOString() };
        await updateDoc(projectDoc, updatedData);
        res.status(200).json({ id: req.params.id, ...updatedData });
    } catch (error) { res.status(500).send("Error updating project."); }
});
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const tasksQuery = query(tasksCollection, where("projectId", "==", req.params.id));
        const tasksSnapshot = await getDocs(tasksQuery);
        const deletePromises = tasksSnapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
        await Promise.all(deletePromises);
        await deleteDoc(doc(db, 'projects', req.params.id));
        res.status(204).send();
    } catch (error) { res.status(500).send("Error deleting project."); }
});

// --- TASK API ROUTES ---
app.get('/api/tasks', async (req, res) => {
    try {
        const snapshot = await getDocs(tasksCollection);
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(tasks);
    } catch (error) { res.status(500).send("Error fetching tasks."); }
});
app.post('/api/tasks', async (req, res) => {
    try {
        const newTaskData = { ...req.body, createdBy: req.user.uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        const docRef = await addDoc(tasksCollection, newTaskData);
        res.status(201).json({ id: docRef.id, ...newTaskData });
    } catch (error) { res.status(500).send("Error creating task."); }
});
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskDoc = doc(db, 'tasks', req.params.id);
        const updatedData = { ...req.body, updatedAt: new Date().toISOString() };
        await updateDoc(taskDoc, updatedData);
        res.status(200).json({ id: req.params.id, ...updatedData });
    } catch (error) { res.status(500).send("Error updating task."); }
});
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await deleteDoc(doc(db, 'tasks', req.params.id));
        res.status(204).send();
    } catch (error) { res.status(500).send("Error deleting task."); }
});

// --- USER API ROUTES ---
app.get('/api/users', async (req, res) => {
    try {
        const snapshot = await getDocs(usersCollection);
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) { res.status(500).send("Error fetching users."); }
});

// --- SERVER START ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
