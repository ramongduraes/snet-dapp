import React from 'react';
import {blue} from "@material-ui/core/colors";
import {createMuiTheme} from '@material-ui/core/styles';
import grey from "@material-ui/core/es/colors/grey";
import red from "@material-ui/core/es/colors/red";
import Session from "./paipr/Session";

import {Root} from "protobufjs";
import {grpcRequest, rpcImpl} from "../../grpc";
import GRPCProtoV3Spec from "../../models/GRPCProtoV3Spec";

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
        this.submitAction = this.submitAction.bind(this);
        this.canBeInvoked = this.canBeInvoked.bind(this);

        this.verifySessionCredentials = this.verifySessionCredentials.bind(this);

        //TODO: pipeline functions
        this.renderComplete = this.renderComplete.bind(this);
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

    //TODO

    verifySessionCredentials(type, username, name) {
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
        // TODO: Pipeline code
        this.renderComplete();
        // this.props.callApiCallback(
        //     this.state.serviceName,
        //     this.state.methodName,
        //     {
        //         data: this.state.data,
        //     });
    }

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

                console.log("Headers " + JSON.stringify(requestHeaders));
                //TODO: manually changed package name
                const packageName = "paipr";
                console.log("Invoking service with package " + packageName + " serviceName " + serviceName + " methodName " + methodName + " endpoint " + endpointgetter);

                const Service = this.serviceSpecJSON.lookup("PAIPR");
                console.log("Service: ", Service);
                this.makeGRPCCall(Service,
                    "https://bh.singularitynet.io:7075",
                    null,
                    "PAIPR",
                    "exchange_messages",
                    {
                        "snet-payment-type": "escrow",
                        "snet-payment-channel-id": parseInt(window.channel_id),
                        "snet-payment-channel-nonce": parseInt(window.nonce),
                        "snet-payment-channel-amount": window.spent_amount + window.price,
                        "snet-payment-channel-signature-bin": base64data
                    },
                    {
                        "data": "{\"message\":\"topics\"}",
                    });
                //TODO: Changed
                // this.makeGRPCCall(Service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject);

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

    renderComplete() {
        console.log("STATE:", this.state);
        console.log("Service Spec JSON:", this.serviceSpecJSON);
        this.handleJobInvocation(this.state.serviceName, this.state.methodName,
            {
                "data": this.state.data
            }
        );
    }

    render() {
        const response = this.parseResponse();

        if (this.props.isComplete)
            return (
                <React.Fragment>
                    <p style={{fontSize: "13px"}}>Response from service is {response} </p>
                    {this.renderComplete()}
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
            );
        else {
            return (
                <Session sessionData={this.verifySessionCredentials}/>
            );
        }
    }
}
