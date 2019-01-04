import React from 'react';
import CreateConfigForm from './CreateConfigForm'
import ConfigService from '../../services/ConfigService'
import DataTypeService from '../../services/DataTypeService'
import ConfigTypeService from '../../services/ConfigTypeService'
import FormErrors from '../common/FormErrors'

class CreateConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configName: "",
            dataTypeId: "",
            configValue: "",
            configKey: "",
            description: "",
            required: false,
            secured: false,
            checkboxState: true,
            securedCheckboxState: true,
            booleanCheckboxState: true,
            configTypeId: '',
            modifiedBy: 'Me',
            dataTypes: [],
            configTypes: [],
            formErrors: {
                configName: '',
                dataTypeId: '',
                configValue: '',
                description: '',
                configTypeId: ''
            },
            configNameValid: false,
            dataTypeIdValid: false,
            configValueValid: false,
            descriptionValid: false,
            configTypeIdValid: false
        }
    }

    componentDidMount = () => {
        DataTypeService.getAll(this.dataTypeSuccess, this.dataTypeError)
        ConfigTypeService.getAll(this.configTypeSuccess, this.configTypeError)
    }

    onChange = evt => {
        const key = evt.target.name
        const val = evt.target.value
        let stateObj = {
            [key]: val
        }
        if (key === 'configName') {
            stateObj.configKey = val.toLowerCase().replace(/ /g, '_')
        }
        this.setState(stateObj,
            () => { this.validateField(key, val) }
        )
    }

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let configNameValid = this.state.configNameValid;
    let dataTypeIdValid = this.state.dataTypeIdValid;
    let configValueValid = this.state.configValueValid;
    let descriptionValid = this.state.descriptionValid;
    let configTypeIdValid = this.state.configTypeId;

        switch (fieldName) {
            case 'configName':
                configNameValid = value.length > 0
                fieldValidationErrors.configName = configNameValid ? ''
                    : 'Name field is required'
                break
            case 'dataTypeId':
                dataTypeIdValid = value.length > 0 && value > 0
                fieldValidationErrors.dataTypeId = dataTypeIdValid ? ''
                    : 'Data Type is required'
                break
            case 'configValue':
                const dataTypeObj = this.validateDataType(this.state.dataTypeId,
                    this.state.dataTypes, value)
                configValueValid = dataTypeObj.configValueValid
                fieldValidationErrors.configValue = configValueValid ? ''
                    : dataTypeObj.validationMessage
                break
            case 'description':
                descriptionValid = value.length > 0
                fieldValidationErrors.description = descriptionValid ? ''
                    : 'Description field is required'
                break
            case 'configTypeId':
                configTypeIdValid = value.length > 0 && value > 0
                fieldValidationErrors.configTypeId = configTypeIdValid ? ''
                    : 'Type ID must be greater than 0'
                break
            default:
                break
        }
        this.setState({
            formErrors: fieldValidationErrors,
            configNameValid: configNameValid,
            dataTypeIdValid: dataTypeIdValid,
            configValueValid: configValueValid,
            descriptionValid: descriptionValid,
            configTypeIdValid: configTypeIdValid
        }, this.validateForm)
    }

  validateForm() {
    this.setState({
      formValid:
        this.state.configNameValid &&
        this.state.dataTypeIdValid &&
        this.state.configValueValid &&
        this.state.descriptionValid &&
        this.state.configTypeIdValid
    });
  }

    validateDataType = (dataTypeId, showName, value) => {
        switch (showName[dataTypeId - 1].displayName.toLowerCase()) {
            case 'integer':
                return {
                    configValueValid: /^\+?[1-9][\d]*$/.test(value),
                    validationMessage: this.configValueValid ? ''
                        : 'Not an integer'
                }
            case 'string':
                return {
                    configValueValid: (typeof value.toLowerCase() === 'string' && value.length > 0),
                    validationMessage: this.configValueValid ? ''
                        : 'Not a string'
                }
            case 'boolean':
                return {
                    configValueValid: (value.toLowerCase() === 'true'
                        || value.toLowerCase() === 'false' ? true : false),
                    validationMessage: this.configValueValid ? ''
                        : 'Not a boolean'
                }
            default:
                return {
                    configValueValid: true,
                    validationMessage: ''
                }
        }
    }

  createConfigEntry = evt => {
    evt.preventDefault();
    console.log(this.state);
    ConfigService.create(this.state, this.createSuccess, this.createError);
  };

  dataTypeSuccess = response => {
    console.log(response);
    this.setState({ dataTypes: response.data.items });
  };

    dataTypeError = response => {
        console.log(response)
    }

    configTypeSuccess = response => {
        console.log(response)
        this.setState({ configTypes: response.data.items })
    }

    configTypeError = response => {
        console.log(response)
    }

    createSuccess = response => {
        console.log('Create success')
        console.log(response)
        this.props.history.push('/settings/config/manage')
    }

    createError = response => {
        console.log("Create error")
        console.log(response)
    }

    booleanCheckboxControl = () => {
        this.setState({ booleanCheckboxState: true })
    }

    checkDataType = (data) => {
        if (parseInt(data) === 1) {
            return 'number'
        } else if (parseInt(data) === 2) {
            return 'text'
        } else if (parseInt(data) === 3) {
            return 'checkbox'
        } else {
            return null
        }
    }

  cancelBack = () => {
    this.props.history.push("/settings/config/manage");
  };

    toggleChecked = evt => {
        if (evt.target.name === 'required') {
            this.setState({ checkboxState: !this.state.checkboxState })
        } else if (evt.target.name === 'secured') {
            this.setState({ securedCheckboxState: !this.state.securedCheckboxState })
        } else if (evt.target.placeholder === '') {
            this.setState({ booleanCheckboxState: !this.state.booleanCheckboxState })
        }
    }

    cancelBack = () => {
        this.props.history.push('/settings/config/manage');
    }

    render() {
        return (
            <React.Fragment>
                <div className="card mb-4 col-lg-6 offset-lg-3">
                    <h6 className="card-header">
                        Create Configuration
                    </h6>
                    <div className="card-body">
                        <CreateConfigForm
                            configName={this.state.configName}
                            dataTypeId={this.state.dataTypeId}
                            configValue={this.state.configValue}
                            configKey={this.state.configKey}
                            description={this.state.description}
                            required={this.state.required}
                            secured={this.state.secured}
                            configTypeId={this.state.configTypeId}
                            onChange={this.onChange}
                            createConfigEntry={this.createConfigEntry}
                            disabled={this.state.formValid}
                            dataTypes={this.state.dataTypes}
                            configTypes={this.state.configTypes}
                            checkDataType={this.checkDataType}
                            toggleChecked={this.toggleChecked}
                            checkboxState={this.state.checkboxState}
                            securedCheckboxState={this.state.securedCheckboxState}
                            booleanCheckboxState={this.state.booleanCheckboxState}
                            booleanCheckboxControl={this.booleanCheckboxControl}
                            cancelBack={this.cancelBack}
                        />
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default CreateConfig;
