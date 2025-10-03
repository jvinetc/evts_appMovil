import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchBarPedidos = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [results, setResults] = useState<string[]>([]);
    useEffect(() => {
        if (searchText.length > 3) {
            search(searchText);
        }
    }, [searchText]);

    const search = (text: string) => {
        if(text.length > 3 && text.includes('BO-')){

        }
    }
    return (
        <View style={styles.searchContainer}>
            <Icon name="shopping-search" size={20} color="#888" />
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar mi pedido"
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.resultsList}
                    renderItem={({ item }) => (
                        <TouchableOpacity /* onPress={() => onSelectResult(item)} */ style={styles.resultItem}>
                            <Text style={styles.resultText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    resultsList: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        maxHeight: 200,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    resultText: {
        fontSize: 16,
        color: '#007B8A',
    },
});

export default SearchBarPedidos;