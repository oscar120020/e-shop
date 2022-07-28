import { isValidObjectId } from "mongoose";
import { db } from ".";
import { IOrder } from "../interfaces";
import { OrderModel } from "../models";


export const getOrderById = async(id: string): Promise<IOrder | null> => {

    if(!isValidObjectId(id)) return null

    try {
        await db.connect();
        const order = await OrderModel.findById(id).lean();
        await db.disconnect();
        
        if(!order) return null;

        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log(error);
        return null;
    }



}

export const getUserOrders = async(id: string): Promise<IOrder[]> => {

    if(!isValidObjectId(id)) return [];

    try {
        await db.connect();
        const orders = await OrderModel.find({user: id}).lean();
        await db.disconnect();
    
        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.log(error);
        return [];
    }

}