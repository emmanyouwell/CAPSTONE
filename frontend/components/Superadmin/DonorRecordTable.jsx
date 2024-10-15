import React, { useState } from 'react'
import { ScrollView, View, TouchableOpacity, Text } from 'react-native'
import { DataTable } from 'react-native-paper'
import { dataTableStyle, buttonStyle } from '../../styles/Styles'
const DonorRecordsTable = () => {
  const [isScrollable, setIsScrollable] = useState(true)
  // Initial data
  const [data, setData] = useState([
    { name: 'John Doe', email: 'johndoe@gmail.com', role: 'user', age: 25, location: 'New York' },
    { name: 'Jane Smith', email: 'janesmith@gmail.com', role: 'user', age: 30, location: 'Los Angeles' },
    // Add more initial rows as needed
  ]);
  // Function to add a new row
  const addRow = () => {
    const newRow = { name: 'New Donor', email: 'newdonor@gmail.com', role: 'user', age: 28, location: 'Chicago' };
    setData([...data, newRow]);
  };
  const toggleScroll = () => {
    setIsScrollable(!isScrollable);
  }
  return (
    <View style={dataTableStyle.container}>
      <View style={dataTableStyle.btnContainer}>
        {/* <TouchableOpacity onPress={toggleScroll} style={buttonStyle.smallBtn}><Text>{isScrollable ? "Fixed View" : "Scroll View"}</Text></TouchableOpacity> */}
       
        
      <DataTable.Pagination
        page={0}
        numberOfPages={3}
        onPageChange={(page) => console.log(page)}
        label="1-2 of 6"
      />
       <TouchableOpacity onPress={addRow} style={buttonStyle.smallBtn}><Text>Add new row</Text></TouchableOpacity>
      </View>

      {isScrollable ? (
        <View style={dataTableStyle.tableContainer}>
          <ScrollView horizontal>
            <ScrollView style={{ height: '100%'}} contentContainerStyle={dataTableStyle.verticalContainer}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.nameColumn}>Name</DataTable.Title>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.emailColumn}>Email</DataTable.Title>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.roleColumn}>Role</DataTable.Title>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.ageColumn}>Age</DataTable.Title>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.locationColumn}>Location</DataTable.Title>

                </DataTable.Header>

                {data.map((row, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.nameColumn}>{row.name}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.emailColumn}>{row.email}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.roleColumn}>{row.role}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.ageColumn}>{row.age}</DataTable.Cell>
                    <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.locationColumn}>{row.location}</DataTable.Cell>
                  </DataTable.Row>
                ))}


              </DataTable>
            </ScrollView>
          </ScrollView>

        </View>
      ) : (

        <View style={dataTableStyle.tableContainer}>
          <ScrollView style={{height: '100%'}} contentContainerStyle={dataTableStyle.verticalContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={dataTableStyle.nameColumn}>Name</DataTable.Title>
              <DataTable.Title style={dataTableStyle.emailColumn}>Email</DataTable.Title>
              <DataTable.Title style={dataTableStyle.roleColumn}>Role</DataTable.Title>
              <DataTable.Title style={dataTableStyle.ageColumn}>Age</DataTable.Title>
              <DataTable.Title style={dataTableStyle.locationColumn}>Location</DataTable.Title>

            </DataTable.Header>

            {data.map((row, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={dataTableStyle.nameColumn}>{row.name}</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.emailColumn}>{row.email}</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.roleColumn}>{row.role}</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.ageColumn}>{row.age}</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.locationColumn}>{row.location}</DataTable.Cell>
              </DataTable.Row>
            ))}

           
          </DataTable>
          </ScrollView>
        </View>
      )}

    </View>
  )
}

export default DonorRecordsTable