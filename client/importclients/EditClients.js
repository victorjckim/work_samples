import React from 'react';
import ImportClientsService from '../../services/ImportClientsService'
import RegExValidator from '../../utilities/RegExValidator'
import ConfirmModal from './ConfirmModal'

class EditClients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            clients: ""
        }
    }

    componentWillMount = () => {
        this.setState({ clients: this.props.clients })
    }

    onChange = evt => {
        const key = evt.target.id;
        const val = evt.target.value;
        let clientData = this.state.clients.data;
        clientData[key][evt.target.name] = val;
        var eachClient = {
            data: clientData
        }
        this.setState({
            ...this.state,
            clients: eachClient
        })
    }

    getFormattedTime = () => {
        let today = new Date();
        let y = today.getFullYear();
        // JavaScript months are 0-based.
        let m = today.getMonth() + 1;
        let d = today.getDate();
        let h = today.getHours();
        let mi = today.getMinutes();
        // let s = today.getSeconds();
        return y + "-" + m + "-" + d + "_" + h + "_" + mi;
    }

    unparseFile = () => {
        this.props.showLoadingModal()
        var Papa = require('papaparse/papaparse.min.js')
        let unparsedCsv = Papa.unparse(this.state.clients.data)
        let time = this.getFormattedTime()
        let link = document.createElement('a')
        link.id = 'download-csv'
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(unparsedCsv))
        link.setAttribute('download', `${this.props.fileName.slice(
            0, (this.props.fileName.length - 4))}${time}.csv`)
        document.body.appendChild(link)
        this.dataUrlToFile(link.href, link.download)
    }

    dataUrlToFile = (fileUrl, fileName) => {
        const url = fileUrl
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const data = new FormData()
                data.append('csvFile', blob, fileName)
                ImportClientsService.insert(data, this.props.uploadSuccess, this.props.uploadError)
            })
    }

    render() {
        let clientState = this.state.clients.data;
        if (clientState !== '') {
            var showClients = clientState.map(client => {
                let index = clientState.indexOf(client)
                return <tr key={clientState.indexOf(client) + 1}>
                    <td>
                        {clientState.indexOf(client) + 1}
                    </td>
                    <td>
                        <input id={clientState.indexOf(client)} type="text" name="FIRST NAME"
                            value={clientState[index]['FIRST NAME']} onChange={this.onChange}
                            className={clientState[index]['FIRST NAME'].length > 1 ? "form-control"
                                : "form-control error"} />
                    </td>
                    <td>
                        <input id={clientState.indexOf(client)} type="text" name="LAST NAME"
                            value={clientState[index]['LAST NAME']} onChange={this.onChange}
                            className={clientState[index]['LAST NAME'].length > 1 ? "form-control"
                                : "form-control error"} />
                    </td>
                    <td>
                        <input id={clientState.indexOf(client)} type="text" name="EMAIL ADDRESS"
                            value={clientState[index]['EMAIL ADDRESS']} onChange={this.onChange}
                            className={RegExValidator.validateEmail(
                                clientState[index]['EMAIL ADDRESS']) ? "form-control"
                                : "form-control error"} />
                    </td>
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
                            Note: Any fields marked in red are required. Please address all errors
                            and save the edited .csv file and import clients as needed.
                        </small>
                    </div>
                    <button
                        onClick={this.props.confirmModal}
                        className="btn btn-success"
                    >
                        Save
                    </button>
                    <button
                        onClick={this.props.cancelBack}
                        className="btn btn-clear ml-2"
                    >
                        Cancel
                    </button>
                </React.Fragment>
        }
        return (
            <React.Fragment>
                <h4 className="d-flex justify-content-between align-items-center py-2 mb-4">
                    <div className="font-weight-bold">Import Clients: CSV Editor</div>
                </h4>
                <hr className="border-light container-m--x my-0" />
                <table className="table table-bordered">
                    {tableHeader}
                    <tbody>
                        {showClients}
                    </tbody>
                </table>
                {sendInvites}
                <ConfirmModal unparseFile={this.unparseFile} />
            </React.Fragment>
        );
    }
}

export default EditClients;