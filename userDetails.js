const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create a new Mongoose model from the schema, using the name of the collection as 'users'
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    // The email is required and must be unique in this collection
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);



// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     firstName VARCHAR(255) NOT NULL,
//     lastName VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     mobile INT NOT NULL,
//     password VARCHAR(255) NOT NULL
// );





// //importing the express library  from node_modules folder.
// const express = require("express");
// //creating an instance of the express server using express() method.
// const app = express();
// //calling mongoose
// const mongoose = require("mongoose");
// //accept the json format
// app.use(express.json());
// //import the component  for handling users
// require("./userDetails");

// const jwt = require("jsonwebtoken");
// //connecting to the database using mongoose
// mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("connected to db"))
//     .catch((err) => console.error(err + "failed to connect"));

// //calling  the function from userDetails file passing the app object as a parameter
// const User = mongoose.model("User");
// //cryptage de password
// const bcrypt = require('bcrypt');

// const crypto = require('crypto');


// // const generateSecretKey = () => {
// //   return crypto.randomBytes(64).toString('hex');
// // }
// // const JWT_SECRET = generateSecretKey();
// const JWT_SECRET= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IklzbWFpbGlzbUBnbWFpbC5jb20iLCJpYXQiOjE3MTIzMDc5Mzd9.WTN5xAcZQLMYbclngOFO65ZbwKrsl6YgSbK_vvBiGqI";
// console.log(JWT_SECRET);


// //register endpoint
// app.post("/register", async (req, res) => {
//     const { firstName, lastName, email, mobile, password } = req.body;
//     try {
//         const oldUser = await User.findOne({ email: email });
//         if (oldUser) {
//             return res.send({ status: "ok", data: "user already exists" });
//         }
//         const encryptedPassword = await bcrypt.hash(password, 10);
//         await User.create({
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             mobile: mobile,
//             password: encryptedPassword
//         });
//         res.send({ status: "ok", data: "user created", redirectTo: "Login" })
//     } catch (error) {
//         res.send({ status: "error", data: "error" })
//     }
// })

// // Login endpoint
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             return res.send({ status: "error", data: "User not found" });
//         }
//         const DecryptedPassword = await bcrypt.compare(password, user.password);
//         if (!DecryptedPassword) {
//             return res.send({ status: "error", data: "Invalid password" });
//         }
//         // If user and password are correct, send a success response with the redirect URL
//         res.send({ status: "ok", data: "Login successful", redirectTo: "Home" });
//     } catch (error) {
//         res.send({ status: "error", data: "Error during login" });
//     }
// });

// app.post("/login-user", async (req, res) => {
//     const { email, password } = req.body;
//     const oldUser = await User.findOne({ email: email });

//     if (!oldUser) {
//         return res.send(data, "User doesn't exist");
//     }
//     if (await bcrypt.compare(password, oldUser.password)) {

//         const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
//         if (res.status(201)) {
//             return res.send({ status: "ok", data: token });
//         } else {
//             return res.send({ error: "error" });
//         }
//     }
// });

// app.post("/userdata",async(req,res)=>{
//     const {token}=req.body;
//     try {
//         const user = jwt.verify(token,JWT_SECRET);
//         const useremail = user.email;
//         User.findOne({email : useremail})
//         .then((data)=> {
//             return res.send({status:"ok",data:data});
//         })
//     } catch (error) {
//         return res.send({ error: "error" });
//     }
// })



// app.listen(5001, () => {
//     console.log("nodemon is starting");
// });
