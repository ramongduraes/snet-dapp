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
        };

        this.state = this.initialState;

        this.mainFont = "Muli";
        this.mainFontSize = 14;

        this.users_guide = "https://singnet.github.io/paipr/";
        this.code_repo = "https://github.com/singnet/paipr";

        this.submitAction = this.submitAction.bind(this);
        this.canBeInvoked = this.canBeInvoked.bind(this);

        this.preserveColorSwitchChange = this.preserveColorSwitchChange.bind(this);
        this.cropSwitchChange = this.cropSwitchChange.bind(this);
        this.getContentImageData = this.getContentImageData.bind(this);
        this.getStyleImageData = this.getStyleImageData.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);

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

    //TODO
    canBeInvoked() {
        // Can be invoked if both content and style images have been chosen
        return (this.state.content && this.state.style);
    }

    submitAction() {
        this.props.callApiCallback(
            this.state.serviceName,
            this.state.methodName,
            {
                content: this.state.content,
                style: this.state.style,
                contentSize: this.state.contentSize,
                styleSize: this.state.styleSize,
                preserveColor: this.state.preserveColor,
                alpha: this.state.alpha,
                crop: this.state.crop,
                saveExt: this.state.saveExt,
            });
    }

    getContentImageData(data) {
        this.setState({content: data});
    }

    getStyleImageData(data) {
        this.setState({style: data});
    }

    preserveColorSwitchChange() {
        this.setState({preserveColor: !this.state.preserveColor})
    }

    cropSwitchChange() {
        this.setState({crop: !this.state.crop})
    }

    handleSliderChange(event, value) {
        this.setState({alpha: value})
    }

    renderSession() {

        return (
            <Session/>
        )
    }

// <React.Fragment>
// <Grid item xs={12} container justify="space-around" style={{paddingTop: 12}}>
// <Grid item xs={6} justify="center" container direction="column" alignItems="center">
// <Grid item>
// <Tooltip
// title={
//     <Typography
//         style={{fontFamily: this.mainFont, fontSize: this.mainFontSize, color: "white"}}>
//         Preserve content image's original colors.
//     </Typography>
// }
// >
// <Switch
// checked={preserveColor}
// onChange={this.preserveColorSwitchChange}
// value={preserveColor}
// color="primary"
// />
// </Tooltip>
// </Grid>
// <Grid item>
// <Typography
// style={{
//     fontFamily: this.mainFont,
//     fontSize: this.mainFontSize,
// }}
// >
// Preserve Color
// </Typography>
// </Grid>
// </Grid>
// <Grid item xs={6} justify="center" container direction="column" alignItems="center">
// <Grid item>
// <Tooltip
// title={
//     <Typography
//         style={{fontFamily: this.mainFont, fontSize: this.mainFontSize, color: "white"}}>
//         Use only the central square crop of the image.
//     </Typography>
// }>
// <Switch
// checked={crop}
// onChange={this.cropSwitchChange}
// value={crop}
// color="primary"
// />
// </Tooltip>
// </Grid>
// <Grid item>
// <Typography
// style={{
//     fontFamily: this.mainFont,
//     fontSize: this.mainFontSize,
// }}
// >
// Crop
// </Typography>
// </Grid>
// </Grid>
// </Grid>
// <Grid item xs={12} container direction="column" spacing={8} style={{paddingTop: 16}}>
// <Grid item xs={12} container justify="center">
// <Tooltip
// title={
//     <Typography
//         style={{fontFamily: this.mainFont, fontSize: this.mainFontSize, color: "white"}}
//         id="slider_label">
//         {
//             Math.round(alpha * 100) /100 // Rounds to 2 decimals
//         }
//     </Typography>
// }
// >
// <Slider
// style={{width: "80%"}}
// value={alpha}
// min={0.0}
// max={1.0}
// step={0.01}
// onChange={this.handleSliderChange}
// />
// </Tooltip>
// </Grid>
// <Grid item xs={12} container justify="center">
// <Typography
// style={{
//     fontFamily: this.mainFont,
//     fontSize: this.mainFontSize,
// }}
// >
// Content-style trade-off
// </Typography>
// </Grid>
// </Grid>
// <Grid item container justify="center" style={{paddingTop: 16}}>
// <Grid item>
// <Button variant="contained"
// size="medium"
// color="primary"
// style={{fontSize: "13px", marginLeft: "10px"}}
// onClick={this.submitAction}
// disabled={!this.canBeInvoked()}
// >
// Invoke
// </Button>
// </Grid>
// </Grid>
// </React.Fragment>

    parseResponse() {
        const { response, isComplete } = this.props;
        if(isComplete){
            if(typeof response !== 'undefined') {
                if(typeof response === 'string') {
                    return response;
                }
                return response.data;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    render() {
        return (
            <div style={{flexGrow: 1}}>
                <Paper style={{
                    padding: 8 * 2,
                    margin: 'auto',
                    width: "100%",
                    maxWidth: 550,
                }}>
                    <MuiThemeProvider theme={this.theme}>
                        <Grid container spacing={8} justify="center" alignItems="center">
                            <Grid item xs={12} container alignItems="center" justify="space-between">
                                <Grid item>
                                    <Typography
                                        style={{
                                            fontFamily: this.mainFont,
                                            fontSize: this.mainFontSize * 4 / 3,
                                        }}
                                    >
                                        PAIPR
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
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container justify="center">
                                <SNETImageUpload
                                    style={{align: "center"}}
                                    maxImageSize={3000000}
                                    maxImageWidth={2400}
                                    maxImageHeight={1800}
                                    imageDataFunc={this.getContentImageData}
                                    imageName="Input"
                                    outputImage={this.parseResponse()}
                                    outputImageName="stylizedImage"
                                    width="90%"
                                    instantUrlFetch={true}
                                    allowURL={true}
                                />
                            </Grid>
                            <Grid item xs={12} container justify="center">
                                <SNETImageUpload
                                    imageDataFunc={this.getStyleImageData}
                                    imageName="Style"
                                    maxImageSize={3000000}
                                    maxImageWidth={2400}
                                    maxImageHeight={1800}
                                    disableResetButton={this.props.isComplete}
                                    width="90%"
                                    instantUrlFetch={true}
                                    allowURL={true}
                                    imageGallery={this.styleGallery}
                                />
                            </Grid>
                            { !this.props.isComplete && this.renderSession() }
                        </Grid>
                    </MuiThemeProvider>
                </Paper>
            </div>
        );
    }
}
