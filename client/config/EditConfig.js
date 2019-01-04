import React from 'react';
import EditConfigForm from './EditConfigForm'
import ConfigService from '../../services/ConfigService';
import DataTypeService from '../../services/DataTypeService'
import ConfigTypeService from '../../services/ConfigTypeService'
import FormErrors from '../common/FormErrors'

class EditConfig extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            configName: '',
            dataTypeId: '',
            configValue: '',
            configKey: '',
            description: '',
            configTypeId: '',
            required: false,
            secured: false,
            checkboxState: true,
            securedCheckboxState: true,
            booleanCheckboxState: true,
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
            configTypeIdValid: false,
        }
    }

    componentDidMount = () => {
        ConfigService.getById(this.props.match.params.id, this.getByIdSuccess, this.onError)
        DataTypeService.getAll(this.dataTypeSuccess, this.dataTypeError)
        ConfigTypeService.getAll(this.configTypeSuccess, this.configTypeError)
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors
        let configNameValid = this.state.configNameValid
        let dataTypeIdValid = this.state.dataTypeIdValid
        let configValueValid = this.state.configValueValid
        let descriptionValid = this.state.descriptionValid
        let configTypeIdValid = this.state.configTypeId

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
                const dataTypeObj = this.validateDataType(
                    this.state.dataTypeId,
                    this.state.dataTypes,
                    value)
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
                this.state.configNameValid
                && this.state.dataTypeIdValid
                && this.state.configValueValid
                && this.state.descriptionValid
                && this.state.configTypeIdValid
        })
    }

    getByIdSuccess = response => {
        console.log('Get by ID success')
        console.log(response)
        this.setState({
            id: response.data.item.id,
            configName: response.data.item.configName,
            dataTypeId: response.data.item.dataTypeId,
            configValue: response.data.item.configValue,
            configKey: response.data.item.configKey,
            description: response.data.item.description,
            configTypeId: response.data.item.configTypeId,
            required: response.data.item.required,
            secured: response.data.item.secured,
            modifiedBy: response.data.item.modifiedBy,
            checkboxState: !response.data.item.required,
            securedCheckboxState: !response.data.item.secured,
            booleanCheckboxState: (response.data.item.configValue === 'false' ? true : false),
            configNameValid: true,
            dataTypeIdValid: true,
            configValueValid: true,
            descriptionValid: true,
            configTypeIdValid: true,
            formValid: true
        })
    }

    onError = response => {
        console.log('Get by ID error')
    }

    dataTypeSuccess = response => {
        console.log(response)
        this.setState({ dataTypes: response.data.items })
    }

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

    onChange = evt => {
        const key = evt.target.name
        const val = evt.target.value
        let stateObj = {
            [key]: val
        }
        this.setState(stateObj,
            () => { this.validateField(key, val) }
        )
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
                    configValueValid: (typeof value.toLowerCase() === 'string'
                        && value.length > 0),
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

    updateConfigEntry = evt => {
        evt.preventDefault()
        console.log('Update clicked')
        ConfigService.update(this.state.id, this.state, this.updateSuccess, this.updateError)
    }

    updateSuccess = response => {
        console.log('Update success')
        this.props.history.push('/settings/config/manage')
    }

    updateError = response => {
        console.log('Update error')
        alert('Please fill in all fields')
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

    toggleChecked = evt => {
        if (evt.target.name === 'required') {
            this.setState({ checkboxState: !this.state.checkboxState })
        } else if (evt.target.name === 'secured') {
            this.setState({ securedCheckboxState: !this.state.securedCheckboxState })
        } else if (evt.target.placeholder === '') {
            this.setState({ booleanCheckboxState: !this.state.booleanCheckboxState })
        }
    }

    booleanCheckboxControl = () => {
        this.setState({ booleanCheckboxState: true })
    }

    cancelBack = () => {
        this.props.history.push('/settings/config/manage')
    }

    render() {
        return (
            <React.Fragment>
                <div className="card mb-4 col-lg-6 offset-lg-3">
                    <h6 className="card-header">
                        Edit Configuration
                    </h6>
                    <div className="card-body">
                        <EditConfigForm
                            configName={this.state.configName}
                            dataTypeId={this.state.dataTypeId}
                            configValue={this.state.configValue}
                            configKey={this.state.configKey}
                            description={this.state.description}
                            required={this.state.required}
                            secured={this.state.secured}
                            configTypeId={this.state.configTypeId}
                            modifiedBy={this.state.modifiedBy}
                            onChange={this.onChange}
                            updateConfigEntry={this.updateConfigEntry}
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
        )
    }
}

export default EditConfig;
