// const User = require('../models/user.js');
// const bcrypt = require('bcryptjs');
// const { v4: uuidv4 } = require('uuid');

// async function createUser(req, res) {
//     const { username, password, email } = req.body;
//     try {
//         let user = await User.findOne({ email })
//         if (user) {
//             return res.status(400).send('User already exists');
//         }

//         const hashedPassword = bcrypt.hashSync(password, 10);
//         const newUser = new User({
//             id: uuidv4(),
//             username,
//             password: hashedPassword,
//             email,
//         });

//         newUser.save();
//         return res.redirect('/login');

//     } catch (err) {
//         console.error(err);
//         return res.status(500).send('Server error');
//     }
// }

// module.exports = { createUser };
