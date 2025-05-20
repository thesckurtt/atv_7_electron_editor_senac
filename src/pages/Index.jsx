import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
const Index = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  function openFile() {
    window.electronAPI.openFile().then(result => {
      if (!result.cancelado) {
        setFileName(result.fileName)
        setFileContent(result.content);
      }
    });
  }

  async function saveFile() {
    const response = await window.electronAPI.saveFile(fileContent)

    if (response && response.error) {
      alert("Erro ao salvar arquivo!")
    }
  }
  return (
    <>
      <div className="middle-content">
        <div className="left-panel">
          <i className="fa-solid fa-folder-open" onClick={openFile}></i>
          <i className="fa-solid fa-floppy-disk" onClick={saveFile}></i>
          <i className="fa-solid fa-share-nodes"></i>
          <i className="fa-solid fa-file-pdf"></i>
        </div>
        <div className="editor">
          <div className="header-editor d-flex flex-row">
            {fileName && <div className="d-flex flex-row header-editor-tab active"><span className="fs-6" >
              <i className="fa-solid fa-file-code"></i>
              <span contentEditable="true">{fileName}</span></span><i className="fa-solid fa-xmark"></i></div>}
            {/* <div className="d-flex flex-row header-editor-tab"><span className="fs-6"><i className="fa-solid fa-file-code"></i>
              outro.json</span><i className="fa-solid fa-xmark"></i></div> */}
          </div>
          <div className="main-editor">
            <CodeMirror
              value={fileContent}
              height="100%"
              extensions={[json()]}
              onChange={(value) => setFileContent(value)}
              theme="dark"
            />
          </div>
        </div>
        <div className="right-panel">
          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="container-img-profile my-1">
              <img src="https://avatars.githubusercontent.com/u/36058994?v=4" alt="" />
            </div>
            <div className="add-profile my-1">
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
          <i className="fa-solid fa-gear mb-3"></i>
        </div>
      </div>
      <div className="footer-app">
        <div className="space-mono-regular"><span className="color-def">LN2, COL1</span><span className="color-def">Rows:
          30</span><span className="color-mem">Mem: 10%</span><span className="color-disk">Disk: 30%</span></div>
      </div>
    </>
  )
}

export default Index
