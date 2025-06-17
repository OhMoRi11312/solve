import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function ScoreAnalysisScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>성적분석</Text>
            <Image
                source={require('../assets/grade_chart.png')} // 경로 확인 필수
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 928 / 564, // 이미지 원본 비율 유지
    },
});
