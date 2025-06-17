import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

function TimeBox({ value, label }: { value: string; label: string }) {
    return (
        <View style={styles.timeBoxContainer}>
            <View style={styles.timeBox}>
                <Text style={styles.timeText}>{value}</Text>
            </View>
            <Text style={styles.boxLabel}>{label}</Text>
        </View>
    );
}

export default function TimerScreen() {
    const [countdown, setCountdown] = useState(0);
    const [countup, setCountup] = useState(0);
    const countdownInterval = useRef<NodeJS.Timer | null>(null);
    const countupInterval = useRef<NodeJS.Timer | null>(null);

    const [inputHour, setInputHour] = useState(0);
    const [inputMinute, setInputMinute] = useState(0);
    const [inputSecond, setInputSecond] = useState(0);

    const format = (sec: number) => {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return [h, m, s];
    };

    const startCountdown = () => {
        if (countdownInterval.current) return;
        countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval.current!);
                    countdownInterval.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopCountdown = () => {
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
        }
    };

    const resetCountdown = () => {
        stopCountdown();
        setCountdown(0);
    };

    const startCountup = () => {
        if (countupInterval.current) return;
        countupInterval.current = setInterval(() => {
            setCountup((prev) => prev + 1);
        }, 1000);
    };

    const stopCountup = () => {
        if (countupInterval.current) {
            clearInterval(countupInterval.current);
            countupInterval.current = null;
        }
    };

    const resetCountup = () => {
        stopCountup();
        setCountup(0);
    };

    const [cuH, cuM, cuS] = format(countup);
    const [cdH, cdM, cdS] = format(countdown);

    const setTimeFromInput = () => {
        setCountdown(inputHour * 3600 + inputMinute * 60 + inputSecond);
    };

    const setTimePreset = (minutes: number) => {
        stopCountdown();
        setCountdown(minutes * 60);
    };

    const getPickerItems = (range: number) => {
        return Array.from({ length: range }, (_, i) => (
            <Picker.Item key={i} label={String(i)} value={i} />
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stopwatch</Text>
            <View style={styles.timeRow}>
                <TimeBox value={cuH} label="Hours" />
                <TimeBox value={cuM} label="Minutes" />
                <TimeBox value={cuS} label="Seconds" />
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.resetButton} onPress={resetCountup}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={startCountup}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stopButton} onPress={stopCountup}>
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { marginTop: 40 }]}>Timer</Text>
            <View style={styles.timeRow}>
                <TimeBox value={cdH} label="Hours" />
                <TimeBox value={cdM} label="Minutes" />
                <TimeBox value={cdS} label="Seconds" />
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.resetButton} onPress={resetCountdown}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stopButton} onPress={stopCountdown}>
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.presetRow}>
                <TouchableOpacity style={styles.presetButton} onPress={() => setTimePreset(80)}>
                    <Text style={styles.buttonText}>국어</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetButton} onPress={() => setTimePreset(100)}>
                    <Text style={styles.buttonText}>수학</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetButton} onPress={() => setTimePreset(70)}>
                    <Text style={styles.buttonText}>영어</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetButton} onPress={() => setTimePreset(30)}>
                    <Text style={styles.buttonText}>탐구</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.pickerRowWrapper}>
                <View style={styles.pickerRow}>
                    <Picker
                        selectedValue={inputHour}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        onValueChange={(itemValue) => setInputHour(itemValue)}>
                        {getPickerItems(24)}
                    </Picker>
                    <Picker
                        selectedValue={inputMinute}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        onValueChange={(itemValue) => setInputMinute(itemValue)}>
                        {getPickerItems(60)}
                    </Picker>
                    <Picker
                        selectedValue={inputSecond}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        onValueChange={(itemValue) => setInputSecond(itemValue)}>
                        {getPickerItems(60)}
                    </Picker>
                </View>
                <TouchableOpacity style={styles.setButton} onPress={setTimeFromInput}>
                    <Text style={styles.setButtonText}>Set</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 32,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeBoxContainer: {
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    timeBox: {
        backgroundColor: '#F6F6F2',
        paddingVertical: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    boxLabel: {
        marginTop: 6,
        fontSize: 14,
        color: '#444',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
        marginTop: 8,
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    startButton: {
        flex: 4.5,
        backgroundColor: '#FFE14D',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    stopButton: {
        flex: 4.5,
        backgroundColor: '#E0E0E0',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    pickerRowWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    pickerRow: {
        flex: 1,
        flexDirection: 'row',
    },
    picker: {
        flex: 1,
        height: 100,
    },
    pickerItem: {
        fontSize: 20,
        height: 100,
    },
    setButton: {
        marginLeft: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFE14D',
        borderRadius: 10,
    },
    setButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    presetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        gap: 0,
    },

    presetButton: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
});
