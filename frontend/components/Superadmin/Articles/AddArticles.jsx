import React, { useState, useEffect, startTransition } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getUser } from '../../../utils/helper';
import { SuperAdmin } from '../../../styles/Styles';
import { logoutUser } from '../../../redux/actions/userActions';
import Header from '../../../components/Superadmin/Header';
import { useDispatch } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
const AddArticles = ({ navigation }) => {

    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);


    const [userDetails, setUserDetails] = useState(null);
    useEffect(() => {
        startTransition(() => {
            const fetchUserDetails = async () => {
                const user = await getUser();
                setUserDetails(user);
            };
            fetchUserDetails();
        });
    }, []);
    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const onLogoutPress = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.navigate('login');
            })
            .catch((err) => console.log(err));
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant camera roll permissions to upload images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const base64Images = await Promise.all(
                result.assets.map(async (asset) => {
                    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    return `data:image/jpeg;base64,${base64}`;
                })
            );

            setImages((prevImages) => [...prevImages, ...base64Images]);
        }
    };

    const handleSubmit = () => {};
    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <SafeAreaView style={styles.form}>
                <Text style={styles.screenTitle}>Add an Article</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Article title"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Image Upload Button */}
                <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
                    <Text style={styles.imageButtonText}>Upload Images</Text>
                </TouchableOpacity>

                {/* Display Selected Images */}
                {images.length > 0 && (
                    <View style={styles.imagePreviewContainer}>
                        {images.map((uri, index) => (
                            <Image key={index} source={{ uri }} style={styles.imagePreview} />
                        ))}
                    </View>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Publish Article</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}
const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    form: {
        flex: 1,
        paddingHorizontal: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    imageButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    imageButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        margin: 4,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 16,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
});

export default AddArticles