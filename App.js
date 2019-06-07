import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  CameraRoll,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { Permissions, Camera, ScreenOrientation } from "expo";
import Joystick from "./Joystick";
ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE_RIGHT);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      image: null,
      isRecord: false,
      video: null,
      lastLeftPress: 0
    };
  }
  
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }
  handleOnStart = async (evt, data) => {
    await this.takePicture();
  };
  handleOnRightStart = async (evt, data) => {
    await this.setState({ isRecord: true });
    if (this.state.isRecord == true) {
      this.startRecording();
    }
    console.log("starting record");
  };
  handleOnMove = (evt, data) => {
    // console.log("onMove", evt, data);
  };
  handleOnRightEnd = async (evt, data) => {
    await this.setState({ isRecord: false });
    await this.camera.stopRecording();
    console.log("ending record");
  };
  onPictureSaved = async photo => {
    this.setState({ image: photo });
    // more load here
  };
  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ skipProcessing: true }).then(data => {
        CameraRoll.saveToCameraRoll(data.uri, "photo");
        this.onPictureSaved(data);
      });
    }
  };
  onDoubleLeftPress = date => {
    const time = new Date().getTime();
    const delta = time - this.lastPress;

    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
      this.takePicture();
    }
    this.lastPress = time;
  };
  onDoubleRightPress = data => {
    const time = new Date().getTime();
    const delta = time - this.lastPress;

    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
      this.time = 0;
      this.time += 1;
    }
    if (this.time == 1){
      this.startRecording();
    }
    if (this.time == 2){
      this.camera.stopRecording();
      this.time = 0;
    }
    this.lastPress = time;
    
  }
  startRecording = async () => {
    if (this.camera) {
      this.camera.recordAsync().then(data => {
        CameraRoll.saveToCameraRoll(data.uri, "video");
      });
    }
  };
  render() {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    const styles = StyleSheet.create({
      backgroundVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      container: {
        flex: 1
      },
      view: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
      },

      joystickLeft: {
        position: "absolute",
        width: width / 3,
        height: width / 3,
        top: height / 2
      },

      joystickRight: {
        position: "absolute",
        width: width / 3,
        height: width / 3,
        top: height / 2,
        left: (width / 3) * 2 + 40
      },
      joystick: {
        backgroundColor: "transparent"
      }
    });
    var options = {
      color: "red",
      mode: "static",
      size: 500,
      position: {
        left: "40%",
        top: "40%"
      },
      lockX: false,
      lockY: false
    };
    var options2 = {
      color: "green",
      mode: "static",
      size: 500,
      position: {
        left: "40%",
        top: "40%"
      },
      lockX: false,
      lockY: false
    };
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Camera
            style={{ flex: 1, flexDirection: "row" }}
            type={this.state.type}
            ref={cam => {
              this.camera = cam;
            }}
          >
            <TouchableHighlight onPress={this.onDoubleLeftPress}>
              <View style={styles.joystickLeft}>
                <Joystick
                  options={options}
                  // onStart={this.handleOnStart}
                  // onMove={this.handleOnMove}
                  styles={styles.joystick}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.onDoubleRightPress}>
              <View style={styles.joystickRight}>
                <Joystick
                  options={options2}
                  // onStart={this.handleOnRightStart}
                  // onEnd={this.handleOnRightEnd}
                  // onMove={this.handleOnMove}
                  styles={styles.joystick}
                />
              </View>
            </TouchableHighlight>
          </Camera>
        </View>
      );
    }
  }
}
