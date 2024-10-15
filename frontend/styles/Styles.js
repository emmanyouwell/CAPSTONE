import { StyleSheet, Platform, StatusBar, Dimensions } from "react-native";
const screenWidth = Dimensions.get('window').width;
// const screenHeight = StatusBar.currentHeight;
const screenHeight = Dimensions.get('window').height;
export const colors = {
  color1: "#E53777",
  color1_light: "#DE5F86",
  color1_dark: "#8A1531",
  color1_light2: "#89c4f4",
  color2: "#ff2d55",
  color3: "#2E040D",
  color4: "transparent",
  color5: "white",
  color6: "#f7f7f7",
  color7_black: "#050003",
  color8_dgreen: "#2a783f",
  color81_dgreen2: "#197832",
  color9_lpgreen: "#e0ffe9",
  color10_lpred: "#faccc5",
  color11_lpcyan: "#125c58",
  color12_dpurple: "#b932fc"
};
export const SuperAdminHeader = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.color1, // Background color for the header
    elevation: 2, // Add shadow for Android
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  systemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
})
export const SuperAdminMenuItem = StyleSheet.create({
  button: {
    width: 152,
    height: 146,
    backgroundColor: colors.color1, // Button background color
    padding: 10,
    borderRadius: 20,
    margin: 5, // Space between buttons
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allows button to take up available space in grid
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 16,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 5,
  },
});

export const SuperAdminMenuGrid = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0', // Background color for the grid
  },
  row: {
    justifyContent: 'space-between', // Distribute buttons evenly in the row
  },

  icon: {
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5
  }
});
export const SuperAdmin = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    padding: 32,
  },
  menuItems: {
    width: 152,
    height: 146,
    backgroundColor: colors.color1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export const donorRecordsStyle = StyleSheet.create({
  image: {
    width: screenWidth,
    height: 200,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity as needed
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Background color of the search bar
    borderRadius: 20, // Rounded corners
    paddingHorizontal: 15, // Padding inside the search bar
    width: '80%', // Adjust the width as needed
    height: 40, // Adjust the height as needed
  },
  searchInput: {
    flex: 1,
    color: 'black'
  },
  searchIcon: {
    marginLeft: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 99,
  }
});
export const dataTableStyle = StyleSheet.create({
  container: {
    padding: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeaderStyle: {
    color: colors.color2,
    fontSize: 18,
    fontWeight: 'bold'
  },
  tableBodyTextStyle: {
    color: colors.color7_black,
    fontSize: 16,
  },
  tableContainer: {
    height: (screenHeight/2) + 50,
    borderColor: 'rgba(5,0,3,0.5)',
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 5,
  },
  verticalContainer: {
    flexGrow:1,
  },
  cell: {
    minWidth: 100, // Adjust the minimum width as needed
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nameColumn: {
    width: 150,
  },
  emailColumn: {
   width: 200,
  },
  roleColumn: {
    width: 100,
  },
  ageColumn: {
   width: 80,
  },
  locationColumn: {
    width: 150,
  },
})


export const drawerStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export const buttonStyle = StyleSheet.create({
  defaultBtn: {
    backgroundColor: colors.color1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  smallBtn: {
    backgroundColor: colors.color1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
});
export const defaultStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 0,
  },

});
export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  bgColor: {
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'center',

  },
  backgroundImageStyle: {
    opacity: 1,
    zIndex: -2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
    zIndex: -2,
  },
  circle: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: screenWidth + 20,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    marginTop: 20,
    zIndex: -1,
    padding: 50,

  },
  headerLogin: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 99,
    // marginTop: (screenWidth + 200) / 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    textShadowColor: 'rgba(0, 0, 0, 1)', // Shadow color
    textShadowOffset: { width: -2, height: 3 }, // Shadow offset
    textShadowRadius: 5, // Shadow blur radius
  },
  form: {
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',

  },
});
export const divider = StyleSheet.create({
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#ccc',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
});
export const defaultImg =
  "https://p.kindpng.com/picc/s/451-4517876_default-profile-hd-png-download.png";
