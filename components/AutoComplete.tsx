import { autocomplete } from '@/api/AddresApi';
import { useToken } from '@/context/TokenContext';
import { SellData } from '@/interface/Sell';
import { StopData } from '@/interface/Stop';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
interface AutoCompleteProps {
    handleSelect: (placeId: string, address: string) => Promise<void>;
    data: StopData | SellData | undefined;
    setData: React.Dispatch<React.SetStateAction<StopData | SellData | undefined>>;
    blockAutocomplete: boolean;
    setBlockAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    suggestions: Suggestion[];
    placeHolder: string;
    isEdit: boolean;
}
type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};
const AutoComplete: React.FC<AutoCompleteProps> = ({ handleSelect, data, setData, blockAutocomplete, setBlockAutocomplete, setSuggestions, suggestions, placeHolder, isEdit }) => {
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const { token } = useToken();
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (blockAutocomplete) {
                setBlockAutocomplete(false);
                return;
            }
            if (!isEditingAddress || !data?.addres || data.addres.length < 3) {
                setSuggestions([]);
                return; // evita llamadas innecesaria
            }

            try {
                if (data?.addres) {
                    const { data: dt } = await autocomplete(data.addres, token);
                    const suggestions = dt.data.suggestions;
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
    }, [data?.addres, isEditingAddress]);

    return (
        <View style={[styles.fieldContainer]}>
            <View >
                <TextInput style={styles.input} value={data?.addres}
                    onChangeText={(text) => {
                        setIsEditingAddress(true);
                        setData({ ...data, addres: text })
                    }}
                    placeholder={placeHolder}
                    placeholderTextColor="#7f8c8d"
                    editable={isEdit}
                    autoCapitalize='none' // Evita que se capitalicen las letras
                    autoCorrect={false} // Desactiva la autocorrección
                />
            </View>
            {suggestions.map((s) => (
                <TouchableOpacity
                    key={s.placePrediction.placeId}
                    onPress={() => handleSelect(s.placePrediction.placeId, s.placePrediction.text.text)}
                    style={styles.sugerenciaItem}
                >
                    <Text>{s.placePrediction.text.text}</Text>
                </TouchableOpacity>
            ))}
        </View>)
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
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
    /* input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#2c3e50'
    }, */
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