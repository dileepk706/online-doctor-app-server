import {CustomRequest } from '../../middlewares/patientAuth'
import { Response } from "express"

const Strip = require('stripe')
const stripe = Strip('sk_test_51NeJ0oSFeizR4TuZE415qa2Q5bZfdMXnFOdgsRUzlOd4EOC2827RvwLwn0DEEhudjfMLUvRuSBPr1RqNSjdEZpbE006nHxsBd0')

export const checkoutController=async (req:CustomRequest, res:Response) => {
    try {
      const price=req.body.price
    const name=req.body.doctor
    const userId=req.user?.user?._id
  
    const doctorId=req.body.doctorId
    const slotId=req.body.slotId
  
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Make appoint for Dr. ${name}`
            },
            unit_amount: price * 100,
  
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_DOMIAN || ''}/payment-success/${doctorId}/${slotId}/${price}`,
      cancel_url: `${process.env.CLIENT_DOMIAN || ''}/payment-canceled?status=true`,
    });
  
    res.status(200).json({ url: session.url });
    } catch (error:any) {
      console.log(error);
      res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
    }
  }