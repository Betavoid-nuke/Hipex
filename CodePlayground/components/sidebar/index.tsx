import { FC, MouseEvent } from 'react';
import { toast } from 'react-toastify';
import localforage from 'localforage';

import { useAppContext } from '../../context';

import SidebarSection from './Sidebar';
import { Panel, PanelItem, UserId } from './Panel';
import { Files, FileItem, TopBar, TopBarButton, DeleteButton } from './Files';
import AddLanguageLogo from '../../utils/AddLanguageLogo';
import Image from 'next/image';

const Sidebar: FC = () => {
	const {
		filesData,
		filesList,
		activeFile,
		changeActiveFile,
		addFile,
		removeFile,
	} = useAppContext();

	const isAcceptedFileFormat = (filename: string) =>
		filename.endsWith('html') ||
		filename.endsWith('css') ||
		filename.endsWith('js');

	const addNewFile = () => {
		const filename = window.prompt('Please enter file name');

		if (
			filename !== '' &&
			filename !== null &&
			isAcceptedFileFormat(filename)
		) {
			const isFilePresent = filesList.filter(
				(name) => name === filename,
			).length;
			let extension = filename.toLowerCase().split('.').pop() as string;
			// Because js === javascript in Monaco
			extension = extension === 'js' ? 'javascript' : extension;

			if (isFilePresent) {
				toast.error('File name cannot be same');
				return;
			}

			addFile({
				name: filename,
				language: extension,
				value: '',
			});
		} else if (filename) {
			toast.error('File format not supported! Only .html, .css, .js 😔');
		}
	};

	const deleteFile = (ev: MouseEvent, filename: string) => {
		ev.stopPropagation();
		const doDelete = window.confirm(
			'Are you sure you want to delete this file?',
		);

		if (doDelete) {
			removeFile(filename);
		}
	};

	return (
		<SidebarSection id='sidebar'>
			<Panel>
				<PanelItem title='Explorer' active={true}>
					<Image src="/assets/codepg/file.png" alt="Description" width={250} height={250} style={{padding:'8px'}} />
				</PanelItem>
			</Panel>
			<Files>
				<TopBar>
					Files
					<TopBarButton title='Add new file' onClick={addNewFile}>
						<Image src="/assets/codepg/plusss.png" alt="Description" width={35} height={35} style={{padding:'8px'}} />
					</TopBarButton>
				</TopBar>
				{filesData.map((file) => (
					<FileItem
						active={file.name === activeFile.name}
						key={file.name}
						onClick={() => changeActiveFile(file)}>
						<div>
							<AddLanguageLogo fileName={file.name} />
						</div>
						<DeleteButton
							title='Delete file'
							onClick={(ev) => deleteFile(ev, file.name)}>
							<svg width='14' height='14' viewBox='0 0 24 24' fill='#f5f5f5'>
								<path d='M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z' />
							</svg>
						</DeleteButton>
					</FileItem>
				))}
			</Files>
		</SidebarSection>
	);
};

export default Sidebar;
