import React from "react";
import { LogBox } from "react-native";
import HomeScreen from "./app/screens/home.screen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SocketContext, socket } from "./app/contexts/socket.context";
import OnlineGameScreen from "./app/screens/online-game.screen";
import VsBotGameScreen from "./app/screens/vs-bot-game.screen";
import SplashScreen from "./app/screens/splash.screen";
import LoginScreen from "./app/screens/login.screen";
import SignupScreen from "./app/screens/signup.screen";
import GamesScreen from "./app/screens/games.screen";
import GameRecap from "./app/screens/game-recap.screen";

const Stack = createStackNavigator();

LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="SplashScreen"
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{gestureEnabled: false}} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{gestureEnabled: false}} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{gestureEnabled: false}} />
          <Stack.Screen name="GamesScreen" component={GamesScreen} options={{gestureEnabled: false}} />
          <Stack.Screen name="GameRecap" component={GameRecap} options={{gestureEnabled: false}} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{gestureEnabled: false}} />
          <Stack.Screen name="OnlineGameScreen" component={OnlineGameScreen} options={{gestureEnabled: false}} />
          <Stack.Screen name="VsBotGameScreen" component={VsBotGameScreen} options={{gestureEnabled: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;
