import React from 'react'
import {View, Text} from 'react-native'
import { SuperAdmin, colors, barChartStyle } from '../../../styles/Styles'
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
const BarChart = () => {
  return (
    <View style={barChartStyle.container}>
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryBar
        data={[
          { x: 'A', y: 1 },
          { x: 'B', y: 2 },
          { x: 'C', y: 3 },
          { x: 'D', y: 4 },
        ]}
       
      />
    </VictoryChart>
  </View>
  )
}

export default BarChart