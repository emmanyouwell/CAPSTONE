import React from 'react'
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { View } from 'react-native'
import { SuperAdmin, cardStyle, colors } from '../../../styles/Styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
const Cards = ({ title, subtitle, icon }) => {
    const RightContent = props => <Avatar.Icon {...props} icon={icon} color="#fff" size={30} style={{ backgroundColor: colors.color1_light }} />
    return (
        <Card style={cardStyle.card}>

            <Card.Content>
                <View style={cardStyle.cardContent}>
                    <View style={cardStyle.textWrap}>
                        <Text style={cardStyle.cardTitle}>{title}</Text>
                        <Text style={cardStyle.cardSubtitle}>{subtitle}</Text>
                    </View>

                    <RightContent />
                </View>

            </Card.Content>

        </Card>
    )
}

export default Cards