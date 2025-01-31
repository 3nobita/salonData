// routes/formRoute.js

const { Router } = require('express');
const router = Router();

// Route to show the form
router.get('/', (req, res) => {
    const message = 'Please enter your information below.';
    res.render('index', { message: message, submittedData: null });
});

// Route to add a new user
router.post('/adduser', (req, res) => {
    const { username, number, dob } = req.body;
    console.log('Inserting data:', username, number, dob);
    const query = 'INSERT INTO users (username, number, dob) VALUES (?, ?, ?)';
    const values = [username, number, dob];
    req.db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).send('Error saving user.');
        }
        console.log('Data inserted successfully:', result);
        res.render('index', {
            message: 'Form submitted successfully!',
            submittedData: {
                username,
                number,
                dob
            }
        });
    });
});

// Route to search users
router.get('/searchusers', (req, res) => {
    const searchQuery = req.query.query ? `%${req.query.query.trim().toLowerCase()}%` : '';

    if (searchQuery) {
        // Search for users by username or number (case-insensitive search using SQL LIKE)
        const query = 'SELECT * FROM users WHERE LOWER(username) LIKE ? OR LOWER(number) LIKE ?';
        const values = [searchQuery, searchQuery];

        req.db.query(query, values, (err, results) => {
            if (err) {
                console.error('Error searching users:', err);
                return res.status(500).send('Error searching users.');
            }
            res.json({ users: results }); // Return the filtered users as JSON
        });
    } else {
        // If no query, return all users
        const query = 'SELECT * FROM users';
        req.db.query(query, (err, results) => {
            if (err) {
                console.error('Error retrieving all users:', err);
                return res.status(500).send('Error retrieving users.');
            }
            res.json({ users: results });
        });
    }
});

// Route to display user data
router.get('/userdata', (req, res) => {
    const query = 'SELECT * FROM users';
    req.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('Error fetching user.');
        }
        res.render('userdata', { users: results });
    });
});

// Route to edit user data
router.post('/edituser/:id', (req, res) => {
    const userid = req.params.id;
    const { username, number, dob } = req.body;
    const query = 'UPDATE users SET username = ?, number = ?, dob = ? WHERE id = ?';
    const values = [username, number, dob, userid];
    req.db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            return res.status(500).send('Error updating user.');
        }
        res.send({ success: true });
    });
});

// Route to delete a user
router.post('/deleteuser/:id', (req, res) => {
    const userid = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    req.db.query(query, [userid], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Error deleting user.');
        }
        res.redirect('/userdata');
    });
});

module.exports = router;
