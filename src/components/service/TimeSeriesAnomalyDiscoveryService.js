import React from 'react';
import { hasOwnDefinedProperty } from '../../util'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Slider from '@material-ui/lab/Slider';
import { Chart } from "react-google-charts";
import Tooltip from '@material-ui/core/Tooltip';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class TimeSeriesChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (window.should_render_time_series_chart_sing_net === true || nextProps.forceRender === true) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    window.should_render_time_series_chart_sing_net = false;
    return (
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={this.props.data}
        options={{
          legend: { position: 'none' },
          color: 'red',
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        }}
        legendToggle
      />
    );
  }
}

class AnomaliesChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (window.should_render_anomalies_char_sing_net === true || nextProps.forceRender === true) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    window.should_render_anomalies_char_sing_net = false;
    return (
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="AreaChart"
        loader={<div>Loading Chart</div>}
        data={this.props.data}
        options={{
          legend: { position: 'none' },
          series: {
            1: {
              // set the area opacity of the first data series to 0
              areaOpacity: 0.0
            }
          }
        }}
        legendToggle
      />
    );
  }
}

export default class TimeSeriesAnomalyDiscoveryService extends React.Component {

  constructor(props) {
    super(props);
    this.submitAction = this.submitAction.bind(this);
    this.handleServiceName = this.handleServiceName.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeSlidingWindow = this.handleChangeSlidingWindow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.UrlExists = this.UrlExists.bind(this);
    this.thresholdChange = this.thresholdChange.bind(this);
    this.updateRenderTimeSeries = this.updateRenderTimeSeries.bind(this);
    this.expandedClicked = this.expandedClicked.bind(this);
    this.updateParentExansion = this.updateParentExansion.bind(this);

    this.state = {
      serviceName: "EfficientRuleDensityBasedAnomalyDetection",
      methodName: "detectAnomalies",

      input_dialog: false,

      timeseries: "https://raw.githubusercontent.com/singnet/time-series-anomaly-discovery/master/resources/time_series/ecg0606_1.csv",
      slidingwindowsize: "100",
      alphabet: "5",
      paasize: "10",
      debugflag: "0",
      threshold: 50,
      norm_threshold: 0.5,
      loaded: false,
      response: undefined,
      timeSeriesJson: undefined,
      invertedDensityCurveJson: undefined,
      first_render: true,

      styles: {
        details: {
          fontSize: 14,
          alignItems: 'left',
        },
        defaultFontSize: {
          fontSize: 15
        }
      }
    };

    this.update_charts = false;
    this.message = undefined;
    this.isComplete = false;
    this.serviceMethods = [];
    this.allServices = [];
    this.methodsForAllServices = [];
    this.parseProps(props);
    this.slider_threshold_var = 50;
    this.to_render_time_series = undefined;
    this.to_render_anomalies = undefined;
    window.anomalies_char_sing_net_threshold = 50;
    window.should_render_anomalies_char_sing_net = false;
    window.should_render_time_series_chart_sing_net = false;
    window.min_event_set = false;
    window.max_event_set = false;
  }

  expandedClicked() {
    window.should_render_anomalies_char_sing_net = true;
    window.should_render_time_series_chart_sing_net = true;

    // force render
    this.setState({ threshold: value });
  }

  updateParentExansion() {
    // assign function to onclick property of checkbox
    var expand_button = document.getElementsByClassName("fas fa-window-maximize mini-maxi-close");
    var minimize_button = document.getElementsByClassName("fas fa-window-minimize mini-maxi-close");
    console.log(expand_button);
    console.log(minimize_button);
    if (expand_button[0] != undefined && window.max_event_set === false) {
      expand_button[0].addEventListener("click", this.expandedClicked, false);
      window.max_event_set = true;
    } if (minimize_button[0] != undefined && window.min_event_set === false) {
      minimize_button[0].addEventListener("click", this.expandedClicked, false);
      window.min_event_set = true;
    }
  }

  updateRenderTimeSeries(event, value) {
    var columns = [
      { type: 'number', label: 'x' },
      { type: 'number', label: 'value' },
      { type: 'number', label: 'value' }
    ];

    var columns_densities = [
      { type: 'number', label: 'x' },
      { type: 'number', label: 'value' },
      { type: 'number', label: 'value' }
    ];

    var time_series_rows = [];
    var densities_series_rows = [];

    this.state.norm_threshold = this.state.threshold / 100.0;
    //var window_size = (this.state.invertedDensityCurveJson.length - 1) / 500;
    for (var i = 1; i < this.state.invertedDensityCurveJson.length; i = i + 1) {
      if (this.state.invertedDensityCurveJson[i][1] > this.state.norm_threshold) {
        var pos_to_render_series = [i, this.state.timeSeriesJson[i][1], this.state.timeSeriesJson[i][1]];
        time_series_rows.push(pos_to_render_series);
      } else {
        var pos_to_render_series = [i, this.state.timeSeriesJson[i][1], null];
        time_series_rows.push(pos_to_render_series);
      }

      var pos_to_render_densities = [i, this.state.invertedDensityCurveJson[i][1], this.state.norm_threshold];
      densities_series_rows.push(pos_to_render_densities);
    }

    this.to_render_time_series = [columns, ...time_series_rows];
    this.to_render_anomalies = [columns_densities, ...densities_series_rows];

    window.should_render_anomalies_char_sing_net = true;
    window.should_render_time_series_chart_sing_net = true;

    this.setState({ threshold: value });
  }

