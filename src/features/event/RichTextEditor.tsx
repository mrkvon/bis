import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const createEditorState = (value: string) => {
  if (!value) return EditorState.createEmpty()
  else {
    const blocksFromHtml = htmlToDraft(value)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    )
    return EditorState.createWithContent(contentState)
  }
}

const RichTextEditor = ({
  value = '',
  onChange = () => {
    return
  },
}: {
  value?: string
  onChange?: (value: string) => void
}) => {
  const [editorState, setEditorState] = useState(createEditorState(value))

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="ant-input p-0"
        toolbarClassName="m-0"
        editorClassName="ant-input border-0 m-0"
        onEditorStateChange={editorState => {
          setEditorState(editorState)
          onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
        toolbar={{
          options: ['inline', 'list', 'link', 'history'],
          inline: {
            inDropdown: false,
            options: ['bold', 'italic'],
          },
        }}
      />
    </div>
  )
}

export default RichTextEditor
