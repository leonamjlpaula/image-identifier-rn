import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Parameter = ({ label, value, onChangeText }) => {

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{`${label}:`}</Text>
            <TextInput value={value} onChangeText={onChangeText} keyboardType="numeric"
                style={styles.input} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginRight: 12,
        fontWeight: "bold",
    },
    input: {
        flex: 1,
    }
});

export default Parameter;
