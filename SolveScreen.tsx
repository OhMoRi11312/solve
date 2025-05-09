import { useRef, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import PencilKitView, {
  type PencilKitRef,
  type PencilKitTool,
} from 'react-native-pencil-kit';
import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';

const allPens: { label: string; value: PencilKitTool }[] = [
  { label: '펜', value: 'pen' },
  { label: '연필', value: 'pencil' },
  { label: '마커', value: 'marker' },
  { label: '크레용', value: 'crayon' },
  { label: '모노라인', value: 'monoline' },
  { label: '수채화', value: 'watercolor' },
  { label: '붓펜', value: 'fountainPen' },
];

const allErasers: { label: string; value: PencilKitTool }[] = [
  { label: '비트맵 지우개', value: 'eraserBitmap' },
  { label: '벡터 지우개', value: 'eraserVector' },
  { label: '고정폭 지우개', value: 'eraserFixedWidthBitmap' },
];

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

export default function App() {
  const ref = useRef<PencilKitRef>(null);
  const path = `${DocumentDirectoryPath}/drawing.dat`;
  const [imageBase64, setImageBase64] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.toolbarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbar}
        >
          <View style={styles.buttonGroup}>
            <Btn onPress={() => ref.current?.showToolPicker()} text="도구 보이기" />
            <Btn onPress={() => ref.current?.hideToolPicker()} text="도구 숨기기" />
            <Btn onPress={() => ref.current?.clear()} text="모두 지우기" />
            <Btn onPress={() => ref.current?.undo()} text="실행 취소" />
            <Btn onPress={() => ref.current?.redo()} text="다시 실행" />
          </View>

          <View style={styles.buttonGroup}>
            <Btn
              onPress={async () => {
                try {
                  const d = await ref.current?.saveDrawing(path);
                  if (d) console.log(`save success, length: ${d.length}`);
                } catch (e) {
                  console.error('Save failed:', e);
                }
              }}
              text="저장"
            />
            <Btn
              onPress={async () => {
                try {
                  await ref.current?.loadDrawing(path);
                } catch (e) {
                  console.error('Load failed:', e);
                }
              }}
              text="불러오기"
            />
            <Btn
              onPress={async () => {
                try {
                  const d = await ref.current?.getBase64PngData({});
                  if (d) {
                    console.log(`get success, length: ${d.length}`);
                    setImageBase64(d);
                  }
                } catch (e) {
                  console.error('Get PNG failed:', e);
                }
              }}
              text="PNG로 저장"
            />
            <Btn
              onPress={async () => {
                try {
                  const d = await ref.current?.getBase64JpegData();
                  if (d) {
                    console.log(`get success, length: ${d.length}`);
                    setImageBase64(d);
                  }
                } catch (e) {
                  console.error('Get JPEG failed:', e);
                }
              }}
              text="JPEG로 저장"
            />
            <Btn
              onPress={() => ref.current?.loadBase64Data(imageBase64)}
              text="Base64 불러오기"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.toolSelectorBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolButtons}
        >
          <ToolButtons
            tools={allPens}
            variant={1}
            onSelect={(p) =>
              ref.current?.setTool({
                toolType: p,
                width: 3 + Math.random() * 5,
                color: getRandomColor(),
              })
            }
          />
          <ToolButtons
            tools={allErasers}
            variant={2}
            onSelect={(p) =>
              ref.current?.setTool({
                toolType: p,
                width: 3 + Math.random() * 5,
                color: getRandomColor(),
              })
            }
          />
        </ScrollView>
      </View>

      <View style={styles.canvasWrapper}>
        <PencilKitView
          ref={ref}
          style={styles.canvas}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          backgroundColor={'#f0ebc0'}
        />
        {imageBase64 ? (
          <Image
            style={styles.previewImage}
            source={{ uri: imageBase64 }}
          />
        ) : null}
      </View>
    </View>
  );
}

const Btn = ({
               onPress,
               text,
               variant = 0,
             }: {
  onPress: () => void;
  text: string;
  variant?: number;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === 1
          ? styles.penButton
          : variant === 2
            ? styles.eraserButton
            : styles.defaultButton,
      ]}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const ToolButtons = ({
                       tools,
                       variant,
                       onSelect,
                     }: {
  tools: { label: string; value: PencilKitTool }[];
  variant: number;
  onSelect: (tool: PencilKitTool) => void;
}) => (
  <>
    {tools.map(({ label, value }) => (
      <Btn
        key={value}
        variant={variant}
        text={label}
        onPress={() => onSelect(value)}
      />
    ))}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  toolbarContainer: {
    backgroundColor: '#e0d8a0',
    paddingTop: Platform.OS === 'ios' ? 24 : 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 12,
  },
  toolSelectorBar: {
    backgroundColor: '#e0d8a0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  toolButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: '100%',
  },
  canvasWrapper: {
    flex: 1,
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
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  defaultButton: {
    backgroundColor: 'black',
  },
  penButton: {
    backgroundColor: 'skyblue',
  },
  eraserButton: {
    backgroundColor: 'orange',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 14,
  },
});
