import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import HoverIcon from "../standardComponents/HoverIcon";
import InfoIcon from "@material-ui/icons/Info";
import SvgIcon from "@material-ui/core/SvgIcon";
import {blue} from "@material-ui/core/colors";
import grey from "@material-ui/core/es/colors/grey";
import red from "@material-ui/core/es/colors/red";

export default class Session extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signIn: true,
            username: '',
            name:'',
        };

        this.switchMode = this.switchMode.bind(this);

        this.mainFont = "Muli";
        this.mainFontSize = 14;
        this.primaryFontSize = 20;
        this.secondaryFontSize = 16;

        this.users_guide = "https://singnet.github.io/paipr/";
        this.code_repo = "https://github.com/singnet/paipr";

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

    switchMode() {
        let {signIn} = this.state;
        this.setState({
            signIn: !signIn,
        })
    };

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
                                            fontSize: this.primaryFontSize,
                                        }}
                                    >
                                        PAIPR
                                    </Typography>
                                </Grid>
                                <Grid item xs container justify="flex-end">
                                    <Grid item>
                                        <HoverIcon text="View code on Github" href={this.code_repo}
                                                   offColor={grey[500]}>
                                            <SvgIcon>
                                                <path // Github Icon
                                                    d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z"/>
                                            </SvgIcon>
                                        </HoverIcon>
                                    </Grid>
                                    <Grid item>
                                        <HoverIcon text="User's guide" href={this.users_guide} offColor={grey[500]}>
                                            <InfoIcon/>
                                        </HoverIcon>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {this.state.signIn ?
                                <React.Fragment>
                                    <Grid item xs={12} container justify="center">
                                        <CssBaseline/>
                                        <div style={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}>
                                            <Avatar style={{
                                                margin: 1,
                                                backgroundColor: grey[500]
                                            }}>
                                                <LockOutlinedIcon/>
                                            </Avatar>
                                            <React.Fragment>
                                                <Typography style={{
                                                    fontFamily: this.mainFont,
                                                    fontSize: this.secondaryFontSize,
                                                }}>
                                                    Sign in
                                                </Typography>
                                            </React.Fragment>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} container justify="center">
                                        <form noValidate style={{
                                            width: '100%', // Fix IE 11 issue.
                                            marginTop: 1,
                                        }}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Username"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                            />
                                            {/*<TextField*/}
                                            {/*    variant="outlined"*/}
                                            {/*    margin="normal"*/}
                                            {/*    required*/}
                                            {/*    fullWidth*/}
                                            {/*    name="password"*/}
                                            {/*    label="Password"*/}
                                            {/*    type="password"*/}
                                            {/*    id="password"*/}
                                            {/*    autoComplete="current-password"*/}
                                            {/*/>*/}
                                            {/*<FormControlLabel*/}
                                            {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                                            {/*    label="Remember me"*/}
                                            {/*/>*/}
                                            <div style={{height: 24}}>
                                            </div>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                style={{textTransform: 'none',}}
                                            >
                                                <Typography
                                                    style={{
                                                        color: "white",
                                                        fontFamily: this.mainFont,
                                                        fontSize: this.mainFontSize,
                                                    }}
                                                >
                                                    Submit
                                                </Typography>
                                            </Button>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Link href="#" variant="body2">
                                                        <Typography
                                                            style={{
                                                                fontFamily: this.mainFont,
                                                                fontSize: 12,
                                                                color: blue[500]
                                                            }}
                                                        >
                                                            Forgot password?
                                                        </Typography>
                                                    </Link>
                                                </Grid>
                                                <Grid item>
                                                    <Link href="#" variant="body2" onClick={() => this.switchMode()}>
                                                        <Typography
                                                            style={{
                                                                fontFamily: this.mainFont,
                                                                fontSize: 12,
                                                                color: blue[500]
                                                            }}
                                                        >
                                                            {"Don't have an account? Sign Up"}
                                                        </Typography>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Grid>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Grid item xs={12} container justify="center">
                                        <CssBaseline/>
                                        <div style={{
                                            marginTop: 8,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}>
                                            <Avatar style={{
                                                margin: 1,
                                                backgroundColor: grey[500]
                                            }}>
                                                <LockOutlinedIcon/>
                                            </Avatar>
                                            <React.Fragment>
                                                <Typography style={{
                                                    fontFamily: this.mainFont,
                                                    fontSize: this.secondaryFontSize,
                                                }}>
                                                    Sign Up
                                                </Typography>
                                            </React.Fragment>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} container justify="center">
                                        <form
                                            noValidate
                                            onSubmit={this.submitCredentials()}
                                            style={{
                                            width: '100%', // Fix IE 11 issue.
                                            marginTop: 1,
                                        }}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="username"
                                                label="Username"
                                                name="email"
                                                // autoComplete="email"
                                                autoFocus
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="name"
                                                label="Name"
                                                // type="password"
                                                id="password"
                                                // autoComplete="current-password"
                                            />
                                            {/*<FormControlLabel*/}
                                            {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                                            {/*    label="Remember me"*/}
                                            {/*/>*/}
                                            <div style={{height: 24}}>
                                            </div>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                style={{textTransform: 'none',}}
                                            >
                                                <Typography
                                                    style={{
                                                        color: "white",
                                                        fontFamily: this.mainFont,
                                                        fontSize: this.mainFontSize,
                                                    }}
                                                >
                                                    Register
                                                </Typography>
                                            </Button>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Link href="#" variant="body2">
                                                        <Typography
                                                            style={{
                                                                fontFamily: this.mainFont,
                                                                fontSize: 12,
                                                                color: blue[500]
                                                            }}
                                                        >
                                                            Forgot password?
                                                        </Typography>
                                                    </Link>
                                                </Grid>
                                                <Grid item>
                                                    <Link href="#" variant="body2" onClick={() => this.switchMode()}>
                                                        <Typography
                                                            style={{
                                                                fontFamily: this.mainFont,
                                                                fontSize: 12,
                                                                color: blue[500]
                                                            }}
                                                        >
                                                            {"Already have an account? Sign In"}
                                                        </Typography>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Grid>
                                </React.Fragment>
                            }
                            {/*{ !this.props.isComplete && this.renderSession() }*/}
                        </Grid>
                    </MuiThemeProvider>
                </Paper>
            </div>
        );
    }
}

