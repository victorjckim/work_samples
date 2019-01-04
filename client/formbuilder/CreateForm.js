import React from "react";
import Select from "react-select";
import TextInput from "../common/TextInput";
import Suggestions from "./Suggestions";
import FormFieldsRender from "./FormFieldsRender";
import FormService from "../../services/FormService";
import InputControlsService from "../../services/InputControlsService";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import LoadingAnimation from "./LoadingAnimation";
import { connect } from "react-redux";
import "./FormBuilder.css";
const clone = require("clone");

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      label: "",
      dataType: "",
      selectedOption: "",
      formId: "",
      version: "",
      selectedNumber: "",
      dropdownNumbers: [],
      formFieldsArr: []
    };
  }

  componentDidMount() {
    this.numberDropdown();
    if (this.props.location.pathname === "/formbuilder/create") {
      this.setState({ formId: "" });
    } else {
      const { formId } = this.props.match.params;
      this.setState({ formId: formId });
      if (formId) {
        FormService.selectByFormId(
          formId,
          this.selectByFormIdSuccess,
          this.selectByFormIdError
        );
      }
    }
  }

  numberDropdown = () => {
    const number = [];
    for (var i = 1; i <= 20; i++) {
      number.push(i);
    }
    this.setState({ dropdownNumbers: number });
  };

  selectByFormIdSuccess = response => {
    const cloneArr = [];
    response.data.map((input, index) => {
      if (
        input.items[0].dataType === "text" ||
        input.items[0].dataType === "date"
      ) {
        let inputObj = {
          label: input.items[0].label,
          dataType: input.items[0].dataType,
          position: index
        };
        cloneArr.push(inputObj);
      } else if (input.items[0].dataType === "Telephone") {
        let inputObj = {
          label: input.items[0].label,
          dataType: "tel",
          position: index
        };
        cloneArr.push(inputObj);
      } else {
        const nestArr = [];
        const nestObj = {
          label: input.items[0].label,
          dataType: input.items[0].dataType.toLowerCase(),
          position: index,
          options: nestArr
        };
        input.items.map(nest => {
          let inputObj = {
            label: nest.label,
            dataType: nest.dataType,
            parentId: nest.parentId,
            name: nest.name
          };
          nestArr.push(inputObj);
        });
        cloneArr.push(nestObj);
      }
    });
    this.setState({
      title: response.data[0].items[0].title,
      description: response.data[0].items[0].description,
      formFieldsArr: this.state.formFieldsArr.concat(cloneArr),
      version: response.data[0].items[0].version
    });
  };

  selectByFormIdError = error => console.log(error);

  onChange = evt => {
    this.setState({ dataType: evt.value, selectedOption: evt, label: "" });
  };

  onSelect = val => {
    this.setState({ label: val });
  };

  onInputFieldChange = evt => {
    const key = evt.target.name;
    const val = evt.target.value;
    this.setState({ [key]: val });
  };

  dropdownInputChange = evt => {
    const arrindex = evt.target.getAttribute("index");
    const nestIndex = evt.target.id;
    const val = evt.target.value;
    const cloneDropdown = clone(this.state.formFieldsArr);
    cloneDropdown[arrindex].options[nestIndex].name = val;
    this.setState({ formFieldsArr: cloneDropdown });
  };

  addFormField = () => {
    if (this.state.dataType === "checkbox" || this.state.dataType === "radio") {
      this.numberSelect(this.state.selectedNumber - 1, this.state.label);
    } else if (this.state.label === "") {
      alert("Please enter a field name");
    } else {
      this.setState(
        {
          formFieldsArr: this.state.formFieldsArr.concat([
            {
              dataType: this.state.dataType,
              label: this.state.label,
              position: this.state.formFieldsArr.length
            }
          ])
        },
        () => this.resetForm()
      );
    }
  };

  deleteFormField = evt => {
    let array = [...this.state.formFieldsArr];
    array.splice(evt.target.id, 1);
    this.setState({ formFieldsArr: array });
  };

  numberSelect = (int, label) => {
    const trueNumber = int--;
    const nestArr = [];
    const newArr = [];
    for (var i = 0; i < trueNumber; i++) {
      nestArr.push({
        label,
        dataType: this.state.dataType,
        parentId: i
      });
    }
    newArr.push({
      dataType: this.state.dataType,
      label: label,
      position: this.state.formFieldsArr.length,
      options: nestArr
    });
    this.setState({
      formFieldsArr: this.state.formFieldsArr.concat(newArr),
      label: ""
    });
  };

  resetForm = () => {
    this.setState({
      ...this.state,
      label: ""
    });
  };

  handleKeyPress = evt => {
    if (evt.key === 13 || evt.key === "Enter") {
      evt.preventDefault();
      this.addFormField();
    }
  };

  disabledLogic = () => {
    switch (this.state.dataType) {
      case "":
        return true;
      case "checkbox":
        if (
          this.state.selectedNumber === "" ||
          this.state.selectedNumber === "0" ||
          this.state.label === ""
        ) {
          return true;
        }
        break;
      case "radio":
        if (
          this.state.selectedNumber === "" ||
          this.state.selectedNumber === "0" ||
          this.state.label === ""
        ) {
          return true;
        }
        break;
      default:
        return false;
    }
  };

  saveForm = () => {
    const { title, description, version, formId } = this.state;
    const formData = {
      id: formId,
      title: title,
      description: description,
      version: version === "" ? 1 : version,
      modifiedBy: "Me"
    };
    if (this.state.formFieldsArr.length === 0) {
      alert("Please enter an input field to the form");
    } else if (formId) {
      this.showLoadingModal();
      FormService.update(
        formId,
        formData,
        this.updateSuccess,
        this.updateError
      );
    } else {
      this.showLoadingModal();
      FormService.create(formData, this.formSuccess, this.formError);
    }
  };

  formSuccess = async response => {
    const formId = response.data.item;
    const { formFieldsArr } = this.state;
    this.setState({
      formId: formId,
      counter: formFieldsArr.length
    });
    const orgFormData = { formId: formId, orgId: this.props.user.orgId[0] };
    FormService.createOrgForm(
      orgFormData,
      this.orgFormSuccess,
      this.orgFormError
    );
    formFieldsArr.map(async field => {
      if (
        field.dataType === "text" ||
        field.dataType === "date" ||
        field.dataType === "tel"
      ) {
        if (field.dataType === "text") {
          var typeId = 1;
        } else if (field.dataType === "tel") {
          var typeId = 5;
        } else {
          var typeId = 2;
        }

        const dataObj = {
          formId: formId,
          inputTypeId: typeId,
          label: field.label,
          type: field.dataType,
          name: field.label,
          position: field.position
        };
        try {
          await InputControlsService.create(dataObj);
        } catch (err) {
          console.log(err);
        }
      } else {
        if (field.dataType === "checkbox") {
          var typeId = 3;
        } else {
          var typeId = 4;
        }
        field.options.map(async option => {
          let dataObj = {
            formId: formId,
            inputTypeId: typeId,
            label: field.label,
            type: field.dataType,
            name: option.name,
            parentId: option.parentId,
            position: field.position
          };
          try {
            await InputControlsService.create(dataObj);
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
    setTimeout(() => {
      this.closeLoadingModal();
      this.props.history.push("/formbuilder/manage");
    }, 1000);
  };

  formError = err => {
    alert("Create Form Error");
  };

  updateSuccess = async () => {
    const { formFieldsArr, formId } = this.state;
    this.setState({
      formId: formId,
      counter: formFieldsArr.length
    });
    formFieldsArr.map(async field => {
      if (
        field.dataType === "text" ||
        field.dataType === "date" ||
        field.dataType === "tel"
      ) {
        if (field.dataType === "text") {
          var typeId = 1;
        } else if (field.dataType === "tel") {
          var typeId = 5;
        } else {
          var typeId = 2;
        }

        const dataObj = {
          formId: formId,
          inputTypeId: typeId,
          label: field.label,
          type: field.dataType,
          name: field.label,
          position: field.position
        };
        try {
          await InputControlsService.create(dataObj);
        } catch (err) {
          console.log(err);
        }
      } else {
        if (field.dataType === "checkbox") {
          var typeId = 3;
        } else {
          var typeId = 4;
        }
        field.options.map(async option => {
          let dataObj = {
            formId: formId,
            inputTypeId: typeId,
            label: field.label,
            type: field.dataType,
            name: option.name,
            parentId: option.parentId,
            position: field.position
          };
          try {
            await InputControlsService.create(dataObj);
          } catch (err) {
            console.log(err);
          }
        });
      }
    });
    setTimeout(() => {
      this.closeLoadingModal();
      this.props.history.push("/formbuilder/manage");
    }, 1000);
  };

  updateError = err => {
    this.closeLoadingModal();
  };

  orgFormSuccess = response => {};

  orgFormError = err => {};

  showLoadingModal = () => {
    this.showLoading.click();
  };

  closeLoadingModal = () => {
    this.closeLoading.click();
  };

  onDragEnd = result => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const dragObj = clone(this.state.formFieldsArr[source.index]);
    const formArrClone = clone(this.state.formFieldsArr);
    formArrClone.splice(source.index, 1);
    formArrClone.splice(destination.index, 0, dragObj);
    formArrClone.map((input, idx) => {
      input.position = idx;
    });
    this.setState({ formFieldsArr: formArrClone });
  };

  render() {
    let loadingModal = (
      <div
        className="modal show"
        id="modals-loading"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog">
          <button
            type="button"
            className="modalShow"
            data-toggle="modal"
            data-target="#modals-loading"
            ref={modal => (this.showLoading = modal)}
          >
            Show
          </button>
          <button
            type="button"
            className="close modalShow"
            data-dismiss="modal"
            aria-label="Close"
            ref={modal => (this.closeLoading = modal)}
          >
            Close
          </button>
        </div>
        <LoadingAnimation />
      </div>
    );
    const options = [
      { value: "", label: "Select..." },
      { value: "text", label: "Text" },
      { value: "date", label: "Date" },
      { value: "checkbox", label: "Checkbox" },
      { value: "radio", label: "Radio" },
      { value: "tel", label: "Telephone" }
    ];
    const { selectedOption } = this.state;
    return (
      <React.Fragment>
        <div class="top" href="#" />
        <h4 className="d-flex justify-content-between align-items-center py-2 mb-4">
          <div className="font-weight-bold text-muted">Form Builder</div>
        </h4>
        <h2>
          {this.props.location.pathname === "/formbuilder/create"
            ? "Create Form"
            : "Edit Form"}
        </h2>
        <TextInput
          name="title"
          type="text"
          label="Form Title"
          value={this.state.title}
          placeholder="Please enter a title..."
          onChange={this.onInputFieldChange}
        />
        <TextInput
          name="description"
          type="text"
          label="Form Description"
          value={this.state.description}
          placeholder="Please enter a description..."
          onChange={this.onInputFieldChange}
        />
        <form className="createForm">
          <div className="row">
            <div className="col-md-4 col-lg-3">
              <label className="form-label mr-sm-2">Input Type</label>
              <Select
                value={selectedOption}
                onChange={this.onChange}
                options={options}
                placeholder="Select..."
                name="dataType"
              />
              {this.state.dataType === "checkbox" ||
              this.state.dataType === "radio" ? (
                <select
                  name="selectedNumber"
                  onChange={this.onInputFieldChange}
                  value={this.state.selectedNumber}
                >
                  <option value="">...</option>
                  {this.state.dropdownNumbers.map(number => {
                    return (
                      <option key={number + 1000} value={number + 1}>
                        {number}
                      </option>
                    );
                  })}
                </select>
              ) : (
                ""
              )}
            </div>
            <div className="col-md-8 col-lg-9 mb-3">
              <label className="form-label mr-sm-2">Field Name</label>
              <div className="input-group">
                <Suggestions
                  dataType={this.state.dataType}
                  label={this.state.label}
                  onInputFieldChange={this.onInputFieldChange}
                  onSelect={this.onSelect}
                  handleKeyPress={this.handleKeyPress}
                />
                <span className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.addFormField}
                    disabled={this.disabledLogic()}
                  >
                    Add
                  </button>
                </span>
              </div>
            </div>
          </div>
        </form>
        <form className="col-lg-6 offset-lg-3 col-md-12">
          <DragDropContext
            onDragStart={this.onDragStart}
            onDragUpdate={this.onDragUpdate}
            onDragEnd={this.onDragEnd}
          >
            <Droppable droppableId="droppable-1" type="FORM">
              {provided => (
                <div
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: ""
                  }}
                  {...provided.droppableProps}
                >
                  <FormFieldsRender
                    formFieldsArr={this.state.formFieldsArr}
                    deleteFormField={this.deleteFormField}
                    dropdownInputChange={this.dropdownInputChange}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </form>
        <a style={{ color: "white" }} href="#top">
          <button
            type="button"
            href="#top"
            className={
              this.props.location.pathname === "/formbuilder/create"
                ? "btn btn-success"
                : "btn btn-primary"
            }
            onClick={this.saveForm}
            disabled={
              this.state.title === "" || this.state.description === ""
                ? true
                : false
            }
          >
            {this.props.location.pathname === "/formbuilder/create"
              ? "Save"
              : "Update"}
          </button>
        </a>
        {loadingModal}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { user: state.UserReducer };
};

export default connect(mapStateToProps)(CreateForm);
