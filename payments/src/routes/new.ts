import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, errorRequest, BadRequestError, NotFoundError, NotAuthorizedError } from "@tv_best/common";
import { Order, OrderStatus } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsClient } from "../nats-wrapper";

const router = express.Router();

router.post("/api/payments",
    [body("token").notEmpty().withMessage("There should be a token"),
    body("orderId").notEmpty().withMessage("There should be an Order")],
    errorRequest, requireAuth, async (req: Request, res: Response) => {

        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("You cannot pay for the cancelled order");
        }

        const charge = await stripe.charges.create({
            currency: "usd",
            amount: order.price * 100,
            source: token
        })
        const payment = Payment.build({
            orderId: order.id,
            stripeId: charge.id
        })

        await payment.save();
        await new PaymentCreatedPublisher(natsClient.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ payment });
    })

export { router as newPaymentRouter };