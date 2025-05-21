import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const Index = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [show, setShow] = useState(false);

  const [gitHubUsername, setGitHubUsername] = useState('')
  const [gitHubToken, setGitHubToken] = useState('')
  const [gitHubProfileImg, setGitHubProfileImg] = useState('')

  const [user, setUser] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  function openFile() {
    window.electronAPI.openFile().then(result => {
      if (!result.cancelado) {
        setFileName(result.fileName)
        setFileContent(result.content);
      }
    });
  }

  function handleCodeMirrorChange(value) {
    if (!fileName) {
      setFileName('new.json')
    }
    setFileContent(value)
  }

  function closeTab() {
    setFileName('')
    setFileContent('')
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
              <span contentEditable="true">{fileName}</span></span><i className="fa-solid fa-xmark" onClick={closeTab}></i></div>}
            {/* <div className="d-flex flex-row header-editor-tab"><span className="fs-6"><i className="fa-solid fa-file-code"></i>
              outro.json</span><i className="fa-solid fa-xmark"></i></div> */}
          </div>
          <div className="main-editor">
            <CodeMirror
              value={fileContent}
              height="100%"
              extensions={[json()]}
              onChange={(value) => handleCodeMirrorChange(value)}
              theme="dark"
            />
          </div>
        </div>
        <div className="right-panel">
          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            {user && user.profileImg && <div className="container-img-profile my-1">
              <img src={user.profileImg} alt={user.userName} />
            </div>}

            <div className="add-profile my-1" onClick={handleShow}>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="">
            <InputGroup.Text id="basic-addon2"><i class="fa-solid fa-at"></i></InputGroup.Text>
            <Form.Control
              placeholder="GitHub User"
              aria-label="GitHub User"
              aria-describedby="basic-addon2"
              value={gitHubUsername}
              onChange={(e) => setGitHubUsername(e.target.value)}
            />

          </InputGroup>
          {gitHubUsername && <Form.Text className="text-muted mb-3">
            github.com/{gitHubUsername}
          </Form.Text>}

          <InputGroup className="mb-3 mt-3">
            <InputGroup.Text id="basic-addon2"><i class="fa-solid fa-key"></i></InputGroup.Text>
            <Form.Control
              placeholder="Recipient's username"
              aria-label="Token"
              aria-describedby="basic-addon2"
              type='pasword'
              value={'dfff'}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Index
