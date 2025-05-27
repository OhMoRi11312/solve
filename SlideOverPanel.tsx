import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

type SlideOverProps = {
  visible: boolean;
  onClose: () => void;
  innerComponent: React.ReactNode;
};

export default function SlideOver({ visible, onClose, innerComponent }: SlideOverProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
 
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>
          {innerComponent}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0005',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: 'blue',
  },
});
