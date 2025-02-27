import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data || {};

            if (!id || !email_addresses) {
                throw new Error("Invalid event data");
            }

            const userData = {
                _id: id,
                email: email_addresses[0]?.email_address,
                name: `${first_name} ${last_name}`,
                image_url: image_url,
            };

            await connectDB();
            await User.create(userData);
        } catch (error) {
            console.error("Error syncing user creation:", error);
            throw error; // Ensures Inngest logs the error properly
        }
    }
);


// Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'sync-user-updation' // ✅ Unique ID
    },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image_url: image_url
        };

        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
);

// Inngest function to delete user from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk' // ✅ Already unique — this is fine
    },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;

        await connectDB();
        await User.findByIdAndDelete(id);
    }
);
