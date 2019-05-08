import React from 'react';
import {Root} from "protobufjs";
import {grpcRequest, rpcImpl} from "../../grpc";
import GRPCProtoV3Spec from "../../models/GRPCProtoV3Spec";


export default class ExampleService extends React.Component {

    constructor(props) {
        super(props);
        this.submitAction = this.submitAction.bind(this);
        this.handleFormUpdate = this.handleFormUpdate.bind(this);
        this.renderComplete = this.renderComplete.bind(this);


        this.get_account = this.get_account.bind(this);
        this.handleJobInvocation = this.handleJobInvocation.bind(this);
        this.makeGRPCCall = this.makeGRPCCall.bind(this);
        this.setServiceSpec = this.setServiceSpec.bind(this);
        this.fetchServiceSpec = this.fetchServiceSpec.bind(this);

        this.state = {
            payment_address: "0x501e8c58E6C16081c0AbCf80Ce2ABb6b3f91E717",
            group_id: "0GwlhBaY9ke6gbX3e7CW6G/jKu9jmr5iGtKqpwZP4U4=",
            price_in_cogs: 1,

            serviceName: "Calculator",
            methodName: "Select a method",
            a: 0,
            b: 0,
            channel_id: 0,
            spent_amount: 0,
            nonce: 0,
            response: undefined,
            balance: 0
        };

        this.serviceSpecJSON = undefined;

        this.get_account();
        this.fetchServiceSpec();
    }

    canBeInvoked() {
        return (this.state.methodName !== "Select a method");
    }

    handleFormUpdate(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onKeyPressvalidator(event) {
        const keyCode = event.keyCode || event.which;
        if (!(keyCode == 8 || keyCode == 46) && (keyCode < 48 || keyCode > 57)) {
            event.preventDefault()
        } else {
            let dots = event.target.value.split('.');
            if (dots.length > 1 && keyCode == 46)
                event.preventDefault()
        }
    }

    submitAction() {
        this.renderComplete();
    }

    renderServiceMethodNames(serviceMethodNames) {
        const serviceNameOptions = ["Select a method", ...serviceMethodNames];
        return serviceNameOptions.map((serviceMethodName, index) => {
          return <option key={index}>{serviceMethodName}</option>;
        });
    }

    get_account() {
        window.web3.eth.getAccounts(function (err, accounts) {
            if(accounts[0]) {
                window.user_account = accounts[0];
                return accounts[0];
            }
        });
    }

    renderForm() {
        const response = this.parseResponse();
        const service = this.props.protoSpec.findServiceByName(this.state.serviceName);
        const serviceMethodNames = service.methodNames;
        return (
            <React.Fragment>
                <p style={{fontSize: "13px"}}>Response from service is {response} </p>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Method Name: </div>
                    <div className="col-md-3 col-lg-3">
                        <select name="methodName"
                                value={this.state.methodName}
                                style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                                onChange={this.handleFormUpdate}>
                            {this.renderServiceMethodNames(serviceMethodNames)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Number 1: </div>
                    <div className="col-md-3 col-lg-3">
                        <input name="a" type="number"
                               style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                               value={this.state.a} onChange={this.handleFormUpdate}
                               onKeyPress={(e) => this.onKeyPressvalidator(e)}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Number 2: </div>
                    <div className="col-md-3 col-lg-3">
                        <input name="b" type="number"
                               style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                               value={this.state.b} onChange={this.handleFormUpdate}
                               onKeyPress={(e) => this.onKeyPressvalidator(e)}></input>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{padding: "10px", fontSize: "13px", marginLeft: "10px"}}>Remaining Calls: </div>
                    <div className="col-md-3 col-lg-3">
                        <input name="balance" type="number" readOnly
                               style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                               value={this.state.balance}></input>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 col-lg-6" style={{textAlign: "right"}}>
                        <button type="button" className="btn btn-primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>Invoke</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

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
        var caller = this;
        let _urlservicebuf = "https://protojs.singularitynet.io/ropsten/" + "snet" + "/" + "example-service";
        fetch(encodeURI(_urlservicebuf))
            .then(serviceSpecResponse => serviceSpecResponse.json())
            .then(serviceSpec => new Promise(function(resolve) {
                const serviceSpecJSON = Root.fromJSON(serviceSpec[0]);
                caller.setServiceSpec(serviceSpecJSON);
                resolve();
            }));
    }

    composeSHA3Message(types, values) {
        var ethereumjsabi = require('ethereumjs-abi');
        var sha3Message = ethereumjsabi.soliditySHA3(types, values);
        var msg = "0x" + sha3Message.toString("hex");
        return msg;
    }

    handleJobInvocation(serviceName, methodName, requestObject) {
        let endpointgetter = "https://bh.singularitynet.io:7052";

        var msg = this.composeSHA3Message(["address", "uint256", "uint256", "uint256"],
            [
                "0x7e6366fbe3bdfce3c906667911fc5237cc96bd08" ,
                parseInt(window.channel_id),
                parseInt(window.nonce),
                window.spent_amount + window.price
            ]);

        window.ethjs.personal_sign(msg, window.user_account)
            .then((signed) => {
                var stripped = signed.substring(2, signed.length);
                var byteSig = Buffer.from(stripped, 'hex');
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
                const packageName = "example_service";
                console.log("Invoking service with package " + packageName + " serviceName " + serviceName + " methodName " + methodName + " endpoint " + endpointgetter);

                const Service = this.serviceSpecJSON.lookup(serviceName);
                this.makeGRPCCall(Service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject);

                return window.ethjs.personal_ecRecover(msg, signed);
            });
    }

    makeGRPCCall(service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject) {
        const serviceObject = service.create(rpcImpl(endpointgetter, packageName, serviceName, methodName, requestHeaders), false, false)
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
        this.handleJobInvocation(this.state.serviceName, this.state.methodName,
            {
                "a": this.state.a,
                "b": this.state.b
            }
        );
    }

    render() {
        if (this.props.isComplete)
            return (
                <div>
                    {this.renderComplete()}
                    {this.renderForm()}
                </div>
            );
        else {
            return (
                <div>
                    {this.renderForm()}
                </div>
            )
        }
    }
}
