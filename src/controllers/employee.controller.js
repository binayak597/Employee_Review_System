
import UserModel from '../models/user.schema.js';
import FeedbackModel from '../models/feedback.schema.js';

export default class EmployeeController{

    //get employee page

    getEmployeePage = async (req, res) => {

        try {
            const user = await UserModel.findOne({email: req.session?.userEmail || ""});
            // for all the reviews assign to employee by admin
            let employeeAssignedForReviewToMe = [];
            const employeeAssignedForReview = user.reviewAssigned;

            // for all the feedback given to the employee by fellow employees
            let feedbackByOthersToMe = [];
            const feedbackByOthers = user.feedbackByOthers;


        
            if(employeeAssignedForReview.length > 0 ){

                for (let index = 0; index < employeeAssignedForReview.length; index++) {
                    

                    let employee = await UserModel.findById(employeeAssignedForReview[index]);

                    if(employee){

                        employeeAssignedForReviewToMe.push(employee);
                    }
                    
                }
            }


            if(feedbackByOthers.length > 0 ){

                for (let index = 0; index < feedbackByOthers.length; index++) {
                    

                    let feedback = await FeedbackModel.findById(feedbackByOthers[index]).populate('sender');

                    if(feedback){

                        feedbackByOthersToMe.push(feedback);
                    }
                    
                }
            }


            // render the employee page 
            // list of review assign and feedback given by other
            res.render('employee',{
                title:"Employee | Dashboard",
                assignReviews:employeeAssignedForReviewToMe,
                feedbacks:feedbackByOthersToMe,
                user
            });
        } catch (error) {
            console.log("error in getEmployeePage controller ", error);
            return res.redirect("/auth/login");
        }
    }

    //review submitted by an employee
    postReview = async (req, res) => {

        try {
            const user = await UserModel.findOne({email: req.session?.userEmail || ""});
            
            const sender = user._id;
            const {recipient_id, comment} = req.body;
    
            // create a new feedback in database
            const feedbackId = await FeedbackModel.create({
                comment,
                sender,
                recipient: recipient_id
            });
    

            const recipientEmployee = await UserModel.findById(recipient_id);

            recipientEmployee.feedbackByOthers.push(feedbackId);

            await recipientEmployee.save();


            //update the sender doc by pull out the recipient id from reviewAssigned field after submit the feedback
            await UserModel.findByIdAndUpdate(sender, {

                $pull:{

                    "reviewAssigned": recipientEmployee._id
                }
            });

            console.log('success','Your feedback is added !!!')
            // redirect back 
            return res.redirect('/dashboard/employee');
    
        } catch (error) {
    
            console.log("error in postReview controller ", error);
            return res.redirect("/dashboard/employee");
        }
    }
}
