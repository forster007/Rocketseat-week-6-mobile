import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';
import logo from '../../assets/logo.png';
import styles from './styles';

export default class Main extends Component {
  state = {
    newBox: ''
  }

  async componentDidMount() {
    const box = await AsyncStorage.getItem('@RocketBox:box');

    if (box) this.props.navigation.navigate('Box');
  }

  handleInputChange = (text) => {
    this.setState({
      newBox: text
    });
  }

  handleSubmit = async () => {
    const response = await api.post('/boxes', {
      title: this.state.newBox
    });

    await AsyncStorage.setItem('@RocketBox:box', response.data._id);

    this.props.navigation.navigate('Box');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={this.handleInputChange}
          placeholder='Crie um box'
          placeholderTextColor='#999'
          style={styles.input}
          value={this.state.newBox}
          underlineColorAndroid='transparent'
        />
        <TouchableOpacity activeOpacity={0.9} onPress={this.handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
