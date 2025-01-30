// routes/formRoute.js

const { Router } = require('express');  // Import Router from express
const router = Router();  // Initialize Router

router.get('/', (req, res) => {
    const message = 'Please enter your information below.';
    res.render('index', { message: message, submittedData: null });
});

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
        console.log('Data inserted successfully:', result);  // Log the result of the insertion
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

router.post('/edituser/:id', (req, res) => {
    const userid = req.params.id;
    const { username, number, dob } = req.body;
    const query = 'UPDATE users SET username = ?, number = ?, dob = ? WHERE id = ?';
    const values = [username, number, dob, userid];
    req.db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            return res.status(500).send('Error updating user.')
        }
        res.send({ success: true })
    })
})

router.post('/deleteuser/:id', (req, res) => {
    const userid = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
    req.db.query(query, [userid], (err, result) => {
        if (err) {
            console.error('Error deleting data; ', err)
            return res.status(500).send('Error deleting user.');
        }
        res.redirect('/userdata')
    })
});


module.exports = router;

