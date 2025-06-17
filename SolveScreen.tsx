import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';
import { useRef, useState, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import PencilKitView, { type PencilKitRef, type PencilKitTool, } from 'react-native-pencil-kit';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmDialog from '../components/ConfirmDialog';
import OMR from '../components/OMR';
import SlideOver from '../components/SlideOverPanel';
import TimerMini from '../components/TimerMini';

const allPens: { label: string; value: string; icon: string; }[] = [
  { label: '펜', value: 'pen', icon: 'pen' },
  { label: '연필', value: 'pencil', icon: 'pencil-outline' },
  { label: '마커', value: 'marker', icon: 'format-color-highlight' },
  { label: '크레용', value: 'crayon', icon: 'border-color' },
  { label: '모노라인', value: 'monoline', icon: 'vector-line' },
  { label: '수채화', value: 'watercolor', icon: 'brush' },
  { label: '붓펜', value: 'fountainPen', icon: 'fountain-pen-tip' },
  { label: '비트맵 지우개', value: 'eraserBitmap', icon: 'eraser' },
  { label: '벡터 지우개', value: 'eraserVector', icon: 'eraser-variant' },
];



export default function App() {
  const ref = useRef<PencilKitRef>(null);
  const path = `${DocumentDirectoryPath}/drawing.dat`;
  const [imageBase64, setImageBase64] = useState('');
  const [toolColors, setToolColors] = useState<Record<PencilKitTool, string>>({});
  const [currentTool, setCurrentTool] = useState<PencilKitTool | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string[] }>({});
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'front' | 'slide'>('front')
  const [showConfirm, setShowConfirm] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [functionToDo, setFunctionToDo] = useState<() => void>(() => () => { });
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const raw = `
      1 ②
      6 ③
      2 ④
      7 ②
      3 ④
      8 ⑤
      4 ②
      9 ①
      5 ③
      10 ⑤
      11 ④
      16 ①
      21 ①
      26 ①
      31 ①
      12 ⑤
      17 ⑤
      22 ①
      27 ④
      32 ①
      13 ③
      18 ④
      23 ③
      28 ①
      33 ⑤
      14 ②
      19 ②
      24 ④
      29 ①
      34 ②
      15 ①
      20 ⑤
      25 ⑤
      30 ④
    `;
    const choiceMap: Record<string, string> = {
      '①': '1',
      '②': '2',
      '③': '3',
      '④': '4',
      '⑤': '5',
    };

    const parsed: { [key: number]: string } = {};
    const regex = /(\d+)\s([①-⑤])/g;
    let match;

    while ((match = regex.exec(raw)) !== null) {
      const number = parseInt(match[1], 10);
      const answer = choiceMap[match[2]]; // 숫자로 변환
      parsed[number] = answer;
    }


    console.log(parsed)
    setAnswers(parsed);
  }, []);
  function showDialog(message: string, action: () => void) {
    setDialogMessage(message);
    setFunctionToDo(() => action); // 콜백 저장
    setShowConfirm(true);
  }

  function handleGrading() {
    const answerKey = answers;
    let correct = 0;

    Object.entries(answerKey).forEach(([qIndex, correctAnswer]) => {
      const selected = selectedAnswers[+qIndex - 1] || [];
      console.log(`문항 ${qIndex}: 정답=${correctAnswer}, 선택=${selected}`);

      if (
          selected.length === 1 &&
          selected[0] === correctAnswer
      ) {
        correct += 1;
      }
    });

    alert(`정답 수: ${correct}개`);
  }

  return (
      <View style={styles.pageMain} >
        <View style={styles.toolbarSection}>
          <View style={styles.tbGroup1}>
            <View style={styles.tbGrooup1Child}>
              <Btn onPress={() => ref.current?.showToolPicker()} text="도구 보이기" />
              <Btn onPress={() => ref.current?.hideToolPicker()} text="도구 숨기기" />
              <Btn onPress={() => ref.current?.clear()} text="모두 지우기" />
              <Btn onPress={() => ref.current?.undo()} text="실행 취소" />
              <Btn onPress={() => ref.current?.redo()} text="다시 실행" />
            </View>
            <View style={styles.tbGrooup1Child}>
              <TimerMini />
            </View>
          </View>
          <View style={styles.tbGroup2} >
            <View style={styles.functionToolGroup}>

            </View>
            <View style={styles.drawingToolGroup}>
              <ToolButtons
                  tools={allPens}
                  onSelect={(tool) => {
                    ref.current?.setTool({ toolType: tool, width: 4, color: 'black' });
                    setCurrentTool(tool);
                  }}
              />
            </View>
            <View style={styles.eraserToolGroup}>
              <Btn
                  text={isDrawerOpen ? 'OMR 닫기' : 'OMR 열기'}
                  onPress={() => setDrawerOpen(!isDrawerOpen)}
                  variant={2}
              />
            </View>
          </View>
          {/* </ScrollView> */}
        </View>
        <SlideOver
            drawerType={drawerType}
            backTouchable={false}
            open={isDrawerOpen}
            setOpen={setDrawerOpen}
            drawerStyle={styles.slideoverPanel}
            drawerPosition={'right'}
            innerComponent={
              <View style={{ width: '100%', height: '100%', borderTopRightRadius: 25, borderBottomRightRadius: 25, }}>
                <TouchableOpacity
                    onPress={() => {
                      setDrawerType(prev => prev === 'front' ? 'slide' : 'front')
                    }}
                    style={{ width: 24, height: 24, flexDirection: 'row', alignSelf: 'flex-end', marginRight: 10, }}
                >
                  <MaterialCommunityIcons name={drawerType === 'slide' ? 'view-column' : 'dock-right'} size={24} color="#007AFF" />
                </TouchableOpacity>

                <ScrollView>
                  <OMR
                      numQuestions={Object.keys(answers).length}
                      optionsPerQuestion={['1', '2', '3', '4', '5']}
                      selectedAnswers={selectedAnswers}
                      setSelectedAnswers={setSelectedAnswers}
                  />
                </ScrollView>
                <TouchableOpacity
                    onPress={() => showDialog("OMR을 교체합니다.", () => { setSelectedAnswers([]) })}
                    style={{ padding: 5, width: 225 }}
                >
                  <Text style={{ color: '#007AFF', textAlign: 'center', marginTop: 25, }}>OMR 교체</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => showDialog("채점을 진행 합니다.", handleGrading)}
                    style={{ padding: 5, width: 225 }}
                >
                  <Text style={{ color: '#007AFF', textAlign: 'center', marginBottom: 25, }}>제출 및 채점</Text>
                </TouchableOpacity>
              </View>
            }
            mainContent={
              < View style={styles.canvasWrapper} >
                <PencilKitView
                    ref={ref}
                    style={styles.canvas}
                    alwaysBounceVertical={false}
                    alwaysBounceHorizontal={false}
                    backgroundColor={'#f0ebc0'}
                />
                {
                  imageBase64 ? (
                      <Image
                          style={styles.previewImage}
                          source={{ uri: imageBase64 }}
                      />
                  ) : null}
              </View>
            }
        />
        <ConfirmDialog
            visible={showConfirm}
            message={dialogMessage}
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              functionToDo(); // 선택된 작업 실행
            }}
        />
      </View >
  )
}

