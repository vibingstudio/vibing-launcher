import { FC, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import ReactMarkdown from 'react-markdown'
import './ChangelogModal.css'
interface ChangelogModalProps {
    changelog: string
}

export const ChangelogModal: FC<ChangelogModalProps> = ({ changelog }) => {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    return (
        <div>
            <button className="modal-btn" onClick={handleShow}>
                changelog
            </button>
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>🛠️ Changelog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactMarkdown
                        components={{
                            h2: 'h4',
                            h3: 'h5',
                        }}
                    >
                        {changelog}
                    </ReactMarkdown>
                </Modal.Body>
            </Modal>
        </div>
    )
}
