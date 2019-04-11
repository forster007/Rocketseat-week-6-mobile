import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { distanceInWords } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import socket from 'socket.io-client';

import pt from 'date-fns/locale/pt';
import api from '../../services/api';
import styles from './styles';

export default class Box extends Component {
  state = {
    box: {}
  }

  async componentDidMount() {
    const box = await AsyncStorage.getItem('@RocketBox:box');
    const response = await api.get(`/boxes/${box}`);

    this.subscribeToNewFiles(box);
    this.setState({
      box: response.data
    });
  }

  handleFile = async (file) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      });

      await FileViewer.open(filePath);
    } catch (err) {
      alert('Arquivo não suportado');
    }
  }

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('Image picker error');
      } else if (upload.didCancel) {
        console.log('Cancelled by user');
      } else {
        const data = new FormData();
        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append('file', {
          name: `${prefix}.${ext}`,
          type: upload.type,
          uri: upload.uri
        });

        api.post(`/boxes/${this.state.box._id}/files`, data);
      }
    });
  }

  subscribeToNewFiles = (box) => {
    const io = socket('https://omnistack-week-6-backend.herokuapp.com');

    io.emit('connectRoom', box);
    io.on('file', data => {
      this.setState({
        box: {
          ...this.state.box,
          files: [
            data,
            ...this.state.box.files
          ]
        }
      });
    });
  }

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.handleFile(item)} style={styles.file}>
      <View>
        <Icon color='#A5CFFF' name='insert-drive-file' size={24} />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>
      <Text style={styles.fileDate}>
        Há {distanceInWords(item.createdAt, new Date(), { locale: pt })}
      </Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>
        <FlatList
          data={this.state.box.files}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={file => file._id}
          renderItem={this.renderItem}
          style={styles.list}
        />

        <TouchableOpacity onPress={this.handleUpload} style={styles.fab}>
          <Icon color='#FFFFFF' name='cloud-upload' size={24} />
        </TouchableOpacity>
      </View>
    );
  }
}
