import React from 'react';
import ImportClientsService from '../../services/ImportClientsService';
import ErrorModal from './ErrorModal'
import EditClients from './EditClients'
import LoadingAnimation from './LoadingAnimation'
import './ImportClients.css'

class ImportClientsInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null,
            clients: "",
            editing: false,
        }
    }

    handleSelectedFile = evt => {
        console.log(evt.target.files[0])
        this.setState({
            selectedFile: evt.target.files[0]
        })
    }

    parseFile = evt => {
        if (this.state.selectedFile === null || !this.state.selectedFile) {
            this.setState({ clients: "" })
            alert('No file selected')
            return
        } else if (!this.state.selectedFile.name.match(/.(csv)/)) {
            this.setState({ clients: "" })
            alert('Not a .csv file')
            return
        }
        evt.preventDefault()
        let Papa = require('papaparse/papaparse.min.js')
        Papa.parse(this.state.selectedFile, {
            download: true,
            header: true,
            skipEmptyLines: true,
            beforeFirstChunk: chunk => {
                var rows = chunk.split(/\r\n|\r|\n/);
                var headings = rows[0].split(',').map(item => {
                    return item.trim()
                })
                rows[0] = headings;
                return rows.join("\r\n");
            },
            complete: this.updateData
        })
    }

    updateData = results => {
        if (results.meta.fields[0] !== 'FIRST NAME'
            || results.meta.fields[2] !== 'LAST NAME'
            || results.meta.fields[3] !== 'EMAIL ADDRESS') {
            this.modalElement.click()
        } else {
            this.setState({ clients: results })
        }
    }

    sendInvites = () => {
        this.showLoadingModal()
        if (this.state.selectedFile === null || !this.state.selectedFile) {
            this.setState({ clients: "" })
            alert('No file selected')
        } else {
            const data = new FormData()
            data.append('file', this.state.selectedFile, this.state.selectedFile.name)
            ImportClientsService.insert(data, this.uploadSuccess, this.uploadError)
        }
    }

    uploadSuccess = response => {
        ImportClientsService.selectById(response.data.item, this.selectSuccess, this.selectError)
    }

    uploadError = () => {
        this.closeLoadingModal()
        alert('Upload Failed: Please try again')
    }

    selectSuccess = response => {
        ImportClientsService.sendInvites(response.data.item.systemFileName,
            this.sendInvitesSuccess,
            this.sendInvitesError
        )
    }

    selectError = () => {
        this.closeLoadingModal()
        alert('Select by ID Failed')
    }

    sendInvitesSuccess = response => {
        console.log(response)
        this.closeLoadingModal()
        this.props.history.push('/keys/list')
    }

    sendInvitesError = response => {
        this.closeLoadingModal()
        alert('Send Invites Error')
        console.log(response)
    }

    editClick = () => {
        this.setState({ editing: true })
    }

    cancelBack = () => {
        this.setState({
            selectedFile: null,
            clients: '',
            editing: false
        })
    }

    confirmModal = () => {
        this.modalConfirm.click()
    }

    showLoadingModal = () => {
        this.showLoading.click()
    }

    closeLoadingModal = () => {
        this.closeLoading.click()
    }

    render() {
        let loadingModal = <div
            className="modal fade show"
            id="modals-loading"
            data-backdrop="static"
            data-keyboard="false"
        >
            <div className="modal-dialog">
                <form className="modal-content">
                    <button
                        type="button"
                        className="modalShow"
                        data-toggle="modal"
                        data-target="#modals-loading"
                        ref={modal => this.showLoading = modal}
                    >
                        Show
                    </button>
                    <button
                        type="button"
                        className="close modalShow"
                        data-dismiss="modal"
                        aria-label="Close"
                        ref={modal => this.closeLoading = modal}
                    >
                        Close
                    </button>
                </form>
            </div>
            <LoadingAnimation />
        </div>
        if (this.state.clients !== "") {
            var showClients = this.state.clients.data.map(client => {
                return <tr key={this.state.clients.data.indexOf(client) + 1}>
                    <td>{this.state.clients.data.indexOf(client) + 1}</td>
                    <td>{client['FIRST NAME'] === '' ? <font color='red'>MISSING</font>
                        : client['FIRST NAME']}</td>
                    <td>{client['LAST NAME'] === '' ? <font color='red'>MISSING</font>
                        : client['LAST NAME']}</td>
                    <td>{client['EMAIL ADDRESS'] === '' ? <font color='red'>MISSING</font>
                        : client['EMAIL ADDRESS']}</td>
                </tr>
            })
            var tableHeader =
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                    </tr>
                </thead>
            var sendInvites =
                <React.Fragment>
                    <div className="mb-2">
                        <small>
                            Note: Any entries with fields marked as "MISSING" from the selected
                            .csv file will not receive a register invite. Please enter the required
                            information to prevent this from occurring. However, if you acknowledge
                            the missing data and would like to send the invites anyway, please
                            click "Send Invites".
                        </small>
                    </div>
                    <button
                        onClick={this.sendInvites}
                        className="btn btn-success"
                    >
                        Send Invites
                    </button>
                    <button
                        onClick={this.editClick}
                        className="btn btn-clear ml-2"
                    >
                        Edit
                    </button>
                </React.Fragment>
        }
        if (!this.state.editing) {
            return (
                <React.Fragment>
                    <h4 className="d-flex justify-content-between align-items-center py-2 mb-4">
                        <div className="font-weight-bold">Import Clients</div>
                    </h4>
                    <hr className="border-light container-m--x my-0" />
                    <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                        <input type="file" onChange={this.handleSelectedFile} />
                        <button
                            type="button"
                            onClick={this.parseFile}
                            className="btn btn-primary"
                        >
                            Import
                        </button>
                    </div>
                    <table className="table table-bordered">
                        {tableHeader}
                        <tbody>
                            {showClients}
                        </tbody>
                    </table>
                    {sendInvites}
                    <ErrorModal />
                    {loadingModal}
                    <button
                        type="button"
                        className="btn btn-primary modalShow"
                        data-toggle="modal"
                        data-target="#modals-default"
                        ref={modal => this.modalElement = modal}
                    >
                        Show
                    </button>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <EditClients
                        clients={this.state.clients}
                        cancelBack={this.cancelBack}
                        confirmModal={this.confirmModal}
                        fileName={this.state.selectedFile.name}
                        showLoadingModal={this.showLoadingModal}
                        uploadSuccess={this.uploadSuccess}
                        uploadError={this.uploadError}
                    />
                    <button
                        type="button"
                        className="btn btn-primary modalConfirm"
                        data-toggle="modal"
                        data-target="#modals-confirm"
                        ref={modal => this.modalConfirm = modal}
                    >
                    </button>
                    {loadingModal}
                </React.Fragment>
            )
        }
    }
}

export default ImportClientsInput;