  thresholdChange(event, value) {
    this.setState({ threshold: value });
    window.anomalies_char_sing_net_threshold = value;
  }

  parseProps(nextProps) {
    this.isComplete = nextProps.isComplete;
    if (!this.isComplete) {
      this.parseServiceSpec(nextProps.serviceSpec);
    } else {
      if (typeof nextProps.response !== 'undefined') {
        if (typeof nextProps.response === 'string') {
          this.setState({ response: nextProps.response });
        } else {
          this.setState({ response: nextProps.response.value });
        }

        this.state.timeSeriesJson = JSON.parse(this.props.response.timeseries);
        this.state.invertedDensityCurveJson = JSON.parse(this.props.response.inverted);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isComplete !== nextProps.isComplete) {
      this.parseProps(nextProps);
    }
  }

  parseServiceSpec(serviceSpec) {
    const packageName = Object.keys(serviceSpec.nested).find(key =>
      typeof serviceSpec.nested[key] === "object" &&
      hasOwnDefinedProperty(serviceSpec.nested[key], "nested"));

    var objects = undefined;
    var items = undefined;
    if (typeof packageName !== 'undefined') {
      items = serviceSpec.lookup(packageName);
      objects = Object.keys(items);
    } else {
      items = serviceSpec.nested;
      objects = Object.keys(serviceSpec.nested);
    }

    this.methodsForAllServices = [];
    objects.map(rr => {
      if (typeof items[rr] === 'object' && items[rr] !== null && items[rr].hasOwnProperty("methods")) {
        this.allServices.push(rr);
        this.methodsForAllServices.push(rr);
        var methods = Object.keys(items[rr]["methods"]);
        this.methodsForAllServices[rr] = methods;
      }
    });
  }

  handleServiceName(event) {
    var strService = event.target.value;
    this.setState({ serviceName: strService });
    this.serviceMethods.length = 0;
    var data = Object.values(this.methodsForAllServices[strService]);
    if (typeof data !== 'undefined') {
      console.log("typeof data !== 'undefined'");
      this.serviceMethods = data;
    }
  }

  UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
  }

  submitAction() {
    if (this.UrlExists(this.state.timeseries) && this.state.slidingwindowsize > 20) {
      this.props.callApiCallback(
        this.state.serviceName,
        this.state.methodName, {
          timeseries: this.state.timeseries,
          slidingwindowsize: this.state.slidingwindowsize,
          alphabet: this.state.alphabet,
          paasize: this.state.paasize,
          debugflag: this.state.debugflag
        });

    } else {
      this.setState({ input_dialog: true });
    }
  }

  handleClose() {
    this.setState({ input_dialog: false });
  };

