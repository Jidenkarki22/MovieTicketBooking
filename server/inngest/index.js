import { Inngest } from "inngest";
import userModel from './../model/userModel.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });


// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(

    { id:'sync-userModel-from-clerk'},
    { event:'clerk/userModel.created'},
    async({event}) => {
        const{id, first_name, last_name , email_address , image_url} = event.data
        const userData = {
            _id:id,
            email:email_address[0].email_address,
            name:first_name + ' ' + last_name,
            image: image_url 
        }
        await userModel.create(userData)
    }

)

// Inngest function to delete user from database 
const syncUserDeletion = inngest.createFunction(

    { id:'delete-userModel-with-clerk'},
    { event:'clerk/userModel.deleted'},
    async({event}) => {
        const{id} = event.data
        await userModel.findByIdAndDelete(id)
        }
)

// Inngest function to update user from database 
const syncUserUpdation = inngest.createFunction(

    { id:'update-userModel-from-clerk'},
    { event:'clerk/userModel.updated'},
    async({event}) => {
        const{id, first_name, last_name , email_address , image_url} = event.data
        const userData = {
            _id:id,
            email:email_address[0].email_address,
            name:first_name + ' '+ last_name,
            image: image_url 
        }
        await userModel.findByIdAndUpdate(id,userData)
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];