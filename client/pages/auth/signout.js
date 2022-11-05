import { useEffect } from "react";
import {Dimmer, Segment,Loader} from "semantic-ui-react"
import Router from "next/router";
import useRequest from "../hooks/use-request";

export default ()=>{
    const {doRequest}=useRequest({
        url:"/api/users/signout",
        method:"post",
        body:{},
        onSuccess:()=>Router.push("/")
    })

    useEffect(()=>{
        doRequest();
    },[])
    return  <Segment loading style={{height:"100%"}}>
            </Segment>
}