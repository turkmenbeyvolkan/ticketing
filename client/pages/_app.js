import buildRequest from '../api/build-request';
import Router from 'next/router';
import useRequest from './hooks/use-request';
import 'semantic-ui-css/semantic.min.css';
import {Header, Button, Icon, Container,Label} from "semantic-ui-react"

const AppComponent= ({Component,pageProps,currentUser})=>{
    const {doRequest,errors}=useRequest({
        url:"/api/users/signout",
        method:"post",
        data:{},
        onSuccess:()=>Router.push("/")
    })
    let handleSubmit=async(event)=>{
            event.preventDefault();
            await doRequest();
    }
    return  <div>
                <Header  as="h1" block ><div style={{cursor:"pointer"}} as="a" onClick={()=>Router.push("/")}>Ticketing Demo App</div> 
                {currentUser?
                    ([<Button compact animated  basic color='red' floated='right' onClick={()=>{Router.push("/auth/signout")}}>
                        <Button.Content hidden>
                            <Icon name="angle double right"></Icon>
                            <Icon name="angle double right"></Icon>
                            <Icon name="angle double right"></Icon>
                        </Button.Content>
                        <Button.Content visible>
                            Sign Out
                        </Button.Content>
                    </Button>,<Button compact animated  basic color='blue' floated='right' onClick={()=>{Router.push("/tickets/new")}}>
                    <Button.Content hidden>
                        <Icon name="angle double right"></Icon>
                        <Icon name="angle double right"></Icon>
                        <Icon name="angle double right"></Icon>
                    </Button.Content>
                    <Button.Content visible>
                        Sell Ticket
                    </Button.Content>
                </Button>,<Button compact animated  basic color='orange' floated='right' onClick={()=>{Router.push("/orders")}}>
                    <Button.Content hidden>
                        <Icon name="angle double right"></Icon>
                        <Icon name="angle double right"></Icon>
                        <Icon name="angle double right"></Icon>
                    </Button.Content>
                    <Button.Content visible>
                        My Orders
                    </Button.Content>
                </Button>]):(<><Button compact animated basic color="red" onClick={()=>{Router.push("/auth/signup")}} floated='right'>
                    <Button.Content hidden>
                        <Icon name="angle double right"></Icon>
                        <Icon name="angle double right"></Icon>
                        <Icon name="angle double right"></Icon>
                    </Button.Content>
                    <Button.Content visible>
                        Sign Up
                    </Button.Content>
                </Button><Button compact animated basic color="grey" onClick={()=>{Router.push("/auth/signin")}} floated='right'>
                        <Button.Content hidden>
                            <Icon name="angle double right"></Icon>
                            <Icon name="angle double right"></Icon>
                            <Icon name="angle double right"></Icon>
                        </Button.Content>
                        <Button.Content visible>
                            Sign In
                        </Button.Content>
                    </Button></>)}
                    <Header.Subheader>This is a demo app not a real app</Header.Subheader>
                </Header>
                <Container>
                    <Component currentUser={currentUser} {...pageProps} />
                </Container>
                    
                
            </div> 
    
}

AppComponent.getInitialProps=async(appContext)=>{
    const client=buildRequest(appContext.ctx);
    const {data}=await client.get("/api/users/currentuser");
    
    let pageProps={};
    if(appContext.Component.getInitialProps){
        pageProps=await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);
    }
    return {...data,
            pageProps
        }
}

export default AppComponent;