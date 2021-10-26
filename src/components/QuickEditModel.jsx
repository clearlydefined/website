import React from 'react'
import { Modal, Button, } from "react-bootstrap"
import closeSvg from "../images/icons/closeSvg.svg"

const QuickEditModel = (props) => {
  const { open, closeModel, values, onChange } = props;
  return (
    <div>
      <Modal className={`clearly-model  ${open ? 'show' : '.'}`} show={open} onHide={closeModel}>
        <div className="model-header">
          <h4>Quick Edit Component</h4>
          <span className="model-close-btn" onClick={() => closeModel()}><img src={closeSvg} alt="" /></span>
        </div>
        <div className="clearly-model-body">
          <form action="">
            <div className="form-group row">
              <label htmlFor="declared"
                className="col-sm-2 col-form-label model-label">Declared</label>
              <div className="col-sm-10">
                <input
                  onChange={(e) => typeof (onChange.declared) === 'function' ? onChange.declared() : null}
                  value={values.declared || ""}
                  type="text"
                  className="form-control model-input"
                  id="declared"
                  placeholder="MIT" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="source" className="col-sm-2 col-form-label model-label">Source</label>
              <div className="col-sm-10 d-flex justify-content-between align-items-center">
                <input
                  onChange={(e) => typeof (onChange.source) === 'function' ? onChange.source() : null}
                  value={values.source || ""}
                  type="text"
                  className="form-control mr-4 model-input"
                  id="source"
                  placeholder="User / Organization" />
                &nbsp;&nbsp;&nbsp;
                <input
                  onChange={(e) => typeof (onChange.repo) === 'function' ? onChange.repo() : null}
                  value={values.repo || ""}
                  type="text"
                  className="form-control model-input"
                  id="repo"
                  placeholder="Repo" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="release" className="col-sm-2 col-form-label model-label">Release</label>
              <div className="col-sm-10">
                <input type="date"
                  onChange={(e) => typeof (onChange.release) === 'function' ? onChange.release() : null}
                  value={values.release || ""}
                  className="form-control model-input"
                  id="release" />
              </div>
            </div>
          </form>
          {/* <Form>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control plaintext readOnly defaultValue="email@example.com" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10">
                <Form.Control type="password" placeholder="Password" />
              </Col>
            </Form.Group>
          </Form> */}
        </div>
        <div className="clearly-model-footer">
          <Button onClick={() => closeModel()} className="modal__btn modal__btn--secondary" variant="secondary" onClick={closeModel}>
            Close
          </Button>
          <Button className="modal__btn modal__btn-primary" variant="secondary">Save</Button>
        </div>
      </Modal>
    </div>
  )
}

export default QuickEditModel
