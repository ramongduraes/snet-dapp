import React from 'react';
import {BLOCK_OFFSET, getProtobufjsURL, hasOwnDefinedProperty, MESSAGES} from "../../util";
import GRPCProtoV3Spec from "../../models/GRPCProtoV3Spec";
import {Root} from "protobufjs";
import {grpcRequest, rpcImpl} from "../../grpc";
import ChannelHelper from "../ChannelHelper";

export default class ExampleService extends React.Component {

    constructor(props) {
        super(props);
        this.submitAction = this.submitAction.bind(this);
        this.handleFormUpdate = this.handleFormUpdate.bind(this);
        this.renderComplete = this.renderComplete.bind(this);

        this.state = {
            serviceName: "Calculator",
            methodName: "Select a method",
            a: 0,
            b: 0
        };
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
        this.props.callApiCallback(this.state.serviceName,
            this.state.methodName, {
                a: this.state.a,
                b: this.state.b
            });
    }

    renderServiceMethodNames(serviceMethodNames) {
        const serviceNameOptions = ["Select a method", ...serviceMethodNames];
        return serviceNameOptions.map((serviceMethodName, index) => {
          return <option key={index}>{serviceMethodName}</option>;
        });
    }

    renderForm() {
        const service = this.props.protoSpec.findServiceByName(this.state.serviceName);
        const serviceMethodNames = service.methodNames;
        return (
            <React.Fragment>
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
                    <div className="col-md-6 col-lg-6" style={{textAlign: "right"}}>
                        <button type="button" className="btn btn-primary" onClick={this.submitAction} disabled={!this.canBeInvoked()}>Invoke</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    parseResponse() {
        const { response } = this.props;
        if(typeof response !== 'undefined') {
            if(typeof response === 'string') {
                return response;
            }
            return response.value;
        }
    }

    renderComplete() {
        const response = this.parseResponse();

        const AGITokenNetworks = '{"1":{"events":{},"links":{},"address":"0x8eb24319393716668d768dcec29356ae9cffe285","transactionHash":""},"3":{"events":{},"links":{},"address":"0xb97E9bBB6fd49865709d3F1576e8506ad640a13B","transactionHash":""},"42":{"events":{},"links":{},"address":"0x3b226ff6aad7851d3263e53cb7688d13a07f6e81","transactionHash":""}}'
        const AGITokenAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

        const MPENetworks = '{"3":{"events":{},"links":{},"address":"0x7e6366fbe3bdfce3c906667911fc5237cc96bd08","transactionHash":"0xf165b5ac0fa68a0ee96f65f92e12d21fa2b8205f315ff725068d7e31ebb62eaf"},"42":{"events":{},"links":{},"address":"0x39f31ac7b393fe2c6660b95b878feb16ea8f3156","transactionHash":"0x60bd14cda26fae48f34f5d2c418937669ddcf0776d5aa88944eb57e82144159a"}}'
        const MPEAbi = [
            {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"channels","outputs":[{"name":"nonce","type":"uint256"},{"name":"sender","type":"address"},{"name":"signer","type":"address"},{"name":"recipient","type":"address"},{"name":"groupId","type":"bytes32"},{"name":"value","type":"uint256"},{"name":"expiration","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[],"name":"nextChannelId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
            {"inputs":[{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
            {"anonymous":false,"inputs":[{"indexed":false,"name":"channelId","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"signer","type":"address"},{"indexed":true,"name":"recipient","type":"address"},{"indexed":true,"name":"groupId","type":"bytes32"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"expiration","type":"uint256"}],"name":"ChannelOpen","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"channelId","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":true,"name":"recipient","type":"address"},{"indexed":false,"name":"claimAmount","type":"uint256"},{"indexed":false,"name":"sendBackAmount","type":"uint256"},{"indexed":false,"name":"keepAmount","type":"uint256"}],"name":"ChannelClaim","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"channelId","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"claimAmount","type":"uint256"}],"name":"ChannelSenderClaim","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"channelId","type":"uint256"},{"indexed":false,"name":"newExpiration","type":"uint256"}],"name":"ChannelExtend","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"channelId","type":"uint256"},{"indexed":false,"name":"additionalFunds","type":"uint256"}],"name":"ChannelAddFunds","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"DepositFunds","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"WithdrawFunds","type":"event"},
            {"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TransferFunds","type":"event"},
            {"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"deposit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"signer","type":"address"},{"name":"recipient","type":"address"},{"name":"groupId","type":"bytes32"},{"name":"value","type":"uint256"},{"name":"expiration","type":"uint256"}],"name":"openChannel","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"signer","type":"address"},{"name":"recipient","type":"address"},{"name":"groupId","type":"bytes32"},{"name":"value","type":"uint256"},{"name":"expiration","type":"uint256"}],"name":"depositAndOpenChannel","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"channelIds","type":"uint256[]"},{"name":"amounts","type":"uint256[]"},{"name":"isSendbacks","type":"bool[]"},{"name":"v","type":"uint8[]"},{"name":"r","type":"bytes32[]"},{"name":"s","type":"bytes32[]"}],"name":"multiChannelClaim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"channelId","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"isSendback","type":"bool"}],"name":"channelClaim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"channelId","type":"uint256"},{"name":"newExpiration","type":"uint256"}],"name":"channelExtend","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"channelId","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"channelAddFunds","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"channelId","type":"uint256"},{"name":"newExpiration","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"channelExtendAndAddFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
            {"constant":false,"inputs":[{"name":"channelId","type":"uint256"}],"name":"channelClaimTimeout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
        ];

        function waitForReceipt(cb) {
            window.web3.eth.getTransactionReceipt(window.transactionHash, function (err, receipt) {
                if (err) {
                    console.log(err);
                } else {
                    if (receipt != null) {
                        if (receipt["blockNumber"] !== null) {
                            // Transaction went through
                            if (cb) {
                                cb(receipt);
                            }
                        } else {
                            window.setTimeout(function () {
                                waitForReceipt(cb);
                            }, 1000);
                        }
                    } else {
                        window.setTimeout(function () {
                            waitForReceipt(cb);
                        }, 1000);
                    }
                }
            });
        }

        function waitForEvent(cb){
            var event = getMPEInstance().ChannelOpen(
                {
                    sender: window.user_account
                },
                {
                    fromBlock: window.blockNumber - 10,
                    toBlock: 'latest'
                }).get((err, eventResult) => {
                if (err) {
                    console.log(err);
                } else {
                    if (eventResult !== null && eventResult.length > 0) {
                        if (cb) {
                            cb(eventResult);
                        }
                    } else {
                        setTimeout(function () {
                            waitForEvent(cb);
                        }, 1000);
                    }
                }
            });
        }

        function getTokenInstance() {
            let chainId = window.web3.version.network;
            let networks = JSON.parse(AGITokenNetworks);
            if (chainId in networks) {
                let contract = window.web3.eth.contract(AGITokenAbi);
                return contract.at(networks[chainId].address);
            }
            return undefined;
        }

        function getMPEInstance() {
            let chainId = window.web3.version.network;
            let networks = JSON.parse(MPENetworks);
            if (chainId in networks) {
                let contract = window.web3.eth.contract(MPEAbi);
                return contract.at(networks[chainId].address);
            }
            return undefined;
        }

        function getLatestBlock() {
            window.web3.eth.getBlock('latest', function (err, res) {
                if (!err) {
                    console.log('blockNumber["latest"]:', res.number);
                    window.blockNumber = res.number;
                    return res.number;
                }
            });
        }

        function get_account(){
            window.web3.eth.getAccounts(function (err, accounts) {
                if(accounts[0]) {
                    console.log("user_account[0]: ", accounts[0]);
                    window.web3.eth.getBalance(accounts[0], function (err, balance) {
                        console.log("Balance ETH: ", window.web3.fromWei(balance, 'ether'));
                    });
                    let tokenContract = getTokenInstance();
                    tokenContract.balanceOf(accounts[0], (error, balance) => {
                        tokenContract.decimals((error, decimals) => {
                            balance = balance.div(10**decimals);
                            console.log("Balance: ", balance);
                        });
                    });
                    window.user_account = accounts[0];
                    return accounts[0];
                }
                else {
                    return false;
                }
            });
        }

        window.user_account = "0xa6e06cf37110930d2906e6ae70ba6224eded917b";
        window.payment_address = "0x501e8c58E6C16081c0AbCf80Ce2ABb6b3f91E717";
        window.group_id = "0GwlhBaY9ke6gbX3e7CW6G/jKu9jmr5iGtKqpwZP4U4=";
        window.price_in_cogs = 1;
        const openChannel = () => {
            return new Promise((resolve, reject) => {
                window.web3.eth.getGasPrice((err, gasPrice) => {
                    if (err) {
                        gasPrice = 4700000;
                    }
                    window.blockNumber = getLatestBlock();
                    const expirationBlock = 5526630 + 50000;
                    console.log("Channel Open amount " + window.price_in_cogs + " expiration " + expirationBlock);
                    getMPEInstance().openChannel.estimateGas(
                        window.user_account,
                        window.payment_address,
                        atob(window.group_id),
                        window.price_in_cogs,
                        expirationBlock,
                        (err, estimatedGas) => {
                            if (err) {
                                estimatedGas = 210000
                            }
                            getMPEInstance().openChannel(
                                window.user_account,
                                window.payment_address,
                                atob(window.group_id),
                                window.price_in_cogs,
                                expirationBlock,
                                {gas: estimatedGas, gasPrice: gasPrice},
                                (error, hash) => {
                                    if (!error) {
                                        console.log('Opening Channel...');
                                        console.dir(hash);
                                        window.transactionHash = hash;
                                        resolve(hash);
                                    } else {
                                        console.log(error);
                                        reject(error);
                                    }
                                }
                            );
                        });
                });
            });
        };

        const isMainNetwork = () => {
            return new Promise((resolve, reject) => {
                window.web3.version.getNetwork((err, netId) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        };

        isMainNetwork()
            .then(() => {
                return
                while (get_account() === false) {
                    console.log("FAIL_1");
                }
                return openChannel();
            })
            .then((hash) => {
                return
                console.log("transactionHash:", hash);
                return waitForReceipt(function (receipt) {
                    console.log("blockNumber: ", receipt["blockNumber"]);
                    console.log("transactionHash: ", receipt["transactionHash"]);
                    window.blockNumber = receipt["blockNumber"];
                    window.transactionHash = receipt["transactionHash"];
                    console.log("/get_receipt", { receipt });
                    waitForEvent(function (eventResult) {
                        if(eventResult) {
                            for(let i=0; i<eventResult.length; i++) {
                                var last_event = eventResult[i];
                                console.log("[openChannel] last_event:", last_event);
                                if (window.transactionHash === last_event["transactionHash"]) {
                                    // EDIT HERE
                                    return true;
                                }
                            }
                        }
                        else {
                            console.log("[openChannel] No eventResult!");
                        }
                    });
                });
            })
            .catch(console.error);



        let _serviceSpecJSON = undefined;

        function composeSHA3Message(types,values) {
            var ethereumjsabi = require('ethereumjs-abi');
            var sha3Message = ethereumjsabi.soliditySHA3(types, values);
            var msg = "0x" + sha3Message.toString("hex");
            return msg;
        }

        const NETWORKS = {
            1: {
                name: "Main Ethereum Network",
                etherscan: 'https://etherscan.io',
                infura: 'http://mainnet.infura.io',
                marketplace:'',
                protobufjs:''
            },
            3: {
                name: "Ropsten Test Network",
                etherscan: 'https://ropsten.etherscan.io',
                infura: 'https://ropsten.infura.io',
                marketplace:'https://1qr45jt71g.execute-api.us-east-1.amazonaws.com/ropsten/',
                protobufjs:'https://protojs.singularitynet.io/ropsten/',
                default:true
            },
            4: {
                name: "Rinkeby Test Network",
                etherscan: 'https://rinkeby.etherscan.io',
                infura: 'https://rinkeby.infura.io',
                marketplace:'',
                protobufjs:''
            },
            42: {
                name: "Kovan Test Network",
                etherscan: 'https://kovan.etherscan.io',
                infura: 'https:/kovan.infura.io',
                marketplace:'https://260r82zgt7.execute-api.us-east-1.amazonaws.com/kovan/',
                protobufjs:'https://protojs.singularitynet.io/kovan/'
            },
        };

        function getProtobufjsURL(chainId) {
            return (chainId in NETWORKS ? NETWORKS[chainId]['protobufjs'] : undefined);
        }

        function fetchServiceSpec() {
            let _urlservicebuf = getProtobufjsURL(3) + "snet" + "/" + "example-service";
            return fetch(encodeURI(_urlservicebuf))
                .then(serviceSpecResponse => serviceSpecResponse.json())
                .then(serviceSpec => new Promise(function(resolve) {
                    _serviceSpecJSON = Root.fromJSON(serviceSpec[0]);
                    resolve();
                }));
        }

        function getGrpcChannelCredentials(serviceEndpoint) {
            if (serviceEndpoint.protocol === 'https:') {
                return grpc.credentials.createSsl();
            }

            if (serviceEndpoint.protocol === 'http:') {
                return grpc.credentials.createInsecure();
            }
        }

        fetchServiceSpec();
        handleJobInvocation("Calculator", "add", {"a": 44, "b": 60});

        function handleJobInvocation2(serviceName, methodName, requestObject) {
            let channelId = 2093;
            let nonce = 0;
            let amount_spent = 12;

            let endpointgetter = "https://bh.singularitynet.io:7052";

            var msg = composeSHA3Message(["address", "uint256", "uint256", "uint256"],
                ["0x7e6366fbe3bdfce3c906667911fc5237cc96bd08" , channelId, nonce, amount_spent]);

            window.ethjs.personal_sign(msg, "0xa6e06cf37110930d2906e6ae70ba6224eded917b")
                .then((signed) => {
                    var stripped = signed.substring(2, signed.length);
                    var byteSig = Buffer.from(stripped, 'hex');
                    let buff = new Buffer(byteSig);
                    let base64data = buff.toString('base64');

                    const requestHeaders = {
                        "snet-payment-type": "escrow",
                        "snet-payment-channel-id": channelId,
                        "snet-payment-channel-nonce": nonce,
                        "snet-payment-channel-amount": amount_spent,
                        "snet-payment-channel-signature-bin": base64data
                    };

                    console.log("Headers " + JSON.stringify(requestHeaders));
                    const packageName = "example_service";
                    console.log("Invoking service with package " + packageName + " serviceName " + serviceName + " methodName " + methodName + " endpoint " + endpointgetter);

                    const Service = _serviceSpecJSON.lookup(serviceName);
                    console.log("Service:", Service);
                    makeGRPCCall(Service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject);

                    return window.ethjs.personal_ecRecover(msg, signed);
                });
        }

        function handleJobInvocation(serviceName, methodName, requestObject) {
            let channelId = 2093;
            let endpointgetter = "https://bh.singularitynet.io:7052";
            var msg = composeSHA3Message(["uint256"],[channelId]);
            console.log("*====================================");
            window.ethjs.personal_sign(msg, "0xa6e06cf37110930d2906e6ae70ba6224eded917b")
                .then((signed) => {
                    let requestObject_channelState = { "channel_id": channelId, "signature": signed };
                    const Service = _serviceSpecJSON.lookup("PaymentChannelStateService");
                    console.log("=====================================");
                    makeGRPCCall2(Service, endpointgetter, "escrow", "PaymentChannelStateService", "GetChannelState", requestObject_channelState);
                });

            var msg = composeSHA3Message(["address", "uint256", "uint256", "uint256"],
                ["0x7e6366fbe3bdfce3c906667911fc5237cc96bd08" , channelId, 0, 9]);

            window.ethjs.personal_sign(msg, "0xa6e06cf37110930d2906e6ae70ba6224eded917b")
                .then((signed) => {
                    var stripped = signed.substring(2, signed.length);
                    var byteSig = Buffer.from(stripped, 'hex');
                    let buff = new Buffer(byteSig);
                    let base64data = buff.toString('base64');

                    const requestHeaders = {
                        "snet-payment-type": "escrow",
                        "snet-payment-channel-id": channelId,
                        "snet-payment-channel-nonce": 0,
                        "snet-payment-channel-amount": 9,
                        "snet-payment-channel-signature-bin": base64data
                    };

                    console.log("Headers " + JSON.stringify(requestHeaders));
                    const packageName = "example_service";
                    console.log("Invoking service with package " + packageName + " serviceName " + serviceName + " methodName " + methodName + " endpoint " + endpointgetter);

                    const Service = _serviceSpecJSON.lookup(serviceName);
                    console.log("Service:", Service);
                    makeGRPCCall(Service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject);

                    return window.ethjs.personal_ecRecover(msg, signed);
                });
        }

        function grpcRequest(serviceObject, methodName, requestObject) {
            methodName = methodName.charAt(0).toLowerCase() + methodName.substr(1)
            if (!serviceObject[methodName]) throw new Error(`Service does not have method ${methodName}. ${serviceObject}`);
            return serviceObject[methodName](requestObject);
        }

        function makeGRPCCall(service, endpointgetter, packageName, serviceName, methodName, requestHeaders, requestObject) {
            const serviceObject = service.create(rpcImpl(endpointgetter, packageName, serviceName, methodName, requestHeaders), false, false)
            console.log("serviceObject:", serviceObject);
            grpcRequest(serviceObject, methodName, requestObject)
                .then(response => {
                    console.log("Got a GRPC response " + JSON.stringify(response))
                })
                .catch((err) => {
                    console.log("GRPC call failed with error " + JSON.stringify(err));
                })
        }

        function makeGRPCCall2(service, endpointgetter, packageName, serviceName, methodName, requestObject) {
            const serviceObject = service.create(rpcImpl(endpointgetter, packageName, serviceName, methodName), false, false)
            grpcRequest(serviceObject, methodName, requestObject)
                .then(response => {
                    console.log("Got a GRPC response " + JSON.stringify(response))
                })
                .catch((err) => {
                    console.log("GRPC call failed with error " + JSON.stringify(err));
                })
        }

        return (
            <React.Fragment>
                <p style={{fontSize: "13px"}}>Response from service is {response} </p>
            </React.Fragment>
        );
    }

    render() {
        if (this.props.isComplete)
            return (
                <div>
                    {this.renderComplete()}
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
