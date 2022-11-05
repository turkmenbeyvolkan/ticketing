import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Status} from "@tv_best/common"; 
import {TicketDoc} from "./ticket";

interface OrderAttrs{
    userId:string;
    status:Status;
    expiresAt:Date;
    ticket:TicketDoc;
}

interface OrderDoc extends mongoose.Document{
    userId:string;
    status:Status;
    expiresAt:Date;
    version:number;
    ticket:TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build:(attrs:OrderAttrs)=>OrderDoc;
}

const orderSchema= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:Status,
        default:Status.Created
    },
    expiresAt:{
        type:Date,
    },
    ticket:{
        type:String,
        ref:"ticket"
    }
    
},{
    toJSON:{
        transform(doc, ret) {
            ret.id=ret._id;
            delete ret._id;
        },
    }
})
orderSchema.set("versionKey","version");
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build=(attrs:OrderAttrs)=>{
    return new Order(attrs);
}

const Order=mongoose.model<OrderDoc,OrderModel>("order",orderSchema);

export {Order,Status as OrderStatus}