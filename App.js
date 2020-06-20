/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { isEmpty } from "lodash";
import colors from './src/theme/colors';
import images from './src/images';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      joke: undefined,
      imageNumber: 0,
      searchString: ""
    }
    // this.getQuotes = this.getQuotes.bind(this) 
    // if you don't use arrow function you have to bind in order to make use of 
    // the class' scope accessing "this"
  }

  getJoke = () => {
    Keyboard.dismiss();

    this.setState({
      loading: true
    })

    fetch(`https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=sexist&contains=${this.state.searchString}`).then(response => {
      return response.json()
    }).then(response => {
      this.setState({
        joke: response,
        showDelivery: false,
        loading: false,
        imageNumber: this.getPicNumber(response)
      })
      console.log(response)
    });
  }

  getPicNumber = (response) => {
    let picNum;
    if (response.code === 101 || response.code === 106) {
      picNum = response.code;
    }
    else {
      picNum = (this.state.imageNumber + 1) % (Object.keys(images).length - 2)
    }
    return picNum;
  }

  renderJoke = () => {
    if (this.state.joke?.code === 101) {
      return <Text style={styles.text}> Calm down, champion. {"\n"} Too many requests at a time! </Text>
    }
    else if (this.state.joke?.error) {
      return <Text style={styles.text}> OH MY 404</Text>
    }

    if (!isEmpty(this.state.joke)) {
      const { type, joke, setup, delivery } = this.state.joke
      if (type === "single") {
        return <Text style={styles.text}>{joke}</Text>
      }
      return <View>
        <Text style={styles.text}>{setup}</Text>
        {this.state.showDelivery ?
          <Text style={styles.text}>{delivery}</Text> :
          <TouchableOpacity onPress={() => {
            this.setState({
              showDelivery: true
            })
            setTimeout(() => {
              this.scrollView.scrollToEnd()
            }, 50)
          }}>
            <Text style={styles.tellMeText}>Tell me!</Text>
          </TouchableOpacity>}
      </View>
    }
  }

  // TODO: scrollview indicator on long jokes

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.background}>
          <Image source={images['pic' + this.state.imageNumber]} style={styles.image} />

          <ScrollView contentContainerStyle={styles.scrollView} ref={r => this.scrollView = r}>
            <View onStartShouldSetResponder={() => true} style={styles.jokeContainer}>{this.state.loading ? <ActivityIndicator size={40} /> : this.renderJoke()}</View>
          </ScrollView>

          <TextInput onBlur={Keyboard.dismiss} style={styles.textInput} onChangeText={(searchString) => {
            this.setState({ searchString });
          }} />

          <TouchableOpacity
            style={styles.button}
            onPress={this.getJoke}
          >
            <Text style={styles.buttonText}>Joke me up!</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.white,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 50,
    flex: 1
  },
  image: {
    height: 130,
    width: Dimensions.get("window").width * 0.7,
    alignSelf: "center",
    resizeMode: "contain"
  },
  button: {
    backgroundColor: colors.darkGreen,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 24,
    marginTop: 20
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 18
  },
  tellMeText: {
    fontWeight: "bold",
    color: colors.darkGreen,
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 20
  },
  text: {
    paddingVertical: 10,
    fontWeight: "200",
    fontSize: 20,
    textAlign: "center"
  },
  jokeContainer: {
    justifyContent: "center",
    flex: 1,
    paddingVertical: 20
  },
  textInput: {
    borderColor: "black",
    borderRadius: 3,
    borderWidth: 1,
    width: "50%",
    padding: 5,
    marginTop: 20
  },
  scrollView: {
    flexGrow: 1,
    alignSelf: "center"
  }
});

export default App;
