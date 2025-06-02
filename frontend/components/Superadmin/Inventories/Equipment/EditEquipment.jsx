import React, { useState, useEffect, startTransition } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import Header from '../../../../components/Superadmin/Header';
import { updateEquipment } from '../../../../redux/actions/equipmentActions';
import { SuperAdmin } from '../../../../styles/Styles';
import { getUser } from '../../../../utils/helper';

const EditEquipments = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const details = route.params.item;

    console.log("Details: ", details)

    const [name, setName] = useState(details.name || '');
    const [quantity, setQuantity] = useState(String(details.quantity) || '');
    const [location, setLocation] = useState(details.location || '');
    const [images, setImages] = useState(details.images || []);
    const [mainDate, setMainDate] = useState(details.mainDate || null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [equipType, setEquipType] = useState(details.equipType || null);
    const [open, setOpen] = useState(false);
    const [items1, setItems1] = useState([
        { label: 'Consumable', value: 'Consumable' },
        { label: 'Reusable', value: 'Reusable' },
    ]);

    const [condition, setCondition] = useState(details.condition || null);
    const [open2, setOpen2] = useState(false);
    const [items2, setItems2] = useState([
        { label: 'New', value: 'New' },
        { label: 'Need Maintenance', value: 'Need Maintenance' },
        { label: 'Out of Service', value: 'Out of Service' },
    ]);

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

            setImages((prevImages) => [...prevImages, ...base64Images.map((uri) => ({ url: uri }))]);
        }
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            return;
        }
        setMainDate(selectedDate);
        setShowDatePicker(false);
    };

    const handleSubmit = () => {
        if (!name || !equipType || !quantity || !condition || !location) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const data = {
            id: details._id,
            name,
            equipType,
            quantity: Number(quantity),
            condition,
            location,
            invBy: details?.invBy,
            images,
            mainDate,
            usageLogs: details.usageLogs 
        };

        dispatch(updateEquipment(data))
            .then(() => {
                Alert.alert('Success', 'Equipment Updated!');
                navigation.goBack();
            })
            .catch((err) => Alert.alert('Error', err.message));
    };

    return (
        <View style={SuperAdmin.container}>
            <Header/>
            <ScrollView>
                <SafeAreaView style={styles.form}>
                    <Text style={styles.screenTitle}>Edit Equipment</Text>

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

                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.datePickerText}>
                            {mainDate ? mainDate.toDateString() : 'Select Maintenance Date (Optional)'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={mainDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
                        <Text style={styles.imageButtonText}>Upload Images</Text>
                    </TouchableOpacity>

                    {images.length > 0 && (
                        <View style={styles.imagePreviewContainer}>
                            {images.map((image, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri: image.url }} style={styles.imagePreview} />
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
                        <Text style={styles.submitButtonText}>Update Equipment</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
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
    datePickerButton: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 16,
    },
    datePickerText: {
        color: '#000',
    },
});

export default EditEquipments;