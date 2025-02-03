import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Animated } from 'react-native';
import { DataTable, Checkbox } from 'react-native-paper';
import { dataTableStyle } from '../../styles/Styles';

const RecipientRecordsTable = ({ recipients, totalDonors, totalPages, currentPage, setCurrentPage, pageSize }) => {

  const [selectedRows, setSelectedRows] = useState([]);


  const checkboxColumnWidth = useRef(new Animated.Value(0)).current;
  const checkboxColumnOpacity = useRef(new Animated.Value(0)).current;

  const handleLongPress = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const calculateTotalMilkRequested = (requested) => {
    return requested.reduce((total, request) => {return total + request.reqId?.volume || 0},0);
  };

  useEffect(() => {
    if (selectedRows.length > 0) {
      Animated.parallel([
        Animated.timing(checkboxColumnWidth, {
          toValue: selectedRows.length > 0 ? 80 : 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(checkboxColumnOpacity, {
          toValue: selectedRows.length > 0 ? 1 : 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(checkboxColumnOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(checkboxColumnWidth, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [selectedRows]);

  return (
    <View style={dataTableStyle.container}>
      <DataTable.Pagination
        page={currentPage}
        numberOfPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        label={`${currentPage + 1} of ${totalPages}`}
      />

      <View style={dataTableStyle.tableContainer}>
        <ScrollView horizontal>
          <ScrollView style={{ height: '100%' }} contentContainerStyle={dataTableStyle.verticalContainer}>
            <DataTable>
              <DataTable.Header>
                <Animated.View style={{ width: checkboxColumnWidth, opacity: checkboxColumnOpacity }}>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.checkboxColumn}>
                    Select
                  </DataTable.Title>
                </Animated.View>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Name
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Street
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Brgy
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  City
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Phone
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Patient Type
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Hospital
                </DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>
                  Milk Requested (ml)
                </DataTable.Title>
              </DataTable.Header>

              {recipients &&
                recipients.map((row, index) => (
                  <DataTable.Row key={index} onLongPress={() => handleLongPress(index)}>
                    <Animated.View style={{ width: checkboxColumnWidth, opacity: checkboxColumnOpacity }}>
                      <DataTable.Cell style={dataTableStyle.checkboxColumn}>
                        <Checkbox
                          status={selectedRows.includes(index) ? 'checked' : 'unchecked'}
                          onPress={() => handleLongPress(index)}
                        />
                      </DataTable.Cell>
                    </Animated.View>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.name}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.home_address.street}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.home_address.brgy}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.home_address.city}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.phone}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.patientType}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {row.hospital}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>
                      {calculateTotalMilkRequested(row.requested)} ml
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
            </DataTable>
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

export default RecipientRecordsTable;