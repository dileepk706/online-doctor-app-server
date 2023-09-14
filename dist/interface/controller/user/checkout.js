"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = void 0;
const Strip = require('stripe');
const stripe = Strip('sk_test_51NeJ0oSFeizR4TuZE415qa2Q5bZfdMXnFOdgsRUzlOd4EOC2827RvwLwn0DEEhudjfMLUvRuSBPr1RqNSjdEZpbE006nHxsBd0');
const checkoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const price = req.body.price;
        const name = req.body.doctor;
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id;
        const doctorId = req.body.doctorId;
        const slotId = req.body.slotId;
        const session = yield stripe.checkout.sessions.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.checkoutController = checkoutController;
