import React from 'react';
import Button from '@material-ui/core/Button';
import SNETImageUpload from "./standardComponents/SNETImageUpload";
import {Grid, IconButton, MuiThemeProvider, Tooltip} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";
import SvgIcon from "@material-ui/core/SvgIcon";
import InfoIcon from "@material-ui/icons/Info";
import {createMuiTheme} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import grey from "@material-ui/core/es/colors/grey";
import red from "@material-ui/core/es/colors/red";
import Switch from "@material-ui/core/Switch";
import Slider from "@material-ui/lab/Slider";
import HoverIcon from "./standardComponents/HoverIcon";
import Session from "./paipr/Session";

export default class PAIPR extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            // From .proto file
            // Single option for both service and method names
            serviceName: "PAIPR",
            methodName: "exchange_messages",
            
            // Actual input
            data: "",
            
            // Session
            loggedIn: false,
            sessionType: '',
            username: '',
            name: '',
        };

        this.state = this.initialState;

        // this.mainFont = "Muli";
        // this.mainFontSize = 14;
        //
        // this.users_guide = "https://singnet.github.io/paipr/";
        // this.code_repo = "https://github.com/singnet/paipr";

        this.submitAction = this.submitAction.bind(this);
        this.canBeInvoked = this.canBeInvoked.bind(this);

        this.getSessionCredentials = this.getSessionCredentials.bind(this);

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

    getSessionCredentials(type, username, name) {
        console.log('PAIPR.js received credentials!');
        console.log('TODO: now submit credentials to backend!');
        console.log('PAIPR.js:');
        console.log(this.state);
        this.setState({
            type: type,
            username: username,
            name: name,
            data: "{\"message\":\"topics\"}"
        }, () => this.submitAction());
    }

    canBeInvoked() {
        //TODO
        // Can be invoked if both content and style images have been chosen
        return (this.state.content && this.state.style);
    }

    submitAction() {
        this.props.callApiCallback(
            this.state.serviceName,
            this.state.methodName,
            {
                data: this.state.data,
            });
    }

    parseResponse() {
        const { response, isComplete } = this.props;
        if(isComplete){
            if(typeof response !== 'undefined') {
                if(typeof response === 'string') {
                    return response;
                }
                console.log('Received from backend');
                console.log(response.data);
                return response.data;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    render() {
        return(
            <Session sessionData={this.getSessionCredentials} />
        )
        // return (
        //     <div style={{flexGrow: 1}}>
        //         <Paper style={{
        //             padding: 8 * 2,
        //             margin: 'auto',
        //             width: "100%",
        //             maxWidth: 550,
        //         }}>
        //             <MuiThemeProvider theme={this.theme}>
        //                 <Grid container spacing={8} justify="center" alignItems="center">
        //                     <Grid item xs={12} container alignItems="center" justify="space-between">
        //                         <Grid item>
        //                             <Typography
        //                                 style={{
        //                                     fontFamily: this.mainFont,
        //                                     fontSize: this.mainFontSize * 4 / 3,
        //                                 }}
        //                             >
        //                                 PAIPR
        //                             </Typography>
        //                         </Grid>
        //                         <Grid item xs container justify="flex-end">
        //                             <Grid item>
        //                                 <HoverIcon text="View code on Github" href={this.code_repo}>
        //                                     <SvgIcon>
        //                                         <path // Github Icon
        //                                             d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"/>
        //                                     </SvgIcon>
        //                                 </HoverIcon>
        //                             </Grid>
        //                             <Grid item>
        //                                 <HoverIcon text="User's guide" href={this.users_guide}>
        //                                     <InfoIcon/>
        //                                 </HoverIcon>
        //                             </Grid>
        //                         </Grid>
        //                     </Grid>
        //                     <Grid item xs={12} container justify="center">
        //                         <Session testProp='a' testProp2={this.state.name}/>
        //                     </Grid>
        //                     {/*{ !this.props.isComplete && this.renderSession() }*/}
        //                 </Grid>
        //             </MuiThemeProvider>
        //         </Paper>
        //     </div>
        // );
    }
}
