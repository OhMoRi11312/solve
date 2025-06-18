import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import BlobUtil from 'react-native-blob-util';
import { WebView } from 'react-native-webview';


// ✅ PDF.js HTML 정의
const webViewHtml = `
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
        overflow: auto;
        background-color: #f0f0f0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .page-container {
        margin-bottom: 15px;
        background: white;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
      }
      canvas {
        display: block;
      }
    </style>
  </head>
  <body>
    <div id="pdfViewerContainer"></div>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      async function renderPdf(base64Data) {
        console.log("📄 PDF 렌더링 시작");
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const container = document.getElementById('pdfViewerContainer');
        container.innerHTML = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          container.appendChild(canvas);
          await page.render({ canvasContext: context, viewport }).promise;
        }

        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'renderSuccess' }));
      }

      // ✅ Android 전용
      document.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (data.type === 'loadPdf') {
          renderPdf(data.base64Pdf);
        }
      });

      // ✅ iOS 전용
      window.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (data.type === 'loadPdf') {
          renderPdf(data.base64Pdf);
        }
      });

      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'webviewReady' }));
    </script>
  </body>
  </html>
`;

const PdfViewerScreen = ({
                           base64Pdf,
                           webViewReady,
                           setWebViewReady
                         }: {
  base64Pdf: string | null;
  webViewReady: boolean;
  setWebViewReady: (v: boolean) => void;
}) => {
  const webViewRef = useRef<WebView>(null);

  const onWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'webviewReady') {
        setWebViewReady(true);
      } else if (data.type === 'renderSuccess') {
        console.log('PDF 렌더링 완료');
      }
    } catch (e) {
      console.warn('웹뷰 메시지 파싱 실패', e);
    }
  };

  useEffect(() => {
    if (webViewReady && base64Pdf && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'loadPdf', base64Pdf }));
    }
  }, [webViewReady, base64Pdf]);

  return (
      <View style={styles.pdfContainer}>
        <WebView
            ref={webViewRef}
            source={{ html: webViewHtml }}
            onMessage={onWebViewMessage}
            javaScriptEnabled
            originWhitelist={['*']}
            domStorageEnabled
            style={styles.webview}
        />
      </View>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'transparent', // 흰색 말고 투명
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // 투명으로 두는 게 좋음
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  indicator: {
    marginTop: 16,
  },
});
