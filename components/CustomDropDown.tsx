import { IRate } from '@/interface/Rate';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Option {
    label: string | null;
    value: number | undefined;
}

interface Props {
    rates: IRate[];
    selectedValue: number | undefined;
    onSelect: (value: number) => void;
    placeholder?: string;
}

const CustomDropDown = ({
    rates,
    selectedValue,
    onSelect,
    placeholder = 'Selecciona una opción...',
}: Props) => {
    const [visible, setVisible] = useState(false);
    const options:Option[] = rates.map(rate => {
        return {
            label:`${rate.nameService}......${rate.price}`,
            value: rate.id
        }
    })
    const selectedLabel =
        options.find((opt) => opt.value === selectedValue)?.label || placeholder;

    return (
        <View>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setVisible(true)}
            >
                <Text style={selectedValue ? styles.selectedText : styles.placeholderText}>
                    {selectedLabel}
                </Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => (item.value !== undefined && item.value !== null ? item.value.toString() : String(item.value))}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => {
                                        if (item.value !== undefined && item.value !== null) {
                                            onSelect(item.value);
                                        }
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{`${item.label}`}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdownButton: {
        borderColor: '#ccc',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    selectedText: {
        color: '#2c3e50',
        fontSize: 16,
    },
    placeholderText: {
        color: '#7f8c8d',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        maxHeight: 300,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#34495e',
    },
});
export default CustomDropDown