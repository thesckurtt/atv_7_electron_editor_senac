import React, { useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { Modal, Button, Form, InputGroup, Image } from 'react-bootstrap';

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
    const data = {
      fileName: fileName,
      content: fileContent

    }
    const response = await window.electronAPI.saveFile(data)

    if(response.sucesso){
      alert('Arquivo salvo com sucesso!')
    }
    if (response && response.error) {
      alert("Erro ao salvar arquivo!")
    }
  }

  function saveUser() {
    const data = {
      profileImage: gitHubProfileImg,
      username: gitHubUsername,
      token: gitHubToken
    }
    setUser(data)
    setGitHubToken('')
    setGitHubProfileImg('')
    setGitHubUsername('')
  }

  function getGitHubProfileImg(username) {
    if (gitHubUsername) {
      setTimeout(async () => {
        try {
          const res = await fetch(`https://api.github.com/users/${gitHubUsername}`);
          const data = await res.json();
          // console.log(data.avatar_url);
          if (data.avatar_url) {
            setGitHubProfileImg(data.avatar_url)
          } else {
            setGitHubProfileImg('img/profile_default.png')
          }
        } catch (err) {
          console.error('Erro ao buscar usuário:', err);
        }
      }, 500);
    } else {
      setGitHubProfileImg('')
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
            {user && user.profileImage && <div className="container-img-profile my-1">
              <img src={user.profileImage} alt={user.username} />
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
          <Modal.Title>Adicionar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column justify-content-center align-items-center'>
          {gitHubProfileImg && <Image
            src={gitHubProfileImg}
            roundedCircle
            className='mb-3'
            width={100}
            alt="Avatar do GitHub"
          />}
          {gitHubUsername && <Form.Text className="text-muted mb-3 ">
            github.com/{gitHubUsername}
          </Form.Text>}
          <InputGroup className="">
            <InputGroup.Text id="username"><i class="fa-solid fa-at"></i></InputGroup.Text>
            <Form.Control
              placeholder="GitHub User"
              aria-label="GitHub User"
              aria-describedby="basic-addon2"
              value={gitHubUsername}
              onBlur={() => getGitHubProfileImg(gitHubUsername)}
              onChange={(e) => setGitHubUsername(e.target.value)}
            />
          </InputGroup>

          <InputGroup className="mb-3 mt-3">
            <InputGroup.Text id="token"><i class="fa-solid fa-key"></i></InputGroup.Text>
            <Form.Control
              placeholder="Token"
              aria-label="Token"
              aria-describedby="basic-addon2"
              type="password"
              value={gitHubToken}
              onChange={(e) => setGitHubToken(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={() => {handleClose(); saveUser()}}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Index
