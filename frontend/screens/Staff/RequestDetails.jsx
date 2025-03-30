import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Superadmin/Header';
import { logoutUser } from '../../redux/actions/userActions';
import { SuperAdmin, colors } from '../../styles/Styles';

const RequestDetails = ({ navigation, route }) => {
    const { request } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const onLogoutPress = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.replace('login');
            })
            .catch((err) => console.log(err));
    };

    const openImage = (imgUrl) => {
        setSelectedImage(imgUrl);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.screenTitle}>Request Details</Text>

                {request.patient.patientType === 'Inpatient' &&(<View style={styles.card}>
                    <Text style={styles.label}>Department:</Text>
                    <Text style={styles.value}>{request.department}</Text>
                </View>)}

                <View style={styles.card}>
                    <Text style={styles.label}>Hospital:</Text>
                    <Text style={styles.value}>{request.hospital}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Diagnosis:</Text>
                    <Text style={styles.value}>{request.diagnosis}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Doctor:</Text>
                    <Text style={styles.value}>{request.doctor}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Patient Name:</Text>
                    <Text style={styles.value}>{request.patient.name}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Patient Type:</Text>
                    <Text style={styles.value}>{request.patient.patientType}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Requested By:</Text>
                    <Text style={styles.value}>{request.requestedBy.name.first} {request.requestedBy.name.last}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Reason:</Text>
                    <Text style={styles.value}>{request.reason}</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={[styles.value, { color: request.status === 'Pending' ? "orange" : request.status === 'Canceled' ? colors.color2 : colors.color8_dgreen }]}> 
                        {request.status}
                    </Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.label}>Volume Requested:</Text>
                    <Text style={styles.value}>{request.volumeRequested.volume}ml for {request.volumeRequested.days} days</Text>
                </View>

                <Text style={styles.sectionTitle}>Attached Images</Text>
                <View style={styles.imageContainer}>
                    {request.images.map((img, index) => (
                        <TouchableOpacity key={index} onPress={() => openImage(img.url)}>
                            <Image source={{ uri: img.url }} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>TCHMB Details</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>EBM Pool:</Text>
                    <Text style={styles.value}>{request.tchmb.ebm.pool.length} pools available</Text>
                </View>
            </ScrollView>

            {/* Image Modal */}
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)} />
                    <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
    },
    screenTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: colors.color1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: colors.color12_dpurple,
    },
    card: {
        backgroundColor: colors.color6,
        padding: 15,
        borderRadius: 12,
        shadowColor: colors.color7_black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.color3,
    },
    value: {
        fontSize: 16,
        color: colors.color7_black,
        marginTop: 4,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        margin: 5,
        borderWidth: 2,
        borderColor: colors.color1_dark,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    fullImage: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
    },
});

export default RequestDetails;