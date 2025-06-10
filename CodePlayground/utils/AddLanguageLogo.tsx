import { FC } from 'react';

import HTMLLogo from '../../public/assets/codepg/html.png';
import CSSLogo from '../../public/assets/codepg/css.png';
import JavaScriptLogo from '../../public/assets/codepg/js.png';
import Image from 'next/image';

interface Props {
  fileName: string;
}

const AddLanguageLogo: FC<Props> = ({ fileName }) => {
  const languageLogoSwitch = (fileName: string) => {
    const fileType = fileName.toLowerCase().split('.').pop();

    switch (fileType) {
      case 'html':
      case 'htm':
        return HTMLLogo;
      case 'css':
        return CSSLogo;
      case 'js':
        return JavaScriptLogo;
      default:
        return fileName;
    }
  };

  return (
    <>
      {/* <img height={16} width={16} src={languageLogoSwitch(fileName)} alt="Language" /> */}
      <Image src={languageLogoSwitch(fileName)} alt="Description" width={30} height={30} style={{padding:'6px'}} />
      <span style={{ marginLeft: 5 }}>{fileName}</span>
    </>
  );
};

export default AddLanguageLogo;
