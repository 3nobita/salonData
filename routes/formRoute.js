// routes/formRoute.js

const { Router } = require('express');
const router = Router();

// Route to show the form
router.get('/', (req, res) => {
    res.render('index');
});

// fetching user data
router.get('/userdata', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';

        const results = await new Promise((resolve, reject) => {
            req.db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.render('userdata', { users: results });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Error fetching user.');
    }
});

// Route to add a new user
router.post('/adduser', async (req, res) => {
    try {
        const { username, number, dob } = req.body;
        console.log('Inserting data:', username, number, dob);

        const query = 'INSERT INTO users (username, number, dob) VALUES (?, ?, ?)';
        const values = [username, number, dob];

        await new Promise((resolve, reject) => {
            req.db.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Data inserted successfully');
        res.render('index', {
            message: 'Form submitted successfully!',
            submittedData: { username, number, dob }
        });
    } catch (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Error saving user.');
    }
});

// Route to search users
router.get('/searchusers', async (req, res) => {
    try {
        const searchQuery = req.query.query ? `%${req.query.query.trim().toLowerCase()}%` : '';
        let query, values;
        if (searchQuery) {
            query = 'SELECT * FROM users WHERE LOWER(username) LIKE ? OR LOWER(number) LIKE ?';
            values = [searchQuery, searchQuery];
        } else {
            query = 'SELECT * FROM users';
            values = [];
        }
        const results = await new Promise((resolve, reject) => {
            req.db.query(query, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        res.send({ users: results });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error searching or retrieving users.');
    }
});

// Route to edit user data
router.post('/edituser/:id', async (req, res) => {
    try {
        const userid = req.params.id;
        const { username, number, dob } = req.body;
        const query = 'UPDATE users SET username = ?, number = ?, dob = ? WHERE id = ?';
        const values = [username, number, dob, userid];

        await new Promise((resolve, reject) => {
            req.db.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        res.send({ success: true });
    } catch (err) {
        console.error('Error updating user data:', err);
        res.status(500).send('Error updating user.');
    }
});

// Route to delete a user
router.post('/deleteuser/:id', async (req, res) => {
    try {
        const userid = req.params.id;
        const query = 'DELETE FROM users WHERE id = ?';

        await new Promise((resolve, reject) => {
            req.db.query(query, [userid], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        res.redirect('/userdata');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user.');
    }
});


module.exports = router;
