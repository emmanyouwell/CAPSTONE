import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, SafeAreaView } from 'react-native'
import { SuperAdmin } from '../../styles/Styles'
import Header from '../../components/Superadmin/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles } from '../../redux/actions/articleActions';
import ArticleList from '../../components/Superadmin/Articles/ArticleList';
import { resetError } from '../../redux/slices/articleSlice';

const Articles = ({ navigation }) => {
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const { articles, loading, error } = useSelector((state) => state.articles);

    useEffect(() => {
        dispatch(getArticles());
    }, [dispatch])
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

    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(resetError());
        dispatch(getArticles())
            .then(() => setRefreshing(false))
            .catch(() => setRefreshing(false));
    };
    return (
        <View style={SuperAdmin.container}>
            <Header onLogoutPress={onLogoutPress} onMenuPress={onMenuPress} />
            <Text style={styles.screenTitle}>Articles</Text>
            <View style={styles.buttonRow}>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('add_articles')}
                >
                    <Text style={styles.buttonText}>
                        <MaterialIcons name="add" size={16} color="white" /> Add
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }>
                <SafeAreaView style={styles.form}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : error ? (
                        <Text>{error}</Text>
                    ) : (
                        <ArticleList data={articles}/>
                        )}
                </SafeAreaView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    navButtons: {
        flex: 1,
        justifyContent: 'center', // Center buttons vertically
        alignItems: 'center', // Align buttons horizontally
        paddingHorizontal: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%', // Set button width to 80% of the screen width
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        marginLeft: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        marginRight: 10,
    },
});

export default Articles