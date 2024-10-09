import React, { useState } from 'react'
import { ScrollView, View, TouchableOpacity, Text } from 'react-native'
import { DataTable } from 'react-native-paper'
import { dataTableStyle, buttonStyle } from '../../styles/Styles'
const RecipientRecordsTable = () => {
  const [isScrollable, setIsScrollable] = useState(true)

  const toggleScroll = () => {
    setIsScrollable(!isScrollable);
  }
  return (
    <View>
      <TouchableOpacity onPress={toggleScroll} style={buttonStyle.defaultBtn}><Text>{isScrollable ? "Fixed View" : "Scroll View"}</Text></TouchableOpacity>
      {isScrollable ? (
        <ScrollView horizontal>
          <View style={dataTableStyle.tableContainer}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title numeric>Email</DataTable.Title>
                <DataTable.Title numeric>Role</DataTable.Title>
                <DataTable.Title numeric>Age</DataTable.Title>
                <DataTable.Title numeric>Location</DataTable.Title>

              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell style={dataTableStyle.cell}>John Doe</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell}>johndoe@gmail.com</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell} numeric>user</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell} numeric>25</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell} numeric>New York</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell style={dataTableStyle.cell}>Jane Smith</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell}>johndoe@gmail.com</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell} numeric>user</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell} numeric>30</DataTable.Cell>
                <DataTable.Cell style={dataTableStyle.cell} numeric>Los Angeles</DataTable.Cell>
              </DataTable.Row>

              {/* Add more rows as needed */}

              <DataTable.Pagination
                page={0}
                numberOfPages={3}
                onPageChange={(page) => console.log(page)}
                label="1-2 of 6"
              />
            </DataTable>
          </View>
        </ScrollView>
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