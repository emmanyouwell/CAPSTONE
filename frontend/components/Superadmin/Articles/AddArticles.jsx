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
import RNFS from 'react-native-fs';
import * as Mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import { Buffer } from 'buffer';
import { TextDecoder, TextEncoder } from 'text-encoding'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getUser } from '../../../utils/helper';
import { SuperAdmin } from '../../../styles/Styles';
import { logoutUser } from '../../../redux/actions/userActions';
import Header from '../../../components/Superadmin/Header';
import { useDispatch } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import { addArticles } from '../../../redux/actions/articleActions';
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.Buffer = Buffer;
const AddArticles = ({ navigation }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [images, setImages] = useState([]);
    const [article, setArticle] = useState('');
    const [fileName, setFileName] = useState('');
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
    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const handleRemoveFile = () => {
        setArticle(null);
    }
    const pickFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.docx],
            });

            const fileType = res[0].type;
            const filePath = res[0].uri;
            setFileName(res[0].name);
            // Read file as base64
            const fileData = await RNFS.readFile(filePath, 'base64');

            let extractedText = '';
            if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // Extract text from Word document
                const binaryData = Buffer.from(fileData, 'base64');
                const result = await Mammoth.convertToHtml({ arrayBuffer: binaryData });
                extractedText = result.value;
            }

            setArticle(extractedText);
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('User canceled the picker');
            } else {
                console.error('Error:', error);
            }
        }

    };
    const handleSubmit = () => {
        if (!title || !images.length || !article) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const data = {
            title,
            images,
            description: article,
        }

        dispatch(addArticles(data))
            .then(() => {
                Alert.alert('Success', 'Article published successfully!');
                navigation.goBack();
            })
            .catch((err) => Alert.alert('Error', err.message));

    };
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
                {fileName && (
                    <View style={styles.fileNameContainer}>

                        <Text style={styles.fileNameText}>{fileName}</Text>
                        <TouchableOpacity
                            style={styles.removeFileButton}
                            onPress={() => handleRemoveFile()}
                        >
                            <Text style={styles.removeImageText}>X</Text>
                        </TouchableOpacity>


                    </View>
                )}

                <TouchableOpacity disabled={article ? true : false} style={styles.imageButton} onPress={pickFile}>
                    <Text style={styles.imageButtonText}>Upload Article</Text>
                </TouchableOpacity>


                {/* Image Upload Button */}
                <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
                    <Text style={styles.imageButtonText}>Upload Images</Text>
                </TouchableOpacity>

                {/* Display Selected Images */}
                {images.length > 0 && (
                    <View style={styles.imagePreviewContainer}>
                        {images.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => handleRemoveImage(index)}
                                >
                                    <Text style={styles.removeImageText}>X</Text>
                                </TouchableOpacity>
                            </View>
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
    imageWrapper: {
        position: 'relative',
        margin: 4,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgb(255, 255, 255)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    'removeFileButton': {
        backgroundColor: 'rgb(255, 255, 255)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeImageText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
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
    fileNameContainer: {
        marginVertical: 20,
        borderWidth: 2,
        padding: 8,
        borderRadius: 8,
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    fileNameText: {
        fontSize: 12,
        color: '#333',
    },
});

export default AddArticles