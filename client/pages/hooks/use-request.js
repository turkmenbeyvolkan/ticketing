import axios from "axios";
import { useState } from "react";
import { Message } from "semantic-ui-react";

export default ({url,method,body,onSuccess}) => {
    const [errors,setErrors]=useState(null);

    const doRequest=async(props={})=>{
        try{
            setErrors(null);
            const response=await axios[method](url,
                {
                ...body, ...props
            });
            if(onSuccess){
                onSuccess(response.data);
            }
            return response.data;
        }catch(err){
            console.log(err)
            setErrors(<Message negative>{err.response?err.response.data.errors.map((errs)=>{return <li>{errs.message}</li>}):null}</Message>);
        }
    }
   
   return {doRequest,errors}; 
   
}