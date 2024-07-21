
import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {

        name:{
            type:String,
            required:true
        },
  
        email:{
            type:String,
            required:true,
            unique:true,
        },

        password:{
            type:String,
            required:true,
        },

        role:{
            type:String,
            required:true,
            enums:["employee", "admin"]
        },
        // reviews assigned to user by admin
        reviewAssigned:[
            {   
                // id of user
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        // feedback given to user by other employee
        feedbackByOthers:[
            {
                // id of feedback
                type:mongoose.Schema.Types.ObjectId,
                ref:'Feedback'
            },
        ]
    },
    {
        // timestamp
        timestamps:true,
    }
)

// creating a new model from schema
const UserModel = mongoose.model('User',userSchema);

export default UserModel;