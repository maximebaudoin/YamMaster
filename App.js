import React from 'react';
import { LogBox } from 'react-native';
import HomeScreen from './app/screens/home.screen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SocketContext, socket } from './app/contexts/socket.context';
import OnlineGameScreen from './app/screens/online-game.screen';
import VsBotGameScreen from './app/screens/vs-bot-game.screen';
import TestScreen from './app/screens/test.screen';

const Stack = createStackNavigator();

LogBox.ignoreAllLogs(true);

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }} initialRouteName="HomeScreen">
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="TestScreen" component={TestScreen} />
                    <Stack.Screen name="OnlineGameScreen" component={OnlineGameScreen} />
                    <Stack.Screen name="VsBotGameScreen" component={VsBotGameScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SocketContext.Provider>
    );
}

export default App;