{/*<React.Fragment>*/
}
{/*    <Typography component="h1" variant="h5">*/
}
{/*        Sign up*/
}
{/*    </Typography>*/
}
{/*    <form className={classes.form} noValidate>*/
}
{/*        <Grid container spacing={2}>*/
}
{/*            <Grid item xs={12} sm={6}>*/
}
{/*                <TextField*/
}
{/*                    autoComplete="fname"*/
}
{/*                    name="firstName"*/
}
{/*                    variant="outlined"*/
}
{/*                    required*/
}
{/*                    fullWidth*/
}
{/*                    id="firstName"*/
}
{/*                    label="First Name"*/
}
{/*                    autoFocus*/
}
{/*                />*/
}
{/*            </Grid>*/
}
{/*            <Grid item xs={12} sm={6}>*/
}
{/*                <TextField*/
}
{/*                    variant="outlined"*/
}
{/*                    required*/
}
{/*                    fullWidth*/
}
{/*                    id="lastName"*/
}
{/*                    label="Last Name"*/
}
{/*                    name="lastName"*/
}
{/*                    autoComplete="lname"*/
}
{/*                />*/
}
{/*            </Grid>*/
}
{/*            <Grid item xs={12}>*/
}
{/*                <TextField*/
}
{/*                    variant="outlined"*/
}
{/*                    required*/
}
{/*                    fullWidth*/
}
{/*                    id="email"*/
}
{/*                    label="Email Address"*/
}
{/*                    name="email"*/
}
{/*                    autoComplete="email"*/
}
{/*                />*/
}
{/*            </Grid>*/
}
{/*            <Grid item xs={12}>*/
}
{/*                <TextField*/
}
{/*                    variant="outlined"*/
}
{/*                    required*/
}
{/*                    fullWidth*/
}
{/*                    name="password"*/
}
{/*                    label="Password"*/
}
{/*                    type="password"*/
}
{/*                    id="password"*/
}
{/*                    autoComplete="current-password"*/
}
{/*                />*/
}
{/*            </Grid>*/
}
{/*            <Grid item xs={12}>*/
}
{/*                <FormControlLabel*/
}
{/*                    control={<Checkbox value="allowExtraEmails" color="primary"/>}*/
}
{/*                    label="I want to receive inspiration, marketing promotions and updates via email."*/
}
{/*                />*/
}
{/*            </Grid>*/
}
{/*        </Grid>*/
}
{/*        <Button*/
}
{/*            type="submit"*/
}
{/*            fullWidth*/
}
{/*            variant="contained"*/
}
{/*            color="primary"*/
}
{/*        >*/
}
{/*            Sign Up*/
}
{/*        </Button>*/
}
{/*        <Grid container justify="flex-end">*/
}
{/*            <Grid item>*/
}
{/*                <Link href="#" variant="body2">*/
}
{/*                    Already have an account? Sign in*/
}
{/*                </Link>*/
}
{/*            </Grid>*/
}
{/*        </Grid>*/
}
{/*    </form>*/
}
{/*</React.Fragment>*/
}
