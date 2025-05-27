import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type OmrProps = {
  numQuestions: number
  optionsPerQuestion?: string[]
  selectedAnswers: { [key: number]: string[] }
  setSelectedAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: string[] }>>
}

const OMR: React.FC<OmrProps> = ({
                                   numQuestions,
                                   optionsPerQuestion = ['1', '2', '3', '4', '5'],
                                   selectedAnswers,
                                   setSelectedAnswers,
                                 }) => {
  function onSelectAnswer(qIndex: number, option: string) {
    setSelectedAnswers(prev => {
      const currentSelections = prev[qIndex] || []
      const isAlreadySelected = currentSelections.includes(option)

      const updatedSelections = isAlreadySelected
        ? currentSelections.filter(o => o !== option) // 해제
        : [...currentSelections, option] // 선택

      return {
        ...prev,
        [qIndex]: updatedSelections,
      }
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.parent}>
      {Array.from({ length: numQuestions }).map((_, qIndex) => (
        <View key={qIndex} style={styles.questionRow}>
          <Text style={styles.questionLabel}>{qIndex + 1}</Text>
          <View style={styles.selectionsBox}>
            {optionsPerQuestion.map((opt) => {
              const isSelected = selectedAnswers[qIndex]?.includes(opt)
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionBox, isSelected && styles.optionBoxSelected]}
                  onPress={() => onSelectAnswer(qIndex, opt)}
                >
                  <Text style={styles.optionText}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    padding: 10,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  questionLabel: {
    width: 30,
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectionsBox: {
    flexDirection: 'row',
    gap: 6,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    width: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBoxSelected: {
    backgroundColor: '#333',
  },
  optionText: {
    color: '#000',
    fontSize: 14,
  },
})

export default OMR
