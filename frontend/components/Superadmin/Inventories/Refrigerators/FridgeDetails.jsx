import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";

import Header from '../../Header';
import { logoutUser } from '../../../../redux/actions/userActions';
import { deleteInventory, getInventories } from '../../../../redux/actions/inventoryActions';
import { SuperAdmin } from '../../../../styles/Styles';
import { dataTableStyle } from '../../../../styles/Styles'

// Helper function to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const FridgeDetails = ({ route }) => {
    const fridge  = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { inventory, loading, error } = useSelector((state) => state.inventories);

    useEffect(() => {
        dispatch(getInventories());
    }, [dispatch]);

    const onMenuPress = () => {
        navigation.openDrawer();
    };

    const handleEdit = (row) => {
        navigation.navigate('EditMilkInventory', row)
    };

    const handleDelete = (row) => {
        dispatch(deleteInventory(row))
            .then(() => {
                Alert.alert('Success', 'Fridge deleted successfully.');
                dispatch(getInventories()); 
            })
            .catch((err) => {
                Alert.alert('Error', 'Failed to delete the fridge.');
            });
    };

    const onLogoutPress = () => {
        dispatch(logoutUser())
            .then(() => {
                navigation.navigate('login');
            })
            .catch((err) => console.log(err));
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const showEditDeleteOptions = (detail) => {
        Alert.alert(
            "Edit or Delete Fridge",
            `What would you like to do with ${detail._id}?`,
            [
                { text: "Edit", onPress: () => handleEdit(detail) },
                { text: "Delete", onPress: () => handleDelete(detail._id) },
                { text: "Cancel", style: "cancel" },
            ]
        );
    };

    const renderTable = () => {
    
    
    const filteredInventories = inventory.filter(
        (inv) => inv.fridge && inv.fridge._id === fridge._id
    );

    console.log('Inventory Details', filteredInventories)

    const renderRow = (inv, details, isPasteurized) => (
        <TouchableOpacity
            key={inv._id}
            onLongPress={() => showEditDeleteOptions(inv)}
        >
            <DataTable.Row>
                <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                    {formatDate(inv.inventoryDate)}
                </DataTable.Cell>
                <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                    {inv.status}
                </DataTable.Cell>
                {isPasteurized ? (
                    <>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {formatDate(details.pasteurizationDate)}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {details.batch}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {details.pool}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {details.bottle}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {details.volume}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {formatDate(details.expiration)}
                        </DataTable.Cell>
                    </>
                ) : (
                    <>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {details.donor?.name?.last || "No donor"}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {formatDate(details.expressDate)}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {formatDate(details.collectionDate)}
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                            {details.volume}
                        </DataTable.Cell>
                    </>
                )}
            </DataTable.Row>
        </TouchableOpacity>
    );

    if (fridge.fridgeType === 'Pasteurized') {
        return (
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Inventory Date
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Status
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Pasteur Date
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Batch
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Pool
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Bottle
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Volume
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Expiration
                    </DataTable.Title>
                </DataTable.Header>
                {filteredInventories.map((inv) =>
                    inv.pasteurizedDetails
                        ? renderRow(inv, inv.pasteurizedDetails, true)
                        : (
                            <DataTable.Row key={inv._id}>
                                <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                                    {formatDate(inv.inventoryDate)}
                                </DataTable.Cell>
                                <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth} colSpan={6}>
                                    No pasteurized details available
                                </DataTable.Cell>
                            </DataTable.Row>
                        )
                )}
            </DataTable>
        );
    } else if (fridge.fridgeType === 'Unpasteurized') {
        return (
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Inventory Date
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Status
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Donor
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Express Date
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Collection Date
                    </DataTable.Title>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                        Volume
                    </DataTable.Title>
                </DataTable.Header>
                {filteredInventories.map((inv) =>
                    inv.unpasteurizedDetails
                        ? renderRow(inv, inv.unpasteurizedDetails, false)
                        : (
                            <DataTable.Row key={inv._id}>
                                <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                                    {formatDate(inv.inventoryDate)}
                                </DataTable.Cell>
                                <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth} colSpan={4}>
                                    No unpasteurized details available
                                </DataTable.Cell>
                            </DataTable.Row>
                        )
                )}
            </DataTable>
        );
    }

    return <Text>No details available for this fridge type.</Text>;
};

    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={styles.screenTitle}>{fridge.name} Inventory</Text>
            <View style={dataTableStyle.container}>
                <View style={dataTableStyle.tableContainer}>
                    <ScrollView horizontal>
                        <ScrollView style={{ height: '100%' }} contentContainerStyle={dataTableStyle.verticalContainer}>
                            {renderTable()}
                        </ScrollView>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
});

export default FridgeDetails;
