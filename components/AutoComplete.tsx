import { autocomplete } from '@/api/AddresApi';
import { StopData } from '@/interface/Stop';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AutoCompleteProps {
    handleSelect: (placeId: string, address: string) => Promise<void>;
    stop: StopData | undefined;
    setStop: React.Dispatch<React.SetStateAction<StopData | undefined>>;
    blockAutocomplete: boolean;
    setBlockAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    suggestions: Suggestion[];
}
type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};
const AutoComplete: React.FC<AutoCompleteProps> = ({handleSelect, stop, setStop, blockAutocomplete, setBlockAutocomplete, setSuggestions, suggestions}) => {

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (blockAutocomplete) {
                setBlockAutocomplete(false);
                return;
            }
            if (stop?.addres && stop.addres.length < 3) return; // evita llamadas innecesarias

            try {
                if (stop?.addres) {
                    const { data } = await autocomplete(stop.addres);
                    const suggestions = data.data.suggestions;
                    if (!suggestions) {
                        setSuggestions([]);
                    } else {
                        setSuggestions(suggestions);
                    }
                }
            } catch (error) {
                console.error('Error al obtener sugerencias:', error);
            }
        };
        fetchSuggestions();
    }, [stop?.addres]);

    return (
        <View style={styles.fieldContainer}>
            <TextInput style={styles.input} value={stop?.addres}
                onChangeText={(text) => setStop({ ...stop, addres: text })}
                placeholder='Direccion...' />
            {suggestions.map((s) => (
                <TouchableOpacity
                    key={s.placePrediction.placeId}
                    onPress={() => handleSelect(s.placePrediction.placeId, s.placePrediction.text.text)}
                    style={styles.sugerenciaItem}
                >
                    <Text>{s.placePrediction.text.text}</Text>
                </TouchableOpacity>
            ))}
        </View>    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#D6EAF8',
        justifyContent: 'center',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#34495E',
        marginBottom: 6,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
    tagButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    tagText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    uploadButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    downloadButton: {
        backgroundColor: '#7c8cc2ff',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center',
    },
    uploadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sugerenciaItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    }
});

export default AutoComplete