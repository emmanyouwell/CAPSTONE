import React, { useState, useRef, useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Text, Animated } from 'react-native'
import { DataTable, Checkbox } from 'react-native-paper'
import { dataTableStyle, buttonStyle } from '../../styles/Styles'
const RecipientRecordsTable = ({recipients, count, pageSize}) => {
  const [isScrollable, setIsScrollable] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  // Initial data
  const [data, setData] = useState([
    { name: 'John Doe', email: 'johndoe@gmail.com', role: 'user', age: 25, location: 'New York' },
    { name: 'Jane Smith', email: 'janesmith@gmail.com', role: 'user', age: 30, location: 'Los Angeles' },
    // Add more initial rows as needed
  ]);
  const checkboxColumnWidth = useRef(new Animated.Value(0)).current;
  const checkboxColumnOpacity = useRef(new Animated.Value(0)).current;
  // Function to add a new row
  const addRow = () => {
    const newRow = { name: 'New Donor', email: 'newdonor@gmail.com', role: 'user', age: 28, location: 'Chicago' };
    setData([...data, newRow]);
  };
  const handleLongPress = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter(rowId => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    })
  }
  const toggleScroll = () => {
    setIsScrollable(!isScrollable);
  }
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
        })
      ]).start()
    }
    else {
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
        })
      ]).start();
    }

  }, [selectedRows])
  return (
    <View style={dataTableStyle.container}>
      <View style={dataTableStyle.btnContainer}>
        {/* <TouchableOpacity onPress={toggleScroll} style={buttonStyle.smallBtn}><Text>{isScrollable ? "Fixed View" : "Scroll View"}</Text></TouchableOpacity> */}
        <DataTable.Pagination
          page={currentPage}
          numberOfPages={Math.ceil(count / pageSize)}
          onPageChange={(page) => setCurrentPage(page)}
          label={`${currentPage * pageSize + 1}-${Math.min(
            (currentPage + 1) * pageSize,
            recipients.length
          )} of ${recipients.length}`}
        />
        {/* <TouchableOpacity onPress={addRow} style={buttonStyle.smallBtn}><Text style={buttonStyle.btnText}>Add new row</Text></TouchableOpacity> */}
      </View>
      {isScrollable ? (
        <View style={dataTableStyle.tableContainer}>
        <ScrollView horizontal>
          <ScrollView style={{height: '100%'}} contentContainerStyle={dataTableStyle.verticalContainer}>
            <DataTable>
              <DataTable.Header>
              <Animated.View style={{ width: checkboxColumnWidth, opacity: checkboxColumnOpacity }}>
                    <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.checkboxColumn}>Select</DataTable.Title>
                  </Animated.View>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Name</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Address</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Phone</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Patient Type</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Hospital</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Milk Requested</DataTable.Title>

              </DataTable.Header>

              {recipients && recipients.map((row, index) => (
                  <DataTable.Row key={index} onLongPress={() => { handleLongPress(index) }}>
                    <Animated.View style={{ width: checkboxColumnWidth, opacity: checkboxColumnOpacity }}>
                      <DataTable.Cell style={dataTableStyle.checkboxColumn}>
                        <Checkbox
                          status={selectedRows.includes(index) ? 'checked' : 'unchecked'}
                          onPress={() => handleLongPress(index)} />
                      </DataTable.Cell>

                    </Animated.View>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.name}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.address}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.phone}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.patientType}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.hospital}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.milkRequested}</DataTable.Cell>
                  </DataTable.Row>
                ))}
            </DataTable>
          </ScrollView>
        </ScrollView>
        </View>
      ) : (

        
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title numeric>Email</DataTable.Title>
              <DataTable.Title numeric>Role</DataTable.Title>
              <DataTable.Title numeric>Age</DataTable.Title>
              <DataTable.Title numeric>Location</DataTable.Title>

            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>John Doe</DataTable.Cell>
              <DataTable.Cell numeric>johndoe@gmail.com</DataTable.Cell>
              <DataTable.Cell numeric>user</DataTable.Cell>
              <DataTable.Cell numeric>25</DataTable.Cell>
              <DataTable.Cell numeric>New York</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Jane Smith</DataTable.Cell>
              <DataTable.Cell numeric>johndoe@gmail.com</DataTable.Cell>
              <DataTable.Cell numeric>user</DataTable.Cell>
              <DataTable.Cell numeric>30</DataTable.Cell>
              <DataTable.Cell numeric>Los Angeles</DataTable.Cell>
            </DataTable.Row>

            {/* Add more rows as needed */}

            <DataTable.Pagination
              page={0}
              numberOfPages={3}
              onPageChange={(page) => console.log(page)}
              label="1-2 of 6"
            />
          </DataTable>
        

      )}

    </View>
  )
}

export default RecipientRecordsTable