  handleChangeUrl(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSlidingWindow(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderForm() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <br />
          <h3>Time Series Anomaly Discovery based on Grammar Compression</h3>
          <br />
          <TextField
            id="standard-multiline-static"
            label="Time Series CSV file URL"
            style={{ width: "100%" }}
            InputProps={{
              style: { fontSize: 15 }
            }}
            InputLabelProps={{
              style: { fontSize: 15 }
            }}
            value={this.state.timeseries}
            name="timeseries"
            onChange={this.handleChangeUrl}
            rows="6"
            defaultValue=""
            margin="normal"
          />
          <TextField
            id="standard-multiline-static"
            label="Sliding Window Size"
            style={{ width: "100%" }}
            type="number"
            InputProps={{
              style: { fontSize: 15 }
            }}
            InputLabelProps={{
              style: { fontSize: 15 }
            }}
            value={this.state.slidingwindowsize}
            name="slidingwindowsize"
            onChange={this.handleChangeSlidingWindow}
            rows="6"
            defaultValue=""
            margin="normal"
          />
          <br />
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={this.submitAction}>Invoke</Button>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "left", fontSize: 15, lineHeight: 2 }}>
          <br />
          <h4>
            This service <a href="https://github.com/singnet/time-series-anomaly-discovery/blob/master/docs/usersguide.md">user's guide</a> may help to understand how this service works, expected parameters and output.
          </h4>
          <h4>
            It allows to detect anomalies in time series. It follows the summarized pipeline bellow.
          </h4>
          <br />
          <ul>
            <li><b>Piecewise Aggregate approximation:</b> discretise the time series sub-sequences with a sliding window.</li>
            <li><b>Symbolic Aggregate Approximation:</b> transform the driscretized sub-sequences symbols based on an alphabet.</li>
            <li><b>Sequitur:</b> build a context-free grammar with all the generated symbols from the entire time series.</li>
            <li><b>Density Curve:</b> build a density curve based on the context-free generated grammar rules.</li>
            <li><b>Optimization and Detection:</b> detect anomalies in the density curve with a hill-climbing inspired algorithm.</li>
          </ul>
          <br />
          <h4>
            A brief explanation about the parameters:
          </h4>
          <ul>
            <li><b>Time Series CSV file URL:</b> An URL containing a time series csv file.</li>
            <li><b>Sliding Window Size:</b> Sliding window used to create the time series symbols to build the free context grammar through the Sequitur algorithm.</li>
          </ul>
          <br />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={this.state.styles.defaultFontSize}>Time Series Input Example File</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={this.state.styles.details}>
              <pre style={{
                whiteSpace: "pre-wrap",
                overflowX: "scroll"
              }}>
                https://raw.githubusercontent.com/GrammarViz2/grammarviz2_src/master/data/ecg0606_1.csv
              </pre>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={this.state.styles.defaultFontSize}>Window Size Input Example Value</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={this.state.styles.details}>
              <pre style={{
                whiteSpace: "pre-wrap",
                overflowX: "scroll"
              }}>
                100
              </pre>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </React.Fragment>
    )
  }

  renderComplete() {
    return (
      // this.props.response.output
      <React.Fragment>
        <Grid container
          direction="row"
          justify="center"
          alignItems="center">
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <h3>Input Time Series</h3>
            <p style={{ color: 'red', fontStyle: 'italic', fontSize: 13 }}>Red regions are detected anomalies.</p>
          </Grid>
          <Grid item xs={11}>
            <TimeSeriesChart
              data={this.to_render_time_series}
              forceRender={this.state.first_render}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <h3>Anomalies</h3>
            <p style={{ color: 'grey', fontStyle: 'italic', fontSize: 13 }}>Higher values mean that it is more likely <br />for that sample to be an anomaly.</p>
          </Grid>
          <Grid item xs={11}>
            <AnomaliesChart
              data={this.to_render_anomalies}
              forceRender={this.state.first_render}
            />
          </Grid>
          <Grid item xs={1}>
            <Tooltip title={
              <React.Fragment>
                <Typography color="inherit" style={{ fontSize: 15 }}>Threshold: {parseFloat((window.anomalies_char_sing_net_threshold / 100.0).toFixed(2))}</Typography>
              </React.Fragment>
            } placement='left-start'>
              <div style={{ display: 'flex', height: '247px' }}>
                <Slider
                  style={{ padding: '0px 50%' }}
                  value={this.state.threshold}
                  step={0.01}
                  onChange={this.thresholdChange}
                  onDragEnd={this.updateRenderTimeSeries}
                  vertical
                >
                </Slider>
              </div>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <p style={{ textAlign: 'center', color: 'grey', fontStyle: 'italic', fontSize: 15 }}>
              Read this <a href="https://github.com/singnet/time-series-anomaly-discovery/blob/master/docs/usersguide.md">user's guide</a> to better know the meaning of the output charts <br />
              and how to interact with them.
            </p>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    // allow to get the expand event
    this.updateParentExansion();

    if (this.isComplete) {
      if (this.state.first_render === true) {
        this.state.first_render = false;
        this.updateRenderTimeSeries();
      }

      return (
        <React.Fragment>
          <div style={{ flexGrow: 1 }}>
            <Grid container
              direction="row"
              justify="center"
              alignItems="center"
              style={{ marginTop: 15, marginBottom: 15 }}
            >
              {this.renderComplete()}
            </Grid>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <div style={{ flexGrow: 1 }}>
          <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: 15, marginBottom: 15 }}
          >
            {this.renderForm()}
          </Grid>

          <Dialog
            open={this.state.input_dialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title" style={{ fontSize: 15 }}>
              {"Usage"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description" style={{ fontSize: 15 }}>
                Please insert a valid URL and parameters.
                                <br />
                <li><b>Sliding Window Size:</b> Must be greater or equals 20 and less than the time series size.</li>
                <br />
                See example parameters below...
                                <br />
                <br />
                <strong>Time Series:</strong> https://raw.githubusercontent.com/GrammarViz2/grammarviz2_src/master/data/ecg0606_1.csv
                                <br />
                <strong>Sliding Window size:</strong> 100
                            </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  }
}