import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRouter } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comments/comment.route";

import { notFound } from "./middleware/notFounds";

import { globalErrorHandler } from "./middleware/globalErrorHandeler";
import { subscriptionRouter } from "./modules/Subcription/subcription.route";
import { stripe } from "./lib/stipe";



const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

const endpointSecret = config.stripe_webhook_secret;
app.post("/api/subscription/webhook", express.raw({ type: "application/json" }), (request: Request, response: Response) => {
    let event = request.body;
    console.log("Webhook received:", event);
    console.log(request.headers, "request.headers");
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature']!;
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err: any) {
            console.log(`⚠️ Webhook signature verification failed.`, err.message);
            return response.sendStatus(400).json({ error: `Webhook Error: ${err.message}` });
        }
        console.log("Webhook verified:", event);

    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {

    res.send("Hello, World!");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRoutes);
app.use("/api/subscription", subscriptionRouter);

app.use(notFound);

app.use(globalErrorHandler);


export default app;