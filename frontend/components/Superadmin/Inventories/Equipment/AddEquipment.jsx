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
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import Header from '../../../../components/Superadmin/Header';
import { addEquipments } from '../../../../redux/actions/equipmentActions';
import { logoutUser } from '../../../../redux/actions/userActions';
import { SuperAdmin } from '../../../../styles/Styles';
import { getUser } from '../../../../utils/helper';

const AddEquipment = ({ navigation }) => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [location, setLocation] = useState('');
    const [images, setImages] = useState([]);
    const [userDetails, setUserDetails] = useState(null);

    const [equipType, setEquipType] = useState(null);
    const [open, setOpen] = useState(false);
    const [items1, setItems1] = useState([
        { label: 'Consumable', value: 'Consumable' },
        { label: 'Reusable', value: 'Reusable' },
    ]);

    const [condition, setCondition] = useState(null);
    const [open2, setOpen2] = useState(false);
    const [items2, setItems2] = useState([
        { label: 'New', value: 'New' },
        { label: 'Need Maintenance', value: 'Need Maintenance' },
    ]);

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


    const handleSubmit = () => {
        if (!name || !equipType || !quantity || !condition || !location) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const data = {
            name,
            equipType,
            quantity: Number(quantity),
            condition,
            location,
            invBy: userDetails?._id,
            images, 
        };

        dispatch(addEquipments(data))
            .then(() => {
                Alert.alert('Success', 'Equipment added successfully!');
                navigation.goBack();
            })
            .catch((err) => Alert.alert('Error', err.message));
    };

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <SafeAreaView style={styles.form}>
                <Text style={styles.screenTitle}>Add Equipment</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Equipment Name"
                    value={name}
                    onChangeText={setName}
                />

                <DropDownPicker
                    open={open}
                    value={equipType}
                    items={items1}
                    setOpen={setOpen}
                    setValue={setEquipType}
                    setItems={setItems1}
                    placeholder="Select Equipment Type"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Quantity"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                />

                <DropDownPicker
                    open={open2}
                    value={condition}
                    items={items2}
                    setOpen={setOpen2}
                    setValue={setCondition}
                    setItems={setItems2}
                    placeholder="Select Condition of Equipment"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
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
                    <Text style={styles.submitButtonText}>Add Equipment</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

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

export default AddEquipment;
