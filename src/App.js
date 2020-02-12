/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Parameter from './Parameter';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const options = {
  title: 'Selecione uma imagem',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

let tflite = new Tflite();


const App: () => React$Node = () => {

  const [classificationResult, setClassificationResult] = useState('Nada classificado ainda');
  const [picture, setPicture] = useState();
  const [imageMean, setImageMean] = useState(127.5);
  const [imageStd, setImageStd] = useState(127.5);
  const [numOfResults, setNumOfResults] = useState(3);
  const [threshold, setThreshold] = useState(0);
  const [isRunning, setIsRunning] = useState(false);


  const selectPicture = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        let path = Platform.OS === 'ios' ? response.uri : 'file://' + response.path;


        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setPicture({ uri: path })
      }
    });
  }

  const classify = () => {

    setIsRunning(true);

    tflite.loadModel({
      model: 'epoch.tflite',// required
      labels: 'labels.txt',  // required
      numThreads: 1,                              // defaults to 1  
    },
      (err, res) => {
        if (err) {
          console.log('Erro ao abrir modelo', err);
          setIsRunning(false);
        }
        else {
          console.log('Modelo aberto com sucesso', res);
          runModel();
        }
      });
  }

  const runModel = () => {

    if (!imageMean && imageMean !== 0) {
      Alert.alert('Insira um imageMean válido')
      setIsRunning(false);
      return
    }
    if (!imageStd && imageStd !== 0) {
      Alert.alert('Insira um imageStd válido')
      setIsRunning(false);
      return
    }
    if (!numOfResults && numOfResults !== 0) {
      Alert.alert('Insira um numOfResults válido')
      setIsRunning(false);
      return
    }
    if (!threshold && threshold !== 0) {
      Alert.alert('Insira um threshold válido')
      setIsRunning(false);
      return
    }


    tflite.runModelOnImage({
      path: picture.uri,  // required
      imageMean: parseFloat(imageMean, 10),
      imageStd: parseFloat(imageStd, 10),
      numResults: parseFloat(numOfResults, 10),
      threshold: parseFloat(threshold, 10),
    },
      (err, res) => {
        if (err) {
          console.log('Erro ao classificar', err);
          setIsRunning(false);
        }
        else {
          console.log(res);
          setIsRunning(false);
          setClassificationResult(JSON.stringify(res));
        }
      });
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.button}>
          <Button title="Selecionar imagem" onPress={selectPicture} />
        </View>
        {picture ? <Image source={picture} style={styles.image} /> : null}
        <Parameter label="Image Mean" value={`${imageMean}`} onChangeText={text => setImageMean(text)} />
        <Parameter label="Image Std" value={`${imageStd}`} onChangeText={text => setImageStd(text)} />
        <Parameter label="Num of results" value={`${numOfResults}`} onChangeText={text => setNumOfResults(text)} />
        <Parameter label="Threshold" value={`${threshold}`} onChangeText={text => setThreshold(text)} />
        <View style={styles.button}>
          <Button title="Classificar" onPress={classify} disabled={picture ? false : true} />
        </View>
        <Text style={styles.resultText}>{classificationResult}</Text>
        {isRunning ? <ActivityIndicator style={styles.spinner} /> : null}
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 8,
  },
  resultText: {
    margin: 8,
    fontStyle: "italic",
  },
  spinner: {
    margin: 12,
    alignSelf: 'center',
  },
  button: {
    margin: 8,
  }
});

export default App;
