import mongoose, { Model, Schema } from "mongoose";
import { IOrder } from "../interfaces";

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderItems: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "product", required: true },
        title: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        gender: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      address2: { type: String },
      zipCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentResult: {type: String},
    orderSummary: {
        numberOfItems: {type: Number, required: true},
        subTotal: {type: Number, required: true},
        tax: {type: Number, required: true},
        total: {type: Number, required: true}
    },
    isPaid: {type: Boolean, required: true, default: false},
    paidAt: {type: String},
    transactionId: {type: String}
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.order || mongoose.model("order", OrderSchema);

export default Order;
