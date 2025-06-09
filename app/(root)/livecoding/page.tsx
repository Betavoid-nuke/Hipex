// 'use client';

// import { useState, useEffect } from 'react';
// import Editor from '@monaco-editor/react';
// // @ts-ignore
// import * as Babel from '@babel/standalone';

// export default function Playground() {
//   const [code, setCode] = useState<string>(defaultCode);
//   const [compiledCode, setCompiledCode] = useState<string>('');

//   useEffect(() => {
//     try {
//       const output = Babel.transform(code, {
//         presets: ['react', 'typescript'],
//       }).code;
//       setCompiledCode(output || '');
//     } catch (err) {
//       console.error(err);
//     }
//   }, [code]);

//   return (
//     <div className="flex h-screen bg-black text-white">
//       {/* Left - Editor */}
//       <div className="w-1/2 h-full border-r border-gray-700">
//         <Editor
//           height="100%"
//           theme="vs-dark"
//           language="typescript"
//           value={code}
//           onChange={(val) => setCode(val || '')}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             fontFamily: 'Fira Code, monospace',
//             automaticLayout: true,
//           }}
//           beforeMount={(monaco) => {
//             monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//               jsx: monaco.languages.typescript.JsxEmit.React,
//               target: monaco.languages.typescript.ScriptTarget.ESNext,
//               allowJs: true,
//               esModuleInterop: true,
//               moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
//               module: monaco.languages.typescript.ModuleKind.ESNext,
//               noEmit: true,
//               typeRoots: ['node_modules/@types'],
//             });
        
//             monaco.languages.typescript.typescriptDefaults.addExtraLib(
//               `declare module 'react';
//                declare module 'react-dom';`,
//               'file:///node_modules/@types/react/index.d.ts'
//             );
//           }}
//         />
//       </div>

//       {/* Right - Preview */}
//       <div className="w-1/2 h-full bg-white">
//         <iframe
//           className="w-full h-full"
//           sandbox="allow-scripts"
//           srcDoc={`
//             <html>
//               <head><style>body{margin:0;padding:20px;font-family:sans-serif;}</style></head>
//               <body>
//                 <div id="root"></div>
//                 <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
//                 <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
//                 <script>
//                   try {
//                     const exports = {};
//                     ${compiledCode}
//                     ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(exports.default));
//                   } catch (e) {
//                     document.body.innerHTML = '<pre style="color:red;padding:20px;">' + e + '</pre>';
//                   }
//                 </script>
//               </body>
//             </html>
//           `}
//         />
//       </div>
//     </div>
//   );
// }

// const defaultCode = `
// // React component in TSX
// import * as React from 'react';

// export default function App() {
//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Hello World 🌍</h1>
//       <p>You can edit the code here and see live results ➡️</p>
//       <button onClick={() => alert('Clicked!')}>Click Me</button>
//     </div>
//   );
// }
// `;






'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
// @ts-ignore
import * as Babel from '@babel/standalone';

export default function LiveCodingPage() {
  const [code, setCode] = useState(defaultCode);
  const [compiledCode, setCompiledCode] = useState('');

  useEffect(() => {
    try {
      const wrappedCode = `
        ${code}
        window.App = typeof App !== 'undefined' ? App : undefined;
      `;

      const output = Babel.transform(wrappedCode, {
        filename: 'file.tsx',
        presets: [
          ['typescript', { allExtensions: true, isTSX: true }],
          ['react', { runtime: 'automatic' }]
        ],
      }).code;

      setCompiledCode(output || '');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Compilation failed';
      setCompiledCode(`
        document.getElementById('root').innerHTML = '<div style="color:red;padding:20px;">${JSON.stringify(errorMessage).replace(/"/g, '')}</div>';
      `);
    }
  }, [code]);

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      {/* Editor Side */}
      <div className="w-1/2 h-full border-r border-gray-700">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          language="typescript"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'Cascadia Code', 'Fira Code', monospace",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            folding: true,
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            tabSize: 2,
          }}
          beforeMount={(monaco) => {
            // Define custom theme
            monaco.editor.defineTheme('vs-dark-custom', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'jsxTag', foreground: '#569CD6' },
                { token: 'jsxAttribute', foreground: '#9CDCFE' },
                { token: 'string.jsx', foreground: '#CE9178' },
                { token: 'keyword', foreground: '#569CD6' },
                { token: 'type', foreground: '#4EC9B0' },
                { token: 'identifier', foreground: '#9CDCFE' },
                { token: 'delimiter.jsx', foreground: '#808080' },
              ],
              colors: {
                'editor.foreground': '#D4D4D4',
                'editor.background': '#1E1E1E',
              }
            });

            // Configure TypeScript options
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              target: monaco.languages.typescript.ScriptTarget.Latest,
              module: monaco.languages.typescript.ModuleKind.ESNext,
              jsx: monaco.languages.typescript.JsxEmit.React,
              reactNamespace: 'React',
              allowJs: true,
              typeRoots: ['node_modules/@types'],
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              allowSyntheticDefaultImports: true,
              esModuleInterop: true,
            });

            // Add React type definitions
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              `import React from 'react';\n` +
              `declare global {\n` +
              `  namespace JSX {\n` +
              `    interface IntrinsicElements {\n` +
              `      [elemName: string]: any;\n` +
              `    }\n` +
              `  }\n` +
              `}`,
              'file:///node_modules/@types/react/index.d.ts'
            );

            // Set the custom theme
            monaco.editor.setTheme('vs-dark-custom');
          }}
        />
      </div>

      {/* Preview Side */}
      <div className="w-1/2 h-full bg-[#1e1e1e]">
        <iframe
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; background-color: #1e1e1e; }
                  #root { padding: 20px; height: 100vh; }
                </style>
              </head>
              <body>
                <div id="root"></div>
                <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script>
                  try {
                    ${compiledCode}
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    if (typeof App !== 'undefined') {
                      root.render(React.createElement(App));
                    } else {
                      document.getElementById('root').innerHTML = 
                        '<div style="color:red;padding:20px;">Error: No App component found</div>';
                    }
                  } catch (e) {
                    document.getElementById('root').innerHTML = 
                      '<div style="color:red;padding:20px;">' + e.message + '</div>';
                  }
                </script>
              </body>
            </html>
          `}
        />
      </div>
    </div>
  );
}

const defaultCode = `import React from 'react';

interface Props {
  name?: string;
}

const App: React.FC<Props> = ({ name = 'World' }) => {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#252526',
      color: '#d4d4d4'
    }}>
      <h1 style={{ color: '#569cd6' }}>Hello {name} 🌍</h1>
      <p>This is live rendered output with syntax highlighting.</p>
      <button 
        onClick={() => alert('Hello ' + name)}
        style={{
          padding: '8px 16px',
          background: '#0e639c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </div>
  );
};

export default App;
`;