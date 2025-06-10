'use client';

import { FC, useRef } from 'react';

import { useAppContext } from '../../context';

import OutputContainer from './Output';
import { Nav, Addressbar, Address } from './Nav';
import Iframe from './Iframe';
import ConvertArrToString from '../../utils/convertArrtoString';

const Output: FC = () => {
	const { filesData, activeFile } = useAppContext();
	const iFrameRef = useRef<HTMLIFrameElement>(null);
	const { allFilesHTMLCombined, allFilesCSSCombined, allFilesJSCombined } =
		ConvertArrToString(filesData);
	const srcDoc = `
  <html>
    <head>
      <style>${allFilesCSSCombined}</style>
    </head>
    <body>
      ${allFilesHTMLCombined}
      <script>
        ${activeFile.language === 'javascript' && allFilesJSCombined}
      </script>
    </body>
  </html>`;

	if (process.env.NODE_ENV === 'production') console.clear();

	return (
		<OutputContainer id='output'>
			<Iframe name='output-iframe' srcDoc={srcDoc} ref={iFrameRef} title='code output' />
		</OutputContainer>
	);
};

export default Output;
