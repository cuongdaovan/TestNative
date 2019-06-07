import React from "react";
import {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight
} from "react-native";
import {FileSystem} from "expo"
const html = require("./assets/html/index.html");
console.log(FileSystem.documentDirectory)
const js = options => {
  let string = `
      setTimeout(() => {
      var joystick = nipplejs.create({
        zone: document.getElementById('zone_joystick'),
        color: "${options.color}",
        lockX: ${options.lockX},
        lockY: ${options.lockY},
        mode: '${options.mode}',
        size: ${options.size},
        position: {
          left: "${options.position.left}",
          top: "${options.position.top}"
        }
      });
      joystick.on('start', function(evt, data) {
        let dataToReturn = { type: "onStart", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('end', function(evt, data) {
        let dataToReturn = { type: "onEnd", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      // joystick.on('move', function(evt, data) {
      //   let dataToReturn = { type: "onMove", event: evt.type, data }
      //   window.postMessage(JSON.stringify(dataToReturn));
      // })
      joystick.on('dir', function(evt, data) {
        let dataToReturn = { type: "onDir", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('dir:up', function(evt, data) {
        let dataToReturn = { type: "onDirUp", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('dir:down', function(evt, data) {
        let dataToReturn = { type: "onDirDown", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('dir:left', function(evt, data) {
        let dataToReturn = { type: "onDirLeft", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('dir:right', function(evt, data) {
        let dataToReturn = { type: "onDirRight", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('plain', function(evt, data) {
        let dataToReturn = { type: "onPlane", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('plain:up', function(evt, data) {
        let dataToReturn = { type: "onPlaneUp", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('plain:down', function(evt, data) {
        let dataToReturn = { type: "onPlaneDown", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('plain:left', function(evt, data) {
        let dataToReturn = { type: "onPlaneLeft", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      joystick.on('plain:right', function(evt, data) {
        let dataToReturn = { type: "onPlaneRight", event: evt.type, data }
        window.postMessage(JSON.stringify(dataToReturn));
      })
      },100)
    `;
  return string;
};
export default class Joystick extends React.Component {
  constructor(props) {
    super(props);
    this.webView = null;
  }
  invokeCallback = json => {
    let { type, event, data } = JSON.parse(json);
    if (this.props[type]) {
      this.props[type](event, data);
      // console.log(this.props);
    }
  };
  onMessage(event) {
    console.log("On Message", event.nativeEvent.data);
  }

  sendPostMessage() {
    console.log("Sending post message");
    this.webView.postMessage("Post message from react native");
  }
  injectJSFileFromWeb = () => {
    //give the filename according to your need
    var jsFileName = FileSystem.documentDirectory+"/assets/html/nipplejs.min.js";
    var fp = `
        var corescript = document.createElement('script');
        corescript.type = 'text/javascript';
        corescript.src = "${jsFileName}";
        var parent = document.getElementsByTagName('head').item(0);
        parent.appendChild(corescript);
        void(0);
    `;
    this.webView.injectJavaScript(fp);
  };
  render() {
    const options = this.props.options;
    const styles = this.props.styles ? this.props.styles : "";
    return (
      <WebView
        // source={{uri: "file:///./assets/html/index.html"}}
        source={html}
        injectedJavaScript={js(options)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        renderError={error => console.log("error:" + error)}
        allowFileAccess={true}
        onMessage={evt => {
          this.invokeCallback(evt.nativeEvent.data);
          // this.onMessage(evt);
        }}
        ref={webview => {
          this.webView = webview;
        }}
        useWebKit={true}
        style={styles}
        onLoad={() => {
          {
            this.injectJSFileFromWeb();
          }
        }}
      />
    );
  }
}
