import React, { useState, useRef, useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Text, Animated } from 'react-native'
import { Checkbox, DataTable } from 'react-native-paper'
import { dataTableStyle, buttonStyle } from '../../styles/Styles'
import { formatDate } from '../../utils/helper'
import { getDonors } from '../../redux/actions/donorActions'
import { useDispatch } from 'react-redux'
const DonorRecordsTable = ({ donors, totalDonors, totalPages, currentPage, setCurrentPage, pageSize }) => {


  const [selectedRows, setSelectedRows] = useState([]);


  const checkboxColumnWidth = useRef(new Animated.Value(0)).current;
  const checkboxColumnOpacity = useRef(new Animated.Value(0)).current;

  const handleLongPress = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter(rowId => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    })
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



        <DataTable.Pagination
          page={currentPage}
          numberOfPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page)
          }}
          label={`${currentPage+1} of ${totalPages}`}
        />

      </View>

      <View style={dataTableStyle.tableContainer}>
        <ScrollView horizontal>
          <ScrollView style={{ height: '100%' }} contentContainerStyle={dataTableStyle.verticalContainer}>
            <DataTable>
              <DataTable.Header>
                <Animated.View style={{ width: checkboxColumnWidth, opacity: checkboxColumnOpacity }}>
                  <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.checkboxColumn}>Select</DataTable.Title>
                </Animated.View>

                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>First Name</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Last Name</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Middle Name</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Street</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Brgy</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>City</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Phone</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Age</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Birthday</DataTable.Title>
                <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.columnWidth}>Donor Type</DataTable.Title>
                {/* <DataTable.Title textStyle={dataTableStyle.tableHeaderStyle} style={dataTableStyle.locationColumn}>Children</DataTable.Title> */}

              </DataTable.Header>

              {donors && donors.map((row, index) => (
                <DataTable.Row key={index} onLongPress={() => { handleLongPress(index) }}>
                  <Animated.View style={{ width: checkboxColumnWidth, opacity: checkboxColumnOpacity }}>
                    <DataTable.Cell style={dataTableStyle.checkboxColumn}>
                      <Checkbox
                        status={selectedRows.includes(index) ? 'checked' : 'unchecked'}
                        onPress={() => handleLongPress(index)} />
                    </DataTable.Cell>

                  </Animated.View>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.name.first}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.name.last}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.name.middle}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.home_address.street}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.home_address.brgy}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.home_address.city}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.phone}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.age}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{formatDate(row.birthday)}</DataTable.Cell>
                  <DataTable.Cell textStyle={dataTableStyle.tableBodyTextStyle} style={dataTableStyle.columnWidth}>{row.donorType}</DataTable.Cell>
                </DataTable.Row>
              ))}


            </DataTable>
          </ScrollView>
        </ScrollView>

      </View>

    </View>
  )
}

export default DonorRecordsTable