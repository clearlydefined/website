import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { Grid, Modal, Button } from 'react-bootstrap'
import closeSvg from '../images/icons/closeSvg.svg'
import SourceLocationPicker from './SourceLocationPicker'
import SpdxPicker from './SpdxPicker'

const QuickEditModel = props => {
  const { initialValues, token, open, closeModel, onSave } = props

  const [values, setValues] = useState({
    declared: initialValues.declared,
    release: initialValues.release
  })

  useEffect(() => {
    setValues({
      declared: initialValues.declared,
      release: initialValues.release
    })
  }, [initialValues])

  const handleChange = ({ target }) => {
    setValues({ ...values, [target.id]: target.value })
  }

  const handleSourceComponentChange = newComponent => {
    setValues({ ...values, sourceComponent: newComponent })
  }

  const handleLicenseChange = license => {
    setValues({ ...values, declared: license })
  }

  const handleSave = () => {
    closeModel()
    onSave(values)
  }

  return (
    <div>
      <Modal className={`clearly-model  ${open ? 'show' : '.'}`} show={open} onHide={closeModel}>
        <div className="model-header">
          <h4>Quick Edit Component</h4>
          <span className="model-close-btn" onClick={closeModel}>
            <img src={closeSvg} alt="" />
          </span>
        </div>
        <div className="clearly-model-body">
          <form action="">
            <div className="form-group row">
              <label htmlFor="declared" className="col-sm-2 col-form-label model-label">
                Declared
              </label>
              <div className="col-sm-10">
                <SpdxPicker value={values.declared || ''} promptText={'SPDX license'} onChange={handleLicenseChange} />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="source" className="col-sm-2 col-form-label model-label">
                Source
              </label>
              <div className="col-sm-10 d-flex justify-content-between align-items-center">
                <Grid className="edit" id="source-picker">
                  <SourceLocationPicker
                    token={token}
                    value={initialValues.sourceComponent?.url || ''}
                    activeProvider={initialValues.sourceComponent?.provider}
                    onChangeComponent={handleSourceComponentChange}
                  />
                </Grid>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="release" className="col-sm-2 col-form-label model-label">
                Release
              </label>
              <div className="col-sm-10">
                <input
                  type="date"
                  onChange={handleChange}
                  value={values.release || ''}
                  className="form-control model-input"
                  id="release"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="clearly-model-footer">
          <Button onClick={closeModel} className="modal__btn modal__btn--secondary" variant="secondary">
            Close
          </Button>
          <Button onClick={handleSave} className="modal__btn modal__btn-primary" variant="secondary">
            Save
          </Button>
        </div>
      </Modal>
    </div>
  )
}

QuickEditModel.propsType = {
  open: PropTypes.bool,
  closeModel: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSave: PropTypes.object.isRequired
}

export default QuickEditModel
