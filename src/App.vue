<template>
  <div id="app">
    <div id="container-iframe-acuant">
      <!-- <iframe id="fad-iframe-acuant" frameborder="0" sandbox="allow-scripts allow-same-origin" allow="camera" /> -->
    </div>
    <div id="container-result">
      <div>
        <p><strong> Identification image: </strong></p>
        <img id="image-id-front" width="300px" alt="">
        <img id="image-id-back" width="300px" alt="">
        <img id="image-id-photo" width="100px" alt="">
        <div>
          <pre id="code-result" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FadSdk from '@fad-producto/fad-sdk';

class ResponseEvent {
  event;
  data;
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

class Result {
  id; // image of identification (image.data) and relevant information (sharpness, glare)
  idData; // ocr idData.ocr;
  idPhoto; // image of the face cutout
  constructor(data) {
    this.id = data.id;
    this.idData = data.idData;
    this.idPhoto = data.idPhoto;
  }
}

export default {
  name: 'App',
  data() {
    return {

      EVENT_MODULE: {
        INIT_MODULE: 'INIT_MODULE',
        PROCESS_INIT: 'PROCESS_INIT',
        PROCESS_ERROR: 'PROCESS_ERROR',
        PROCESS_COMPLETED: 'PROCESS_COMPLETED',
        MODULE_READY: 'MODULE_READY',
      },
      CREDENTIALS: {
        passiveUsername: 'Acuant_Admin_PROD@na-at.com.mx',
        passivePassword: 'R3Z^gm^6C^YNM^vQ',
        passiveSubscriptionId: '3d0a5941-4528-475c-a8ce-15e8f3bca0df',
        acasEndpoint: 'https://us.acas.acuant.net',
        livenessEndpoint: 'https://us.passlive.acuant.net',
        assureidEndpoint: 'https://services.assureid.net',
      },
      CONFIGURATION: {
        views: {
          instructions: true,
          preview: false,
        },
        sharpnessThreshold: window.propNaat.sharpnessThreshold,
        customization: {
          fadCustomization: {
            colors: {
              primary: '#A70635',
              secondary: '#A70635',
              tertiary: '#363636',
            },
            buttons: {
              primary: {
                backgroundColor: '#A70635',
                backgroundColorDisabled: '#dcdcdc',
                labelColor: '#ffffff',
                labelColorDisabled: '#8e8e8e',
                border: '1px solid #A70635',
              },
            },
            fonts: {
              title: {
                fontSize: '25px',
                fontFamily: 'system-ui',
              },
              subtitle: {
                fontSize: '17px',
                fontFamily: 'system-ui',
              },
              content: {
                fontSize: '15px',
                fontFamily: 'system-ui',
              },
              informative: {
                fontSize: '12px',
                fontFamily: 'system-ui',
              },
              button: {
                fontSize: '17px',
                fontFamily: 'system-ui',
              },
            },
          },
          moduleCustomization: {
            legends: {
              initializing: 'iniciando',
              processing: 'procesando',
              scan: {
                none: 'ENFOCA TU ID SOBRE LA GUÍA',
                smallDocument: 'ACERCATE MÁS',
                goodDocument: '',
                capturing: 'CAPTURANDO ',
                tapToCapture: 'TOCA LA PANTALLA PARA CAPTURAR',
              },
              manualCapture: {
                instruction: 'Captura el frente de tu identificación',
                buttonNext: 'Continuar',
              },
            },
            legendsInstructions: {
              title: 'Identificación',
              subtitle: 'Captura tu identifcación',
              buttonNext: 'Continuar',
            },
            legendsPreview: {
              title: 'Identificación',
              subtitle: 'Imagen frontal de tu identificación',
              confirmation: '¿Los datos de tu identificación son legibles?',
              buttonNext: 'Sí, continuar',
              buttonRetry: 'Volver a capturar',
            },
          },
        },
        pathDependencies: {
          // imageDirectory: 'ASSETS_URL'
        },
      },
      ERROR_CODE: {
        REQUIRED_CREDENTIALS: -1,
        FAIL_INITIALIZATION: -2,
        UNSUPPORTED_CAMERA: -3,
        FAIL_INITIALIZATION_CAMERA_UI: -4,
        FAIL_CREATION_INSTANCE_DOCUMENT: -5,
        FAIL_UPLOAD_IMAGE: -6,
        FAIL_GET_OCR: -7,
        FAIL_GET_FACE_IMAGE: -8,
        FACE_IMAGE_URL_NOT_FOUND: -9,
        FACE_IMAGE_NOT_FOUND: -10,
        RESOURCES_COULD_NOT_BE_LOADED: -11,
        UNEXPECTED_ACUANT_ERROR: -12,
        UNSUPPORTED_IMAGE: -13,
        IMAGE_BLURRY: -14,
      },
      side: 0, // front
      idData: false,
      idPhoto: false,
      moduleParams: {},
    };
  },
  mounted() {
    this.initIframe();
    // this.subscribeMs();
  },
  methods: {
    async initIframe() {
      // get iframe
      const options = {
        environment: FadSdk.getFadEnvironments().PROD,
      };
      // const iframe = document.getElementById('fad-iframe-acuant');
      const tkn = 'OGs4ZnZ5REhTSTRzMXEzeWhTVU1mZHNCb3JDOEJZZlFsdHNOWktCL2tLQmpjV0xMem93RGxCMEE1cEc3bVhVTklUalgrUk9vMHhPazk3MDMwZGUxdkZFWjVvNC9ZOTd3eTAwaGpBWTFRNDdFMEdUcDlsUXBISmFxWjNhdTFCVm4=';
      const fadSdk = new FadSdk(tkn, options);
      // const url = `https://apiframe.firmaautografa.com/fad-iframe-acuant?tkn=${tkn}`;
      try {
        const acuantResponse = await FadSdk.startAcuant(this.CREDENTIALS, this.idData, this.idPhoto, this.CONFIGURATION);
        // set src to iframe
        this.showResult(acuantResponse);
      } catch (error) {
        // FadSdk.Errors.Acuant.FACE_IMAGE_NOT_FOUND
        console.log(error, 'error');
      } finally {
        fadSdk.end();
      }
      // iframe.src = url;
    },
    subscribeMs() {
      // subscribe to message event to recive the events from the iframe
      window.addEventListener('message', (message) => {
        // IMPORTANT: check the origin of the data
        if (message.origin.includes('firmaautografa.com')) {
          if (message.data.event === this.EVENT_MODULE.MODULE_READY) {
            // MODULE_READY
            this.initModule();
          }
          if (message.data.event === this.EVENT_MODULE.PROCESS_INIT) {
            // PROCESS_INIT
            // only informative
            // eslint-disable-next-line
            console.log('Process init');
          } else if (message.data.event === this.EVENT_MODULE.PROCESS_ERROR) {
            // PRROCESS_ERROR
            // eslint-disable-next-line
            console.log(message.data.data);
            if (message.data.data.code === this.ERROR_CODE.UNSUPPORTED_CAMERA) {
              // do something
              alert('Cámara no soportada, intenta en otro dispositivo');
            } else if (message.data.data.code === this.ERROR_CODE.FAIL_INITIALIZATIO) {
              // restart component
            } else {
              // restart component
              alert(JSON.stringify(message.data.data));
            }
          } else if (message.data.event === this.EVENT_MODULE.PROCESS_COMPLETED) {
            // PROCESS_COMPLETED
            // eslint-disable-next-line
            console.log('Process completed');
            // use the results as you see fit
            // eslint-disable-next-line
            console.log(message.data.data);
            // show result example
            // save documentInstance, is very important set this parameter in configuration to back image
            // save image front

            const result = new Result(message.data.data);
            if (this.side === 0) {
              // eslint-disable-next-line
              console.log(message.data.data.documentInstance);
              sessionStorage.setItem('documentInstance', message.data.data.documentInstance);
              sessionStorage.setItem('idFront', message.data.data.id.image.data);
              this.initBackIdProcess();
            } else {
              this.showResult(result);
            }
          }
        }
      });
    },
    initModule() {
      const iframe = document.getElementById('fad-iframe-acuant');
      this.moduleParams.credentials = this.CREDENTIALS;
      this.moduleParams.configuration = this.CONFIGURATION;
      this.moduleParams.side = this.side; // 0 - front id, 1 - back id
      this.moduleParams.idData = this.idData; // true - ocr, false - without this data
      this.moduleParams.idPhoto = this.idPhoto; // true - get imaghen face of id, false - without this data
      this.moduleParams.imageQuality = 1; // quality of image id, range 0 - 1
      // eslint-disable-next-line
      console.log(this.moduleParams);

      iframe.contentWindow.postMessage(new ResponseEvent(this.EVENT_MODULE.INIT_MODULE, this.moduleParams), iframe.src);
    },
    initBackIdProcess() {
      // front process
      const iframe = document.getElementById('fad-iframe-acuant');
      this.moduleParams.documentInstance = sessionStorage.getItem('documentInstance');
      this.idData = true;
      this.idPhoto = true;
      this.side = 1; // back
      iframe.src = '';
      setTimeout(() => { this.initIframe(); }, 200);
    },
    showResult(response) {
      const containerResult = document.getElementById('container-result');
      const containerIframe = document.getElementById('container-iframe-acuant');
      const imageIdFront = document.getElementById('image-id-front');
      const imageIdBack = document.getElementById('image-id-back');
      const imageIdPhoto = document.getElementById('image-id-photo');
      const codeResult = document.getElementById('code-result');

      containerIframe.style.display = 'none';
      containerResult.style.display = 'flex';
      imageIdFront.src = sessionStorage.getItem('idFront');
      imageIdBack.src = response.id.image.data;
      imageIdPhoto.src = response.idPhoto;
      codeResult.innerText = JSON.stringify(response.idData, null, 2);
    },
  },
};
</script>

<style lang="scss">
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
}
#container-iframe-acuant, #fad-iframe-acuant {
  width: 100%;
  height: 100vh !important;
}
#container-result {
  display: none;
  flex-direction: column;
  font-family: system-ui;
  margin: 5%;
  max-width: 100%;
  word-break: break-all;
}
</style>
