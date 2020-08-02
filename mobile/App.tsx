import React from 'react';
import Home from './src/pages/Home';
import { StatusBar, View } from 'react-native';
import Routes from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes />
    </>
  );
}