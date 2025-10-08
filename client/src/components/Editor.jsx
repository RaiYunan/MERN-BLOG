/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoNgNARATAdA7PCkCMcAsURwBw4Mx5zIh4CsIADCNmnsntgJxpoguNRMilqOmlQkEAKYA7JBTDBkYGXNmyAupEZ4AZiACGeEBEVA
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	Autosave,
	Essentials,
	Paragraph,
	Autoformat,
	ImageInsertViaUrl,
	ImageBlock,
	ImageToolbar,
	AutoImage,
	BlockQuote,
	Bold,
	CloudServices,
	Link,
	ImageUpload,
	Heading,
	ImageCaption,
	ImageInline,
	ImageStyle,
	ImageTextAlternative,
	Indent,
	IndentBlock,
	Italic,
	LinkImage,
	List,
	MediaEmbed,
	Table,
	TableToolbar,
	TableCaption,
	TextTransformation,
	TodoList,
	Underline,
	Emoji,
	Mention,
	Fullscreen,
	BalloonToolbar,
	BlockToolbar
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';


/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

export default function Editor(props) {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
						'undo',
						'redo',
						'|',
						'fullscreen',
						'|',
						'heading',
						'|',
						'bold',
						'italic',
						'underline',
						'|',
						'emoji',
						'link',
						'insertImageViaUrl',
						'mediaEmbed',
						'insertTable',
						'blockQuote',
						'|',
						'bulletedList',
						'numberedList',
						'todoList',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Autoformat,
					AutoImage,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					BlockToolbar,
					Bold,
					CloudServices,
					Emoji,
					Essentials,
					Fullscreen,
					Heading,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsertViaUrl,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					Indent,
					IndentBlock,
					Italic,
					Link,
					LinkImage,
					List,
					MediaEmbed,
					Mention,
					Paragraph,
					Table,
					TableCaption,
					TableToolbar,
					TextTransformation,
					TodoList,
					Underline
				],
				balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
				blockToolbar: ['bold', 'italic', '|', 'link', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'],
				fullscreen: {
					onEnterCallback: container =>
						container.classList.add(
							'editor-container',
							'editor-container_classic-editor',
							'editor-container_include-block-toolbar',
							'editor-container_include-fullscreen',
							'main-container'
						)
				},
				heading: {
					options: [
						{
							model: 'paragraph',
							title: 'Paragraph',
							class: 'ck-heading_paragraph'
						},
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1',
							class: 'ck-heading_heading1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2',
							class: 'ck-heading_heading2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3',
							class: 'ck-heading_heading3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4',
							class: 'ck-heading_heading4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5',
							class: 'ck-heading_heading5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6',
							class: 'ck-heading_heading6'
						}
					]
				},
				image: {
					toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText']
				},
				initialData:
					props.initialData||'',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				mention: {
					feeds: [
						{
							marker: '@',
							feed: [
								/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
							]
						}
					]
				},
				menuBar: {
					isVisible: true
				},
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
				}
			}
		};
	}, [isLayoutReady]);

	return (
		<div className="main-container">
			<div
				className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-fullscreen"
				ref={editorContainerRef}
			>
				<div className="editor-container__editor">
					<div ref={editorRef}>{editorConfig && <CKEditor onChange={props.onChange} editor={ClassicEditor} config={editorConfig}  />}</div>
				</div>
			</div>
		</div>
	);
}
// How It All Connects

// Component mounts → useEffect runs → sets isLayoutReady to true
// isLayoutReady changes → useMemo runs → creates editorConfig object
// editorConfig exists → CKEditor component renders with all your settings
// User sees the fully functional rich text editor with all the toolbar buttons and features you configured