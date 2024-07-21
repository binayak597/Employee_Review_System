import path from 'path'; 

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import ejsLayout from 'express-ejs-layouts';
import session from 'express-session';
import { connectToDB } from './src/config/coonectToDB.js';
import UserController from './src/controllers/user.controller.js';
import AdminController from './src/controllers/admin.controller.js';
import EmployeeController from './src/controllers/employee.controller.js';
import { authAdmin } from './src/middlewares/authAdmin.middleware.js';
import { authEmployee } from './src/middlewares/authEmployee.middleware.js';


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src', 'views'));


app.use(express.static("public"));
app.use(express.static("src/views"));

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(ejsLayout);

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// create an instance of UserController class

const userController = new UserController();

// create an instance of AdminController class

const adminController = new AdminController();

//create an instance of EmployeeController class
const employeeController = new EmployeeController();


//routes related to user
app.get("/auth/register", userController.signup);
app.get("/auth/login", userController.signin);
app.post("/auth/register", userController.postSignUpForm);
app.post("/auth/login", userController.postSignInForm);
app.get("/auth/logout", userController.signOut);


//routes related to admin
app.get("/dashboard/admin", authAdmin, adminController.getAdminPage);
app.get("/dashboard/admin/add-employee", authAdmin, adminController.getNewEmployeeForm);
app.post("/dashboard/admin/add-employee", authAdmin, adminController.postNewEmployeeForm);
app.get("/dashboard/admin/update-employee/:id", authAdmin, adminController.getupdateEmployeeForm);
app.post("/dashboard/admin/update-employee", authAdmin, adminController.postUpdateEmployeeForm);
app.get("/dashboard/admin/delete-employee/:id", authAdmin, adminController.deleteEmployee);
app.post("/dashboard/admin/assign-for-review", authAdmin, adminController.assignReviewForFeedBack);


//routes related to employee 
app.get("/dashboard/employee", authEmployee, employeeController.getEmployeePage);
app.post("/dashboard/employee/add-review", authEmployee, employeeController.postReview);

app.get("/", userController.getHomePage);
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {

    connectToDB();
    console.log(`server is running on port ${PORT}`);
});