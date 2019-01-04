import React from "react";
import FormService from "../../services/FormService";
import PreviewRender from "./PreviewRender";
import { connect } from "react-redux";
const clone = require("clone");

class PreviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formId: "",
      title: "",
      description: "",
      version: "",
      formFieldsArr: [],
      dataArr: [],
      checkedArr: [],
      radioArr: [],
      showSuccess: false,
      showError: false
    };
  }

  componentDidMount() {
    const { formId } = this.props.match.params;
    this.setState({ formId: formId }, () =>
      FormService.selectFormById(
        formId,
        this.selectFormSuccess,
        this.selectFormError
      )
    );
  }

  onChange = evt => {
    const arrIndex = evt.target.getAttribute("index");
    const cloneDataArr = clone(this.state.dataArr);
    const checkedArr = clone(this.state.checkedArr);
    const radioArr = clone(this.state.radioArr);
    if (evt.target.type === "checkbox") {
      const nestidx = evt.target.getAttribute("nestidx");
      const isChecked = checkedArr[nestidx].value;
      if (isChecked === "") {
        checkedArr[nestidx].value = "checked";
        checkedArr[nestidx].inputControlId = parseInt(evt.target.id);
        let dataObj = {
          userId: this.props.user.userId,
          nest: checkedArr
        };
        cloneDataArr[arrIndex] = dataObj;
        this.setState({ checkedArr: checkedArr });
      } else {
        if (isChecked !== "") {
          checkedArr[nestidx].value = "";
        } else {
          checkedArr[nestidx].value = "checked";
        }
        this.setState({ checkedArr: checkedArr });
      }
    } else if (evt.target.type === "radio") {
      const nestidx = evt.target.getAttribute("nestidx");
      radioArr[nestidx].value = evt.target.value;
      let dataObj = {
        userId: this.props.user.userId,
        nest: radioArr
      };
      cloneDataArr[arrIndex] = dataObj;
    } else {
      const dataObj = {
        inputControlId: parseInt(evt.target.id),
        userId: this.props.user.userId,
        value: evt.target.value
      };
      cloneDataArr[arrIndex] = dataObj;
    }
    this.setState({ dataArr: cloneDataArr });
  };

  selectFormSuccess = resp => {
    const item = resp.data.item;
    this.setState(
      {
        title: item.title,
        description: item.description,
        version: `v${item.version}`
      },
      () =>
        FormService.selectByFormId(
          this.state.formId,
          this.inputControlSuccess,
          this.inputControlError
        )
    );
  };

  selectFormError = err => {
    this.setState({ showError: true });
  };

  inputControlSuccess = resp => {
    const cloneArr = [];
    const { title, description, version } = this.state;
    resp.data.map(data => {
      if (data.items.length === 1) {
        data.items.map(item => {
          cloneArr.push(item);
        });
      } else {
        const dataArr = [];
        const placeholderArr = [];
        data.items.map(item => {
          dataArr.push(item);
          const tempObj = {
            inputControlId: item.inputControlId,
            userId: this.props.user.userId
          };
          placeholderArr.push(tempObj);
        });
        const dataObj = {
          title: title,
          description: description,
          version: version,
          position: data.position,
          options: dataArr
        };
        for (let i = 0; i < dataArr.length; i++) {
          placeholderArr[i].value = "";
        }
        const cloneChecked = clone(this.state.checkedArr);
        cloneChecked[data.position] = { nest: placeholderArr };
        if (data.items[0].type === "checkbox") {
          this.setState({ checkedArr: cloneChecked }, () =>
            console.log(cloneChecked[0], this.state.checkedArr)
          );
          cloneArr.push(dataObj);
        } else {
          this.setState({ radioArr: placeholderArr });
          cloneArr.push(dataObj);
        }
      }
    });
    this.setState({ formFieldsArr: cloneArr });
  };

  inputControlError = err => {
    this.setState({ showError: true });
  };

  cancelBack = () => {
    this.props.history.push("/formbuilder/manage");
  };

  saveFormData = () => {
    const { dataArr } = this.state;
    dataArr.map(data => {
      if (data.nest) {
        data.nest.map(child => {
          FormService.formDataInsert(
            child,
            this.formDataSuccess,
            this.formDataError
          );
        });
      } else {
        FormService.formDataInsert(
          data,
          this.formDataSuccess,
          this.formDataError
        );
      }
    });
  };

  formDataSuccess = resp => {
    this.setState({ showSuccess: true });
  };

  formDataError = err => {
    this.setState({ showError: true });
  };

  redirectData = () => {
    this.props.history.push("/formbuilder/formdata");
  };

  closeError = () => {
    this.setState({ showError: false });
  };

  render() {
    return (
      <React.Fragment>
        <h4 className="d-flex justify-content-between align-items-center py-2 mb-4">
          <div className="font-weight-bold">Form Preview</div>
        </h4>
        <PreviewRender
          {...this.state}
          cancelBack={this.cancelBack}
          onChange={this.onChange}
          saveFormData={this.saveFormData}
          redirectData={this.redirectData}
          showSuccess={this.state.showSuccess}
          closeError={this.closeError}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.UserReducer };
};

export default connect(mapStateToProps)(PreviewForm);
