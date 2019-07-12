import React from 'react';
import {blue} from "@material-ui/core/colors";
import {createMuiTheme} from '@material-ui/core/styles';
import grey from "@material-ui/core/es/colors/grey";
import red from "@material-ui/core/es/colors/red";
import Session from "./paipr/Session";

import {Root} from "protobufjs";
import {grpcRequest, rpcImpl} from "../../grpc";
import GRPCProtoV3Spec from "../../models/GRPCProtoV3Spec";

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export default class PAIPR extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            // From .proto file
            // Single option for both service and method names
            serviceName: "PAIPR",
            methodName: "exchange_messages",

            // Actual input
            data: "{\"message\":\"topics\"}",

            // Session
            loggedIn: false,
            sessionType: '',
            username: 'a',
            password: 'a',
            name: '',
            type: "signIn",

            // Slider width
            changedSliderWidth: false,

            // TODO: Pipeline variables
            response: undefined,
            balance: 0
        };

        // TODO: Pipeline code
        this.serviceSpecJSON = undefined;
        this.fetchServiceSpec();

        this.state = this.initialState;

        // this.mainFont = "Muli";
        // this.mainFontSize = 14;
        // this.users_guide = "https://singnet.github.io/paipr/";
        // this.code_repo = "https://github.com/singnet/paipr";


        // Standard service methods
        // this.submitAction = this.submitAction.bind(this);
        this.canBeInvoked = this.canBeInvoked.bind(this);

        this.verifySessionCredentials = this.verifySessionCredentials.bind(this);
        this.renderMainPage = this.renderMainPage.bind(this);

        //TODO: pipeline functions
        // this.renderComplete = this.renderComplete.bind(this);
        this.handleJobInvocation = this.handleJobInvocation.bind(this);
        this.makeGRPCCall = this.makeGRPCCall.bind(this);
        this.setServiceSpec = this.setServiceSpec.bind(this);
        this.fetchServiceSpec = this.fetchServiceSpec.bind(this);

        // Color Palette
        this.theme = createMuiTheme({
            palette: {
                primary: blue,
                secondary: grey,
            },
            typography: {
                useNextVariants: true,
            },
            overrides: {
                MuiIconButton: { // Name of the component ⚛️ / style sheet
                    colorPrimary: blue[500],
                    colorSecondary: grey[500],
                },
                MuiSvgIcon: {
                    colorPrimary: red[500],
                    colorSecondary: grey[500],
                }
            },
        });
    }

    verifySessionCredentials(type, username, name) {
        // TODO : ACTUALLY VERIFY AND EITHER SEND FAILURE FLAG TO SESSION OR SUCCESS AND SWITCH TO MAIN PAGE
        this.setState({
            type: type,
            username: username,
            name: name,
            loggedIn:true,
            data: "{\"message\":\"topics\"}"
            }, () => this.handleJobInvocation(this.state.serviceName, this.state.methodName,
                {
                    "data": this.state.data
                }
            )
        );

        if (!this.state.changedSliderWidth){
            this.props.changeSliderWidth();
            this.setState({
                changedSliderWidth: true,
            });
        }

    }

    canBeInvoked() {
        //TODO
        // Can be invoked if both content and style images have been chosen
        return (this.state.content && this.state.style);
    }

    // submitAction() {
    //     // TODO: Pipeline code
    //     this.renderComplete();
    //     // this.props.callApiCallback(
    //     //     this.state.serviceName,
    //     //     this.state.methodName,
    //     //     {
    //     //         data: this.state.data,
    //     //     });
    // }

    // parseResponse() {
    //     const {response, isComplete} = this.props;
    //     if (isComplete) {
    //         if (typeof response !== 'undefined') {
    //             if (typeof response === 'string') {
    //                 return response;
    //             }
    //             console.log('Received from backend');
    //             console.log(response.data);
    //             return response.data;
    //         } else {
    //             return null;
    //         }
    //     } else {
    //         return null;
    //     }
    // }

    parseResponse() {
        if(typeof this.state.response !== 'undefined') {
            if(typeof this.state.response === 'string') {
                return this.state.response;
            }
            return this.state.response.value;
        }
    }

    setServiceSpec(serviceSpecJSON) {
        this.serviceSpecJSON = serviceSpecJSON;
    }

    fetchServiceSpec() {
        let caller = this;
        //TODO: manual change to the service name
        let _urlservicebuf = "https://protojs.singularitynet.io/ropsten/" + "snet" + "/" + "paipr";
        fetch(encodeURI(_urlservicebuf))
            .then(serviceSpecResponse => serviceSpecResponse.json())
            .then(serviceSpec => new Promise(function (resolve) {
                const serviceSpecJSON = Root.fromJSON(serviceSpec[0]);
                caller.setServiceSpec(serviceSpecJSON);
                resolve();
            }));
    }

    composeSHA3Message(types, values) {
        let ethereumjsabi = require('ethereumjs-abi');
        let sha3Message = ethereumjsabi.soliditySHA3(types, values);
        let msg = "0x" + sha3Message.toString("hex");
        return msg;
    }

    handleJobInvocation(serviceName, methodName, requestObject) {
        //TODO: manual endpoint
        let endpointgetter = "https://bh.singularitynet.io:7075";

        let msg = this.composeSHA3Message(["address", "uint256", "uint256", "uint256"],
            [
                "0x7e6366fbe3bdfce3c906667911fc5237cc96bd08",
                parseInt(window.channel_id),
                parseInt(window.nonce),
                window.spent_amount + window.price
            ]);

        window.ethjs.personal_sign(msg, window.user_address)
            .then((signed) => {
                let stripped = signed.substring(2, signed.length);
                let byteSig = Buffer.from(stripped, 'hex');
                let buff = new Buffer(byteSig);
                let base64data = buff.toString('base64');

                const requestHeaders = {
                    "snet-payment-type": "escrow",
                    "snet-payment-channel-id": parseInt(window.channel_id),
                    "snet-payment-channel-nonce": parseInt(window.nonce),
                    "snet-payment-channel-amount": window.spent_amount + window.price,
                    "snet-payment-channel-signature-bin": base64data
                };

                //TODO: manually changed package name
                const packageName = null;
                // console.log("Invoking service with package " + packageName + " serviceName " + serviceName + " methodName " + methodName + " endpoint " + endpointgetter);

                const Service = this.serviceSpecJSON.lookup("PAIPR");
                // this.makeGRPCCall(Service,
                //     "https://bh.singularitynet.io:7075",
                //     null,
                //     "PAIPR",
                //     "exchange_messages",
                //     {
                //         "snet-payment-type": "escrow",
                //         "snet-payment-channel-id": parseInt(window.channel_id),
                //         "snet-payment-channel-nonce": parseInt(window.nonce),
                //         "snet-payment-channel-amount": window.spent_amount + window.price,
                //         "snet-payment-channel-signature-bin": base64data
                //     },
                //     {
                //         "data": "{\"message\":\"topics\"}",
                //     });
                //TODO: Changed
                this.makeGRPCCall(Service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject);

                return window.ethjs.personal_ecRecover(msg, signed);
            });
    }

    makeGRPCCall(service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject) {
        const serviceObject = service.create(rpcImpl(endpointgetter, packageName, serviceName, methodName, requestHeaders), false, false);
        grpcRequest(serviceObject, methodName, requestObject)
            .then(response => {
                console.log("Got a GRPC response " + JSON.stringify(response));
                window.spent_amount += window.price;
                window.unspent_amount -= window.price;
                this.setState(
                    {
                        response: response,
                        balance: window.unspent_amount
                    });
            })
            .catch((err) => {
                console.log("GRPC call failed with error " + JSON.stringify(err));
            })
    }

    // renderComplete() {
    //     console.log("STATE:", this.state);
    //     console.log("Service Spec JSON:", this.serviceSpecJSON);
    //     this.handleJobInvocation(this.state.serviceName, this.state.methodName,
    //         {
    //             "data": this.state.data
    //         }
    //     );
    // }

    // TODO: former function (delete when everything works fine again
    // renderComplete(){
    //     return (
    //         <React.Fragment>
    //             <p style={{fontSize: "13px"}}>Response from service is {response} </p>
    //             {
    //                 // this.renderComplete()
    //                 this.handleJobInvocation(this.state.serviceName, this.state.methodName,
    //                     {
    //                         "data": this.state.data
    //                     }
    //                 )
    //             }
    //             <Session sessionData={this.verifySessionCredentials}/>
    //             <div className="row">
    //                 <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Remaining Calls: </div>
    //                 <div className="col-md-3 col-lg-3">
    //                     <input name="balance" type="number" readOnly
    //                            style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
    //                            value={this.state.balance}/>
    //                 </div>
    //             </div>
    //         </React.Fragment>
    //     );
    // }

    renderMainPage(){
        const response = this.parseResponse();
        const drawerWidth = 240;

        // const useStyles = makeStyles(theme => ({
            // drawerPaper: {
            //     width: drawerWidth,
            // },
            // content: {
            //     flexGrow: 1,
            //     padding: theme.spacing(3),
            // },
            // toolbar: theme.mixins.toolbar,
        // }));

        // const classes = useStyles();

        return (
            <div style={{
                display: 'flex',
            }}>
                <CssBaseline />
                <AppBar position="fixed" style={{
                    // zIndex: theme.zIndex.drawer + 1,
                    zIndex: 1,
                }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Clipped drawer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    style={{
                        width: drawerWidth,
                        flexShrink: 0,
                    }}
                    variant="permanent"
                    classes={{
                        paper: {
                            width: drawerWidth,
                        },
                    }}
                >
                    <div
                        // className={classes.toolbar}
                    />
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main style={{
                    flexGrow: 1,
                    // padding: theme.spacing(3),
                    padding: 24,
                }}>
                    <div
                        // className={classes.toolbar}
                    />
                    <React.Fragment>
                        <p style={{fontSize: "13px"}}>Response from service is {response} </p>
                        {
                            // this.renderComplete()
                            this.handleJobInvocation(this.state.serviceName, this.state.methodName,
                                {
                                    "data": this.state.data
                                }
                            )
                        }
                        <Session sessionData={this.verifySessionCredentials}/>
                        <div className="row">
                            <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Remaining Calls: </div>
                            <div className="col-md-3 col-lg-3">
                                <input name="balance" type="number" readOnly
                                       style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                                       value={this.state.balance}/>
                            </div>
                        </div>
                    </React.Fragment>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                        facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                        gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                        donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                        Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                        imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                        arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                        donec massa sapien faucibus et molestie ac.
                    </Typography>
                    <Typography paragraph>
                        Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                        facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                        tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                        consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                        vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                        hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                        tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                        nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                        accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography>
                </main>
            </div>
        );
    }


    render() {
        const response = this.parseResponse();
        const drawerWidth = 240;
        if (this.state.loggedIn
            // this.props.isComplete
        ){
            // this.renderMainPage();
            return(
                <div style={{
                    display: 'flex',
                    position:'relative',
                }}>
                    <CssBaseline />
                    <AppBar position="fixed" style={{
                        // zIndex: theme.zIndex.drawer + 1,
                        zIndex: 2,
                    }}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Clipped drawer
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        style={{
                            width: drawerWidth,
                            flexShrink: 0,
                        }}
                        variant="permanent"
                        classes={{
                            paper: {
                                width: drawerWidth,
                            },
                        }}
                    >
                        <div
                            // className={classes.toolbar}
                        />
                        <List>
                            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <List>
                            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>
                    <main style={{
                        flexGrow: 1,
                        // padding: theme.spacing(3),
                        padding: 24,
                    }}>
                        <div
                            // className={classes.toolbar}
                        />
                        <React.Fragment>
                            <p style={{fontSize: "13px"}}>Response from service is {response} </p>
                            {
                                // this.renderComplete()
                                this.handleJobInvocation(this.state.serviceName, this.state.methodName,
                                    {
                                        "data": this.state.data
                                    }
                                )
                            }
                            <Session sessionData={this.verifySessionCredentials}/>
                            <div className="row">
                                <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Remaining Calls: </div>
                                <div className="col-md-3 col-lg-3">
                                    <input name="balance" type="number" readOnly
                                           style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                                           value={this.state.balance}/>
                                </div>
                            </div>
                        </React.Fragment>
                        <Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                            facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                            gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                            donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                            Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                            imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                            arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                            donec massa sapien faucibus et molestie ac.
                        </Typography>
                        <Typography paragraph>
                            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                            facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                            vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                            hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                            tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                            nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                        </Typography>
                    </main>
                </div>
            )
        }
        else {
            return (
                <Session sessionData={this.verifySessionCredentials} />
            );
        }
    }
}
