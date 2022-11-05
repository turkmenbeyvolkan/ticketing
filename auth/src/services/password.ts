import {scrypt, randomBytes} from "crypto";
import {promisify} from "util";

const scryptAsync=promisify(scrypt);

export class Password{

    static async toHashPassword(password:string){
            const salt=randomBytes(8).toString("hex");
            const buf=await scryptAsync(password,salt,64) as Buffer; 
            return `${buf.toString("hex")}.${salt}`;
    }

    static async toCompare(storedPassword:string,suppliedPassword:string){
        const [password,salt]=storedPassword.split(".");
        const buf= (await scryptAsync(suppliedPassword,salt,64)) as Buffer;
        return buf.toString("hex")===password;
    }

}