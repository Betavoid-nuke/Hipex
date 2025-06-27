'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import localforage from 'localforage';
import reducer from './reducer';
import * as types from './types';

// ======= Internal Cache + Trigger =============
let setExternalCustomCodeData: ((data: CustomCodeData) => void) | null = null;

// External interface to set custom code data
interface CustomCodeData {
  CustomCodeDatain: types.fileData[] | undefined;
  filesListin: string[] | undefined;
}

export function SetCustomCodeData({ CustomCodeDatain, filesListin }: CustomCodeData) {
  if (setExternalCustomCodeData) {
    setExternalCustomCodeData({ CustomCodeDatain, filesListin });
  } else {
    console.warn("Context not ready yet to receive custom code data.");
  }
}

// ======= React Context Setup =============
const AppContext = createContext<types.IState | undefined>(undefined);

const Context = ({ children }: { children?: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [customData, _setCustomData] = useState<CustomCodeData | null>(null);

  // Expose setter globally for SetCustomCodeData to call
  useEffect(() => {
    setExternalCustomCodeData = (data: CustomCodeData) => {
      _setCustomData(data); // triggers useEffect below
    };

    return () => {
      setExternalCustomCodeData = null; // cleanup
    };
  }, []);

  const [state, dispatch] = useReducer(reducer, {
    activeFile: { name: '', language: '', value: '' },
    filesList: [],
    filesData: [],
    addFile: () => null,
    removeFile: () => null,
    changeActiveFile: () => null,
    addFileData: () => null,
    addImportedFilesData: () => null,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      const localData = await localforage.getItem('filesData');

      const filesData: types.fileData[] | undefined =
        (localData as types.fileData[]) || customData?.CustomCodeDatain;
      const filesList: string[] | undefined =
        customData?.filesListin || filesData?.map((f) => f.name);

      if (filesData && filesData.length > 0) {
        dispatch({ type: types.ADD_IMPORTED_FILES_DATA, payload: filesData });
        dispatch({ type: types.CHANGE_FILE, payload: filesData[0] });
      }

      setReady(true);
    };

    loadInitialData();
  }, [customData]);

  const addFile = (fileData: types.fileData) =>
    dispatch({ type: types.ADD_FILE, payload: fileData });

  const removeFile = (filename: string) =>
    dispatch({ type: types.REMOVE_FILE, payload: filename });

  const changeActiveFile = (fileData: types.fileData) =>
    dispatch({ type: types.CHANGE_FILE, payload: fileData });

  const addFileData = (fileValue: string) =>
    dispatch({ type: types.ADD_FILE_DATA, payload: fileValue });

  const addImportedFilesData = (filesData: types.fileData[]) =>
    dispatch({ type: types.ADD_IMPORTED_FILES_DATA, payload: filesData });

  if (!ready) return null; // or loading spinner

  return (
    <AppContext.Provider
      value={{
        activeFile: state.activeFile,
        filesList: state.filesList,
        filesData: state.filesData,
        addFile,
        removeFile,
        changeActiveFile,
        addFileData,
        addImportedFilesData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a Context Provider.');
  }
  return context;
};

export { Context, useAppContext };


















































































// 'use client';

// import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
// import localforage from 'localforage';

// import reducer from './reducer';
// import * as types from './types';
// // import { defaultFilesData, defaultFilesList, defaultActiveFile } from './data';

// //initiallt set default values for filesData, filesList, and activeFile
// // This will be replaced by SetCustomCodeData function when called
// let defaultFilesData: types.fileData[] | undefined= [];
// let defaultFilesList: string[] | undefined = [];
// let defaultActiveFile: types.fileData = {
//   name: '',
//   language: '',
//   value: '',
// };



// //function to be call to set custom code data
// // This function will be called from the custom code page to set the initial data
// interface CustomCodeData {
//   CustomCodeDatain: types.fileData[] | undefined;
//   filesListin: string[] | undefined;
// }
// export function SetCustomCodeData({ CustomCodeDatain, filesListin }: CustomCodeData) {

//   defaultFilesData = CustomCodeDatain;
//   defaultFilesList = filesListin;
//   if(defaultFilesData){
//     defaultActiveFile = {
//       name: defaultFilesData[0].name,
//       language: defaultFilesData[0].language,
//       value: defaultFilesData[0].value,
//     };
//   }

//   console.log(defaultFilesData);
//   console.log(defaultFilesList);
//   console.log(defaultActiveFile);
  
// }


// const initialState: types.IState = {
//   activeFile: defaultActiveFile,
//   filesList: defaultFilesList,
//   filesData: defaultFilesData,
//   addFile: () => null,
//   removeFile: () => null,
//   changeActiveFile: () => null,
//   addFileData: () => null,
//   addImportedFilesData: () => null,
// };

// // const AppContext = createContext<types.IState | null>(null); // allow initial null
// const AppContext = createContext<types.IState>(initialState);

// const Context = ({ children }: { children?: React.ReactNode }) => {
  
//   // const [state, dispatch] = useReducer(reducer, initialState);
//   const [ready, setReady] = useState(false);
//   const [state, dispatch] = useReducer(reducer, {
//     activeFile: { name: "", language: "", value: "" }, // placeholders
//     filesList: [],
//     filesData: [],
//     addFile: () => null,
//     removeFile: () => null,
//     changeActiveFile: () => null,
//     addFileData: () => null,
//     addImportedFilesData: () => null,
//   });

//   useEffect(() => {
//     const loadInitialData = async () => {
//       const filesData = await localforage.getItem("filesData");
//       if (filesData) {
//         dispatch({
//           type: types.ADD_IMPORTED_FILES_DATA,
//           payload: filesData as types.fileData[],
//         });

//         dispatch({
//           type: types.CHANGE_FILE,
//           payload: (filesData as types.fileData[])[0], // set first as active
//         });

//         setReady(true);
//       } else {
//         // Use defaults if no saved data
//         if (defaultFilesData) {
//           dispatch({
//             type: types.ADD_IMPORTED_FILES_DATA,
//             payload: defaultFilesData,
//           });

//           dispatch({
//             type: types.CHANGE_FILE,
//             payload: defaultActiveFile,
//           });

//           setReady(true);
//         }
//       }
//     };

//     loadInitialData();
//   }, []); //for waiting for custom code data to be set

//   useEffect(() => {
//     localforage.getItem('filesData').then((filesData: any) => {
//       if (filesData) addImportedFilesData(filesData);
//     });
//   }, []);

//   const addFile = (fileData: types.fileData) =>
//     dispatch({ type: types.ADD_FILE, payload: fileData });

//   const removeFile = (filename: string) =>
//     dispatch({ type: types.REMOVE_FILE, payload: filename });

//   const changeActiveFile = (fileData: types.fileData) =>
//     dispatch({ type: types.CHANGE_FILE, payload: fileData });

//   const addFileData = (fileValue: string) =>
//     dispatch({ type: types.ADD_FILE_DATA, payload: fileValue });

//   const addImportedFilesData = (filesData: types.fileData[]) =>
//     dispatch({ type: types.ADD_IMPORTED_FILES_DATA, payload: filesData });

//   if (!ready) return null; // or loading spinner

//   return (
//     <AppContext.Provider
//       value={{
//         activeFile: state.activeFile,
//         filesList: state.filesList,
//         filesData: state.filesData,
//         addFile,
//         removeFile,
//         changeActiveFile,
//         addFileData,
//         addImportedFilesData,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// const useAppContext = () => {
//   const context = useContext(AppContext);

//   if (!context) {
//     throw new Error("useAppContext must be used within a Context Provider.");
//   }

//   return context;
// };

// export { Context, useAppContext };
