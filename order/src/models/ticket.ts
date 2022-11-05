import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

interface TicketAttrs{
    id:string;
    title:string;
    price:number;
}

interface TicketDoc extends mongoose.Document{
    title:string;
    price:number;
    version:number
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build:(attrs:TicketAttrs)=>TicketDoc
}

const ticketSchema = new mongoose.Schema({
    _id:{
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},
{
    toJSON:{
        transform(doc, ret) {
            ret.id=ret._id;
            delete ret._id;
        },
    }
})
ticketSchema.set("versionKey","version");
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build=(attrs:TicketAttrs)=>{
    return new Ticket({
        _id:attrs.id,
        title:attrs.title,
        price:attrs.price
    });
}

const Ticket=mongoose.model<TicketDoc,TicketModel>("ticket",ticketSchema)

export {Ticket,TicketDoc};