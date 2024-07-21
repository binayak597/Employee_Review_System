
import UserModel from '../models/user.schema.js';
import FeedbackModel from '../models/feedback.schema.js';
import bcrypt from 'bcryptjs';

export default class AdminController{

    //get admin page
    getAdminPage = async (req, res) => {
        try {

            const user = await UserModel.findOne({email: req.session?.userEmail || ""});

            const employeeList = await UserModel.find({role:'employee'});

            return res.render('admin',{
                title:"Admin | Dashboard ",
                employee:employeeList,
                user
            });
    
        } catch (error) {
            console.log("error in getAdminPage controller ", error);
            return res.redirect("/auth/login");
        }

    }

    //delete employee

    deleteEmployee = async (req, res) => {

        try {
             
        const {id} = req.params;
        const user = await UserModel.findById(id);

        if(user) {
            // delete all the reviews given by this user
        await FeedbackModel.deleteMany({sender: user._id});

        // delete all the reviews given to this user
        await FeedbackModel.deleteMany({recipient: user._id});

        // find the employee by id and delete
        await UserModel.findByIdAndDelete(user._id);

        console.log('success','Employee successfully deleted');
        
        }else{

            console.log("user does not exist");

        }
        
        return res.redirect('/dashboard/admin');
        } catch (error) {
            console.log("error in deleteEmployee controller ", error);
            return res.redirect("/dashboard/admin");
        }
    }

    //get update form for employee data

    getupdateEmployeeForm = async (req, res) => {

        try {

            const user = await UserModel.findOne({email: req.session?.userEmail || ""});

            //todo get employee id for updation

            const {id: employeeId} = req.params;

    const employee = await UserModel.findById(employeeId);

    let feedbackByOthersForMe = [];

    // getting array to feedbacks given to employee by fellow employees
    const feedbackByOthers = employee.feedbackByOthers;

    // if the array contains some data
    if(feedbackByOthers.length > 0 ){

        for (let index = 0; index < feedbackByOthers.length; index++) {
            
            // get the feedback from 'Feedback' model based on id stored in employee's data
            let feedback = await FeedbackModel.findById(feedbackByOthers[index]).populate('sender');

            // store the feedback in array
            if(feedback){
                feedbackByOthersForMe.push(feedback);
            }

        }

        // console.log(feedbackByOthersForMe);
    }

    // render the update form
    // pass the list of feedback given to employee by others
    res.render('updateForm',{
        title:"Admin | Update Employee ",
        employee:employee,
        feedbacks:feedbackByOthersForMe,
        user
    });
            
        } catch (error) {
            console.log("error in updateEmployeeForm controller ", error);
            return res.redirect("/dashboard/admin"); 
        }
    }

    //post data of updation for employee data
    postUpdateEmployeeForm = async (req, res) => {
        try {

            //todo get employee id for updation
            const {employeeId, restUpdateData} = {emp_id, ...req.body};
            // find the user by id and update data
    await User.findByIdAndUpdate(employeeId, restUpdateData);

    console.log('success','Info Updated !!')
    // redirect to dashboard
    res.redirect('/dashboard/admin');
        } catch (error) {
            console.log("error in postUpdateEmployeeForm controller ", error);
            return res.redirect("/dashboard/admin"); 
        }

    }

    //get form for add new employee
    getNewEmployeeForm = async (req, res) => {

        const user = await UserModel.findOne({email: req.session?.userEmail || ""});

        res.render('addEmployee',{
            title:"Admin | Add Employee ",
            user
        });
    }

    //post data for add new employee form
    postNewEmployeeForm = async (req, res) => {

        try {


            const {name,email,password,confirmPassword} = req.body;
            // define the role for new employee
            const role = 'employee';    
    
            
            const userExist = await UserModel.findOne({email});
    

            if(!userExist){
    
                if(password !== confirmPassword ){
                    
                    console.log('error','Password does not match !!')
                    // return back
                    return res.redirect('/dashboard/admin');
                }
                
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
    
                // creating a new user with data
                const user = await UserModel.create({
                    name,
                    email,
                    role,
                    password:hashedPassword,
                })
    
                console.log('success','New employee created ')
            }
            else{
               console.log('error','Email address already exist')
            }
    
            // return back to dashboard of admin
            return res.redirect('/dashboard/admin');
    
    
        } catch (error) {
            console.log("error in postNewEmployeeForm controller ", error);
            return res.redirect("/dashboard/admin"); 
        }
    }

    //assign review for feedback that given by other employee

    assignReviewForFeedBack = async (req, res) => {

        try {
            
            //to which employee admin wants to assign the
            const {senderId, recipientId} = req.body;
            const employee = await UserModel.findById(senderId);


            // if employee found
            // check whether the user already have the recipient in his assign review list
            if(employee.reviewAssigned.includes(recipientId)){
                console.log('error','Recipient already assigned to this user')  
                // return back if recipient already exists
                return res.redirect('/dashboard/admin');
            }

            // if not already exist
            // add recipient to reviewer's data
            employee.reviewAssigned.push(recipientId);

            // save employee's data
            await employee.save();

            console.log('success','Review Assigned');
            return res.redirect('/dashboard/admin');
        } catch (error) {
            console.log("error in assignReviewForFeedBack controller ", error);
            return res.redirect("/dashboard/admin"); 
        }
    }


}
