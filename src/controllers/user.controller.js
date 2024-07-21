
import UserModel from '../models/user.schema.js';
import bcrypt from 'bcryptjs';


export default class UserController{

    getHomePage = async (req, res) => {

        if(req.session?.userEmail && req.session?.typeOfUser === "admin"){

            return res.redirect("/dashboard/admin");
        }else{
            return res.redirect("/dashboard/employee");
        }
    }

    //get signup form
    signup = (req, res) => {

        return res.render('signUp');
    }

    //get signin form

     signin = (req, res) => {
        return res.render('signIn');
    }

    //post signup form data

    postSignUpForm = async (req, res) => {

        try {
            let { name, email, password, confirmPassword, role } = req.body;
           
    
            const userExist = await UserModel.findOne({email});
    
 
            if(userExist){
                console.log('error','User already exists')
                return res.redirect('/auth/register');
            }
    
            if(password !== confirmPassword ){

                console.log('error','Password does not match !!')
                return res.redirect("/auth/register");
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // create new user
            const user = await UserModel.create({    
                name,
                email,
                role,
                password:hashedPassword,
            })
    
            console.log('successfully registered, Please login !!')

            return res.redirect('/auth/login');
    
        } catch (error) {
            console.log("error in postSignUpForm controller ", error);
            return res.redirect("/auth/register");
        }
    }

    //post signin form data
    postSignInForm = async (req, res) => {

        try {
            const {email, password} = req.body;
        const userFound = await UserModel.findOne({email});
        if(userFound){

            const isPassword = await bcrypt.compare(password, userFound.password);

            if(isPassword){
                req.session.userEmail = email;
                req.session.userName = userFound.name;
                req.session.typeOfUser = userFound.role; 
    
                return res.redirect("/");
            }else{

                console.log("password doesnot match");
            }
           
        }
        return res.redirect("/auth/login");
            
        } catch (error) {
            console.log("error in postSignInForm controller ", error);
            return res.redirect("/auth/login");
        }
    }

    //signout

    signOut = (req, res) => {

         //destory the session
         req.session.destroy(err => {
            if(err){
                console.log(err);
            }else{
                //clear the cookies
                res.redirect("/auth/login");  
            }
        });
    }


}

