import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  Button,
  StyleSheet,
  Platform,
  StatusBar,
  ImageBackground,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { loginStyle } from "../styles/Styles";
import { divider } from "../styles/Styles";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
import { getUser } from "../utils/helper";
import Toast from "react-native-toast-message";
const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, userDetails, loading, error } = useSelector(
    (state) => state.users
  );
  const handleFormSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted:", { email, password });
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) {
        if (user.role === "User") {
          navigation.navigate("userHome");
        } else {
          navigation.navigate("superadmin_dashboard");
        }
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (userDetails && userDetails.role === "User") {
        navigation.navigate("userHome");
      } else {
        navigation.navigate("superadmin_dashboard");
      }
    }
  }, [isLoggedIn, userDetails]);
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);
  return (
    <ImageBackground
      source={require("../assets/image/milk-letting-event-1.jpg")}
      imageStyle={styles.backgroundImageStyle}
      style={styles.backgroundImage}
    >
      <LinearGradient colors={["#F05A7E", "#080607"]} style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        {loading && <Text>Loading...</Text>}
        {/* {error && <Text style={styles.error}>{error}</Text>} */}
        <Text style={styles.headerLogin}>TCHMB Portal</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.viewContent}>
            <LinearGradient
              colors={["#D00070", "#C91A84", "#7695FF"]}
              locations={[0.18, 0.5, 1]}
              style={styles.circle}
            >
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#000"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#000"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Button title="Login" onPress={handleFormSubmit} />
              </View>
              <View style={divider.dividerContainer}>
                <View style={divider.divider} />
                <Text style={divider.dividerText}>Employee Sign in</Text>
                <View style={divider.divider} />
              </View>
              <Button
                title="Sign in with ID"
                onPress={() => navigation.navigate("employee_login")}
              />
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = loginStyle;
export default Login;
