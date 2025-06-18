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
import PdfViewerScreen from '../components/PdfViewerScreen';
import DocumentPicker from 'react-native-document-picker';
import BlobUtil from 'react-native-blob-util';

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
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string[] | string }>({});
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'front' | 'slide'>('front')
  const [showConfirm, setShowConfirm] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [functionToDo, setFunctionToDo] = useState<() => void>(() => () => { });
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [base64Pdf, setBase64Pdf] = useState<string | null>(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [questions, setQuestions] = useState<{ [key: number]: { answer: string; type: string } }>({});


  useEffect(() => {
    const raw = `
      1 ②
      2 ①
      3 ③
      4 ③
      5 ②
      6 ④
      7 ⑤
      8 ⑤
      9 ②
      10 ①
      11 ⑤
      12 ②
      13 ④
      14 ②
      15 ①
      16 2
      17 6
      18 133
      19 8
      20 85
      21 42
      22 38
    `;
    const choiceMap = {
      '①': '1',
      '②': '2',
      '③': '3',
      '④': '4',
      '⑤': '5',
    };

    const parsed: { [key: number]: { answer: string, type: '' | 'selone' | 'short' } } = {};
    const lines = raw.trim().split('\n');   // 행 별로 정답 추출

    lines.forEach(line => {
      const [number, string] = line.trim().split(/\s+/);
      const qNum = parseInt(number, 10);
      parsed[qNum] = { answer: '', type: '' };

      // 객관식 심볼인지 체크
      if (string && string.length === 1 && Object.keys(choiceMap).includes(string)) {
        parsed[qNum].answer = choiceMap[string];
        parsed[qNum].type = 'selone';
      } else {
        parsed[qNum].answer = string;
        parsed[qNum].type = 'short'
      }
    });
    console.log(parsed)
    setQuestions(parsed);
  }, []);
  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      let uri = decodeURIComponent(res.fileCopyUri || res.uri);
      if (uri.startsWith('file://')) {
        uri = uri.replace('file://', '');
      }

      const exists = await BlobUtil.fs.exists(uri);
      if (!exists) throw new Error('파일이 존재하지 않음');

      const base64 = await BlobUtil.fs.readFile(uri, 'base64');
      setBase64Pdf(base64);
    } catch (err) {
      console.error('PDF 선택 실패', err);
    }
  };

  function showDialog(message: string, action: () => void) {
    setDialogMessage(message);
    setFunctionToDo(() => action); // 콜백 저장
    setShowConfirm(true);
  }

  function handleGrading() {
    let correctCount = 0;
    let questionsLength = Object.keys(questions).length;
    let graded_count = 0;

    for (const [qNumStr, selected] of Object.entries(selectedAnswers)) {
      const qNum = parseInt(qNumStr, 10);
      const correctAnswer = questions[qNum]?.answer;
      const questionType = questions[qNum]?.type;

      if (questionType === 'selone') {
        if (Array.isArray(selected) && selected.length === 1) {
          graded_count++;
          if (selected[0] === correctAnswer) {
            correctCount++;
          }
        }
      }
      else if (questionType === 'short') {
        if (typeof selected === 'string' && selected.trim() !== '') {
          graded_count++;
          if (parseInt(selected) === parseInt(correctAnswer)) {
            correctCount++;
          }
        }
      }
    }

    const wrongCount = graded_count - correctCount;
    const ungradedCount = questionsLength - graded_count;

    alert(`총 문항 수: ${questionsLength}\n정답: ${correctCount}개\n오답: ${wrongCount}개\n무표기: ${ungradedCount}개`);
  }

  return (
    <View style={styles.pageMain}>
      <View style={styles.toolbarSection}>
        <View style={styles.tbGroup1}>
          <View style={styles.tbGrooup1Child}>
            <Btn
              onPress={() => ref.current?.showToolPicker()}
              text="도구 보이기"
            />
            <Btn
              onPress={() => ref.current?.hideToolPicker()}
              text="도구 숨기기"
            />
            <Btn onPress={() => ref.current?.clear()} text="모두 지우기" />
            <Btn onPress={() => ref.current?.undo()} text="실행 취소" />
            <Btn onPress={() => ref.current?.redo()} text="다시 실행" />
          </View>
          <View style={styles.tbGrooup1Child}>
            <TimerMini />
          </View>
        </View>
        <View style={styles.tbGroup2}>
          <View style={styles.functionToolGroup}></View>
          <View style={styles.drawingToolGroup}>
            <ToolButtons
              tools={allPens}
              onSelect={tool => {
                ref.current?.setTool({
                  toolType: tool,
                  width: 4,
                  color: 'black',
                });
                setCurrentTool(tool);
              }}
            />
          </View>
          <View style={styles.eraserToolGroup}>
            <Btn text="PDF 열기" onPress={pickPdf} variant={2} />
            <Btn
              text={isDrawerOpen ? 'OMR 닫기' : 'OMR 열기'}
              on={isDrawerOpen}
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
          <View
            style={{
              width: '100%',
              height: '100%',
              borderTopRightRadius: 25,
              borderBottomRightRadius: 25,
            }}>
            <TouchableOpacity
              onPress={() => {
                setDrawerType(prev => (prev === 'front' ? 'slide' : 'front'));
              }}
              style={{
                width: 24,
                height: 24,
                flexDirection: 'row',
                alignSelf: 'flex-end',
                marginRight: 10,
              }}>
              <MaterialCommunityIcons
                name={drawerType === 'slide' ? 'view-column' : 'dock-right'}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>

            <ScrollView>
              <OMR
                questions={questions}
                selectedAnswers={selectedAnswers}
                setSelectedAnswers={setSelectedAnswers}
              />
            </ScrollView>
            <TouchableOpacity
              onPress={() =>
                showDialog('OMR을 교체합니다.', () => {
                  setSelectedAnswers([]);
                })
              }
              style={{padding: 5, width: 225}}>
              <Text
                style={{color: '#007AFF', textAlign: 'center', marginTop: 25}}>
                OMR 교체
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => showDialog('채점을 진행 합니다.', handleGrading)}
              style={{padding: 5, width: 225}}>
              <Text
                style={{
                  color: '#007AFF',
                  textAlign: 'center',
                  marginBottom: 25,
                }}>
                제출 및 채점
              </Text>
            </TouchableOpacity>
          </View>
        }
        mainContent={
          <View style={{flex: 1}}>
            {/* 겹쳐지는 구조 */}
            <View style={{flex: 1}}>
              <PdfViewerScreen
                base64Pdf={base64Pdf}
                webViewReady={webViewReady}
                setWebViewReady={setWebViewReady}
              />
            </View>

            {/*<PencilKitView*/}
            {/*  ref={ref}*/}
            {/*  style={{*/}
            {/*    position: 'absolute',*/}
            {/*    top: 0,*/}
            {/*    left: 0,*/}
            {/*    right: 0,*/}
            {/*    bottom: 0,*/}
            {/*    backgroundColor: 'transparent',*/}
            {/*  }}*/}
            {/*  backgroundColor="transparent"*/}
            {/*  isOpaque={false}*/}
            {/*/>*/}
            <PencilKitView
                ref={ref}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0)',
                }}
                backgroundColor="transparent"
                isOpaque={false}
            />
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
    </View>
  );
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
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ButtonOFF: {
    backgroundColor: 'transparent',
    color: '#000000',
    borderColor: '#000000',
  },
  ButtonON: {
    backgroundColor: '#000000',
    color: '#ffffff',
    borderColor: '#000000',
  },


  canvasWrapper: {
    flex: 1,
    position: 'relative', // 자식들 position:absolute 쓸 수 있도록
  },
  canvas: {
    flex: 1,
  },
  previewImage: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android 그림자
  },

  slideoverPanel: {
    flexDirection: 'column',
    width: 250,
    borderLeftWidth: 1,
    borderTopLeftRadius: 25, borderBottomLeftRadius: 25,
  },
});
