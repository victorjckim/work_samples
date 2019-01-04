import React from "react";
import TextInput from "../common/TextInput";
import MaskedInput from "react-text-mask";
import SweetAlert from "react-bootstrap-sweetalert";

const PreviewRender = props => {
  return (
    <React.Fragment>
      <h2>{props && `${props.title} ${props.version}`}</h2>
      <SweetAlert
        success
        show={props.showSuccess}
        allowEscape={false}
        closeOnClickOutside={false}
        confirmBtnText="OK"
        confirmBtnBsStyle="primary"
        title="Form Submitted"
        onConfirm={props.redirectData}
      />
      <SweetAlert
        danger
        show={props.showError}
        allowEscape={false}
        closeOnClickOutside={false}
        confirmBtnText="OK"
        confirmBtnBsStyle="default"
        title="Oops"
        onConfirm={props.closeError}
      >
        Something went wrong. Please try again.
      </SweetAlert>
      <div className="form">
        {props.formFieldsArr.map((field, index) => {
          if (field.options) {
            return (
              <div className="col-lg-6 offset-lg-3" key={index}>
                <div className="form-group">
                  {field.options.map((nest, idx) => {
                    if (nest.type === "checkbox") {
                      return (
                        <React.Fragment key={idx}>
                          {idx === 0 && (
                            <label className="form-label" htmlFor={nest.name}>
                              {nest.label}
                            </label>
                          )}
                          <div className="form-check">
                            <input
                              checked={
                                props.checkedArr[idx].value === ""
                                  ? ""
                                  : props.checkedArr[idx].value
                              }
                              index={index}
                              nestidx={idx}
                              className="form-check-input input-md"
                              style={{ display: "inline-flex" }}
                              name={nest.name}
                              type={nest.type}
                              onChange={props.onChange}
                              id={nest.inputControlId}
                              value={props.checkedArr[idx].checked}
                            />
                            <label className="form-check-label">
                              {nest.name}
                            </label>
                          </div>
                        </React.Fragment>
                      );
                    } else if (nest.type === "radio") {
                      return (
                        <React.Fragment key={idx}>
                          {idx === 0 && (
                            <label className="form-label" htmlFor={nest.name}>
                              {nest.label}
                            </label>
                          )}
                          <div className="form-check">
                            <input
                              index={index}
                              className="form-check-input input-md"
                              style={{ display: "inline-flex" }}
                              name={nest.label}
                              type={nest.type}
                              value={nest.name}
                              nestidx={idx}
                              onChange={props.onChange}
                              id={nest.inputControlId}
                            />
                            <label className="form-check-label">
                              {nest.name}
                            </label>
                          </div>
                        </React.Fragment>
                      );
                    }
                  })}
                </div>
              </div>
            );
          } else {
            if (field.type === "text" || field.type === "date") {
              return (
                <div className="col-lg-6 offset-lg-3" key={index}>
                  <TextInput
                    index={index}
                    id={field.inputControlId}
                    name={field.name.replace(/\s/g, "").toLowerCase()}
                    label={field.label}
                    type={field.type}
                    onChange={props.onChange}
                  />
                </div>
              );
            } else {
              return (
                <div className=" col-lg-6 offset-lg-3">
                  <label className="form-label" htmlFor={field.label}>
                    {field.label}
                  </label>
                  <MaskedInput
                    index={index}
                    name="phoneNumber"
                    className="form-control"
                    id={field.inputControlId}
                    onChange={props.onChange}
                    guide={true}
                    showMask={true}
                    mask={[
                      "(",
                      /[1-9]/,
                      /\d/,
                      /\d/,
                      ")",
                      " ",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/
                    ]}
                  />
                </div>
              );
            }
          }
        })}
        <button
          type="button"
          className="btn btn-clear"
          onClick={props.cancelBack}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={props.saveFormData}
        >
          Submit
        </button>
      </div>
    </React.Fragment>
  );
};

export default PreviewRender;
