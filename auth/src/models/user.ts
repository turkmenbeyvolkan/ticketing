import mongoose, {Schema, StringSchemaDefinition} from "mongoose";
import { Password } from "../services/password";

interface Userattrs{
    email:string;
    password:string;
}

interface UserModel extends mongoose.Model<UserDocument>{
    build(attrs:Userattrs):UserDocument;
}

interface UserDocument extends mongoose.Document{
    email:string;
    password:string;
}

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    toJSON:{
        transform(doc, ret) {
            ret.id=ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
})

userSchema.statics.build=(attrs:Userattrs)=>{
    return new User(attrs);
}

userSchema.pre("save",async function(done){
    if(this.isModified("password")){
        const hashed=await Password.toHashPassword(this.get("password"));
        this.set("password",hashed);
    }
    done();
})

const User=mongoose.model<UserDocument,UserModel>("user",userSchema);

export {User};