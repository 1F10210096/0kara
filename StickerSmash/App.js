import { Button } from '@rneui/base';
import React from 'react';
import LottieView from 'lottie-react-native';
import animationData from './animation.json';

const App = () => {
  return   <LottieView
  source={animationData}
  autoPlay
  loop
  style={{ width: 200, height: 200 }}
/>
};

export default App;