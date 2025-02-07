// routes/formRoute.js

const { Router } = require('express');
const router = Router();

// Route to show the form
router.get('/', (req, res) => {
    const message = 'Please enter your information below.';
    res.render('index', { message: message, submittedData: null });
});
// Route to add a new user
router.post('/adduser', async (req, res) => {
    const { username, number, dob } = req.body
    console.log('Data added : ', username, number, dob)
    const query = 'INSERT INTO users (username, number, dob, visiting) VALUES (?, ?, ?, ?)';
    const values = [username, number, dob]
    try {
        const result = await new Promise((resolve, reject) => {
            req.db.query(query, values, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }

            })
        })
        console.log('data is inserted:', result);
        res.render('userdata', {
            message: 'submitted',
            submittedData: {
                username,
                number,
                dob
            }
        })
    } catch (err) {
        console.error('error aarha h bc.!', err)
        return res.status(500).send('error ssaving data')
    }
})

// Route to search users
router.get('/searchusers', async (req, res) => {
    const searchQuery = req.query.query ? `%${req.query.query.trim().toLowerCase()}%` : '';
    try {
        let query;
        let values = [];
        if (searchQuery) {
            query = 'SELECT * FROM users WHERE LOWER(username) LIKE ? OR LOWER(number) LIKE ?';
            values = [searchQuery, searchQuery];
        } else {
            query = 'SELECT * FROM users';
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
        res.render('userList', {
            users: results
        });
    } catch (err) {
        console.error('Error searching users:', err);
        return res.status(500).send('Error searching users.');
    }
});

// fetching user data
router.get('/userdata', async (req, res) => {
    const query = 'SELECT * FROM ussers';
    try {
        const results = await new Promise((reslove, reject) => {
            req.db.query(query, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    reslove(results)
                }
            })
        })
        res.render('userdata', { users: results })
    } catch (err) {
        console.error('error got:', err);
        return res.status(500).send('error fetching user data')
    }
})

// Route to edit user data
router.get('/edituser/:id', async (req, res) => {
    const userid = req.params.id;
    const { username, number, dob } = req.body;
    const query = 'UPDATE users SET username = ?, number = ?, dob = ?, visiting = ? WHERE id = ?';
    const values = [username, number, dob, visiting, userid];
    try {
        const response = await new Promise((reslove, reject) => {
            req.db.query(query, values, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    reslove(result);
                }
            })
        })
        if (!response) return res.status(500).send('error updateing users.!')
        res.send({ success: true })
    } catch (err) {
        console.error('Error updateing the user', err);
        return res.status(500).send('Error updating the user.!')
    }
})

// Route to delete a user
router.post('/deleteuser/:id', async (req, res) => {
    const userid = req.params.id;
    const query = 'DELETE FROM user WHERE id = ? ';
    try {
        await new Promise((resolve, reject) => {
            req.db.query(query, [userid], (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
        redirect('/userdata')
    } catch (err) {
        console.error('Error to deleting the data', err);
        return res.status(500).send('error to deleting the user ')
    }
})

module.exports = router;
