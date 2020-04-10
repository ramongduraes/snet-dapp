import React from 'react';
import {blue} from "@material-ui/core/colors";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import grey from "@material-ui/core/es/colors/grey";
import red from "@material-ui/core/es/colors/red";
import Session from "./paipr/Session";

import {Root} from "protobufjs";
import {grpcRequest, rpcImpl} from "../../grpc";
import GRPCProtoV3Spec from "../../models/GRPCProtoV3Spec";

import {makeStyles} from '@material-ui/core/styles';
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
import Paper from "@material-ui/core/Paper";
import {Grid} from "@material-ui/core";
import HoverIcon from "./standardComponents/HoverIcon";
import InfoIcon from "@material-ui/icons/Info";
import HelpIcon from "@material-ui/icons/Help";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SvgIcon from "@material-ui/core/SvgIcon";


import logo from "./paipr/images/SingularityNET_Logotype-black.png";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";

export default class PAIPR extends React.Component {

    constructor(props) {
        super(props);
        this.props.changeSliderWidth();

        this.initialState = {
            // From .proto file
            // Single option for both service and method names
            serviceName: "PAIPR",
            methodName: "exchange_messages",

            // Actual input
            data: "{\"message\":\"topics\"}",

            // Session
            loggedIn: true,
            sessionType: '',
            username: 'a',
            password: 'a',
            name: '',
            type: "signIn",

            // Slider width
            changedSliderWidth: false,
            myFeedsOpen: true,

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
        // this.canBeInvoked = this.canBeInvoked.bind(this);

        this.verifySessionCredentials = this.verifySessionCredentials.bind(this);
        // this.renderMainPage = this.renderMainPage.bind(this);

        //TODO: pipeline functions
        // this.renderComplete = this.renderComplete.bind(this);
        this.handleJobInvocation = this.handleJobInvocation.bind(this);
        this.makeGRPCCall = this.makeGRPCCall.bind(this);
        this.setServiceSpec = this.setServiceSpec.bind(this);
        this.fetchServiceSpec = this.fetchServiceSpec.bind(this);
        this.handleMyFeedsClick = this.handleMyFeedsClick.bind(this);

        // Color Palette
        this.theme = createMuiTheme({
            palette: {
                primary: blue,
                secondary: grey,
            },
            typography: {
                useNextVariants: true,
                mainFont: 'Muli',
                mainFontSize: 14,
            },
            overrides: {
                MuiIconButton: { // Name of the component ⚛️ / style sheet
                    colorPrimary: blue[500],
                    colorSecondary: grey[500],
                },
                MuiSvgIcon: {
                    colorPrimary: red[500],
                    colorSecondary: grey[500],
                },
                MuiDrawer: {
                    position: 'absolute',
                    // width: '214px',
                    // backgroundColor: '#EEF1FA',
                    paper: {
                        width: '214px',
                        position: 'absolute',
                        backgroundColor: '#EEF1FA',
                    },
                },
            },
        });
    }

    verifySessionCredentials(type, username, name) {
        // TODO : ACTUALLY VERIFY AND EITHER SEND FAILURE FLAG TO SESSION OR SUCCESS AND SWITCH TO MAIN PAGE
        this.setState({
                type: type,
                username: username,
                name: name,
                loggedIn: true,
                data: "{\"message\":\"topics\"}"
            }, () => this.handleJobInvocation(this.state.serviceName, this.state.methodName,
            {
                "data": this.state.data
            }
            )
        );

        if (!this.state.changedSliderWidth) {
            this.props.changeSliderWidth();
            this.setState({
                changedSliderWidth: true,
            });
        }

    }

    // canBeInvoked() {
    //     //TODO
    //     // Can be invoked if both content and style images have been chosen
    //     return (this.state.content && this.state.style);
    // }

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
        if (typeof this.state.response !== 'undefined') {
            if (typeof this.state.response === 'string') {
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
    handleMyFeedsClick() {
        const {myFeedsOpen} = this.state;
        
        this.setState({
            myFeedsOpen: !myFeedsOpen,
        });
    }

    render() {
        const response = this.parseResponse();
        const drawerWidth = 240;
        const appBarHeight = 70;
        const listItemTextStyle = {
            fontFamily: 'Muli',
            fontSize: '24px',
            marginLeft: "10px"
        };

        const {myFeedsOpen} = this.state;

        if (this.state.loggedIn
        // this.props.isComplete
        ) {
            // this.renderMainPage();
            return (
                <div
                    style={{
                        // display: 'flex',
                        // position: 'fixed',
                        // height: '500px',
                        // width: '90%',
                        backgroundColor: 'yellow',
                        // flexGrow: 1,
                    }}
                >
                    <Paper style={{
                        padding: 8 * 2,
                        margin: 'auto',
                        width: "95%",
                        minHeight:'500px',
                        // maxWidth: 550,
                        backgroundColor: 'green',
                        position:'relative'
                    }}>
                        <MuiThemeProvider theme={this.theme}>
                            <Grid container spacing={8} justify="center" alignItems="center">
                                <CssBaseline/>
                                <AppBar
                                    position="absolute"
                                    style={{
                                        // zIndex: theme.zIndex.drawer + 1,
                                        zIndex: 1201,
                                        backgroundColor:'white',
                                        height: appBarHeight,
                                    }}>
                                    <Toolbar>
                                        <img
                                            src={logo}
                                            alt="SingularityNET logo"
                                            style={{
                                                width:'190px',
                                                // maxWidth: drawerWidth,
                                                padding: '8px',
                                            }}
                                        />
                                        <Typography
                                            variant="h4"
                                            noWrap
                                            style={{
                                                color: "gray",
                                                fontFamily: 'Muli',
                                                fontWeight: 'bold',
                                                borderLeft: '1px solid #999',
                                                padding: '0.5em',
                                                flexGrow: 1,
                                            }}
                                        >
                                            Paper Recommender
                                        </Typography>
                                        <HoverIcon href={this.users_guide}>
                                            <HelpIcon/>
                                        </HoverIcon>
                                        <Button
                                            color="primary"
                                            style={{fontSize: "14px", margin: '8px'}}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            style={{fontSize: "14px", margin: '8px'}}
                                        >
                                            Sign Up Free
                                        </Button>
                                    </Toolbar>
                                </AppBar>
                                <Drawer
                                    style={{
                                        width: drawerWidth,
                                        flexShrink: 0,
                                    }}
                                    variant="permanent"
                                >
                                    <div
                                        style={{
                                            minHeight: appBarHeight
                                        }}
                                    />
                                    <List>
                                        <ListItem
                                            button
                                            key='Add Feed'
                                        >
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography style={listItemTextStyle} >
                                                        Add Feed
                                                    </Typography>
                                                }
                                            />
                                            <ListItemIcon>
                                                <AddCircleIcon/>
                                            </ListItemIcon>
                                        </ListItem>
                                    </List>
                                    <Divider/>
                                    <List>
                                        <ListItem button key='My Feeds' onClick={this.handleMyFeedsClick}>
                                            <ListItemIcon>
                                                <RssFeedIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                <Typography style={listItemTextStyle} >
                                                    My Feeds
                                                </Typography>
                                            }/>
                                            {myFeedsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </ListItem>
                                        <Collapse in={myFeedsOpen} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItem
                                                    button
                                                    style={{paddingLeft: '32px',}}
                                                >
                                                    <ListItemText secondary="No feeds added yet" />
                                                </ListItem>
                                            </List>
                                        </Collapse>
                                        {/*TODO: Use mapping to map users feeds to list
                                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                                            <ListItem button key={text}>
                                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> :
                                                    <MailIcon/>}</ListItemIcon>
                                                <ListItemText primary={text}/>
                                            </ListItem>
                                        ))}
                                        */}
                                    </List>
                                    <Divider/>
                                    <List>
                                        <ListItem button key='Saved Articles'>
                                            <ListItemIcon>
                                                <BookmarkIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                <Typography style={listItemTextStyle} >
                                                    Saved Articles
                                                </Typography>
                                            }/>
                                        </ListItem>
                                        <ListItem button key='Settings'>
                                            <ListItemIcon>
                                                <SettingsIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                <Typography style={listItemTextStyle} >
                                                    Settings
                                                </Typography>
                                            }/>
                                        </ListItem>
                                    </List>
                                </Drawer>
                                <main style={{
                                    flexGrow: 1,
                                    padding: '24px',
                                    paddingLeft: '214px',
                                }}>
                                    <div style={{minHeight: appBarHeight, paddingLeft: '214px',}} />
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
                                <Grid item xs={12} container alignItems="center" justify="space-between">
                                    <Grid item>
                                        <Typography
                                            style={{
                                                fontFamily: this.mainFont,
                                                fontSize: this.mainFontSize * 4 / 3,
                                            }}
                                        >
                                            Style Transfer
                                        </Typography>
                                    </Grid>
                                    <Grid item xs container justify="flex-end">
                                        <Grid item>
                                            <HoverIcon text="View code on Github" href={this.code_repo}>
                                                <SvgIcon>
                                                    <path // Github Icon
                                                        d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"/>
                                                </SvgIcon>
                                            </HoverIcon>
                                        </Grid>
                                        <Grid item>
                                            <HoverIcon text="User's guide" href={this.users_guide}>
                                                <InfoIcon/>
                                            </HoverIcon>
                                        </Grid>
                                        <Grid item>
                                            <HoverIcon text="View original project" href={this.reference}>
                                                <SvgIcon>
                                                    <path
                                                        d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 11.701c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701zm6 0c0 2.857-1.869 4.779-4.5 5.299l-.498-1.063c1.219-.459 2.001-1.822 2.001-2.929h-2.003v-5.008h5v3.701z"/>
                                                </SvgIcon>
                                            </HoverIcon>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/*<Grid item xs={12} container justify="center"> </Grid>*/}
                            </Grid>
                        </MuiThemeProvider>
                    </Paper>
                </div>

                // <main style={{
                //     flexGrow: 1,
                //     // padding: theme.spacing(3),
                //     padding: 24,
                // }}>
                //     <div
                //         // className={classes.toolbar}
                //     />
                //     <React.Fragment>
                //         <p style={{fontSize: "13px"}}>Response from service is {response} </p>
                //         {
                //             // this.renderComplete()
                //             this.handleJobInvocation(this.state.serviceName, this.state.methodName,
                //                 {
                //                     "data": this.state.data
                //                 }
                //             )
                //         }
                //         <div className="row">
                //             <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Remaining Calls: </div>
                //             <div className="col-md-3 col-lg-3">
                //                 <input name="balance" type="number" readOnly
                //                        style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                //                        value={this.state.balance}/>
                //             </div>
                //         </div>
                //     </React.Fragment>
                //     <Typography paragraph>
                //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                //         ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                //         facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                //         gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                //         donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                //         adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                //         Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                //         imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                //         arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                //         donec massa sapien faucibus et molestie ac.
                //     </Typography>
                //     <Typography paragraph>
                //         Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                //         facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                //         tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                //         consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                //         vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                //         hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                //         tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                //         nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                //         accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                //     </Typography>
                // </main>
            )
        } else {
            return (
                <Session sessionData={this.verifySessionCredentials}/>
            );
        }
    }
}