const Btn = ({
               onPress,
               text,
               variant = 1,
               icon = 'face-man',
             }: {
  onPress: () => void;
  text: string;
  variant?: number;
  icon?: any;
}) => {
  let output;
  if (icon === '' || !icon) {
    variant = 1
  }
  switch (variant) {
    case 0:   // 아이콘으로 표사
      output = (
          <TouchableOpacity onPress={onPress} style={[styles.button]} >
            <MaterialCommunityIcons name={icon} size={22} color="black" />
          </TouchableOpacity >
      )
      break;
    case 1:   // 텍스트로 표시
      output = (
          <TouchableOpacity onPress={onPress} style={[styles.button]} >
            <Text> {text} </Text>
          </TouchableOpacity>
      )
      break;
    default:
      output = (
          <TouchableOpacity onPress={onPress} style={[styles.defaultButton, { borderColor: '#000000', borderStyle: 'solid', borderWidth: 1, borderRadius: 12, }]} >
            <Text style={[styles.defaultButton]}> {text} </Text>
          </TouchableOpacity>
      )
  }
  return output;
};

const ToolButtons = ({
                       tools,
                       onSelect,
                     }: {
  tools: { label: string; value: string; icon: string; }[];
  onSelect: (tool: string) => void;
}) => (
    <>
      {tools.map(({ label, value, icon }) => (
          <Btn key={value} variant={0} text={label} icon={icon} onPress={() => onSelect(value)} />
      ))}
    </>
);


// Styles
const styles = StyleSheet.create({
  pageMain: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  toolbarSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#FFE560',
    paddingTop: Platform.OS === 'ios' ? 24 : 0,
  },
  tbGroup1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
    height: 29,
  },
  tbGroup2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: '#FFF1A8',
  },
  tbGrooup1Child: {
    flexDirection: 'row',
  },

  functionToolGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  drawingToolGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    flex: 1
  },
  eraserToolGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },

  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  defaultButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 3,
    color: '#ffffff',
  },


  canvasWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  canvas: {
    flex: 1,
  },
  previewImage: {
    borderWidth: 1,
    borderColor: '#2224',
    borderRadius: 12,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    width: 160,
    height: 160,
  },

  slideoverPanel: {
    flexDirection: 'column',
    width: 250,
    borderLeftWidth: 1,
    borderTopLeftRadius: 25, borderBottomLeftRadius: 25,
  },
});
