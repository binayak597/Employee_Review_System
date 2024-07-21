
import mongoose from "mongoose";


const feedbackSchema = new mongoose.Schema(
    {   

        comment:{
            type:String,
        },
        // reviewer's id
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },

        // recipient's id
        recipient:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {
        timestamps:true,
    }
)

const FeedbackModel = mongoose.model('Feedback',feedbackSchema);

export default FeedbackModel;
