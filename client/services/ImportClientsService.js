import axios from 'axios'

class ImportClientsService {
    static insert(data, onSuccess, onError) {
        const url = 'api/importclients'
        const config = {
            method: 'POST',
            data: data
        }
        axios.defaults.withCredentials = true
        axios(url, config)
            .then(onSuccess)
            .catch(onError)
    }

    static selectAll(onSuccess, onError) {
        const url = 'api/importclients'
        const config = {
            method: 'GET',
        }
        axios.defaults.withCredentials = true
        axios(url, config)
            .then(onSuccess)
            .catch(onError)
    }

    static selectById(userId, onSuccess, onError) {
        const url = `api/importclients/${userId}`
        const config = {
            method: 'GET'
        }
        axios.defaults.withCredentials = true
        axios(url, config)
            .then(onSuccess)
            .catch(onError)
    }

    static sendInvites(fileName, onSuccess, onError) {
        const url = `api/importclients/getfile?SystemFileName=${fileName}`
        const config = {
            method: 'GET'
        }
        axios.defaults.withCredentilas = true
        axios(url, config)
            .then(onSuccess)
            .catch(onError)
    }

    static update(userId, data, onSuccess, onError) {
        const url = `api/importclients/${userId}`
        const config = {
            method: 'PUT',
            data: data
        }
        axios.defaults.withCredentials = true
        axios(url, config)
            .then(onSuccess)
            .catch(onError)
    }

    static delete(userId, onSuccess, onError) {
        const url = `api/importclients/${userId}`
        const config = {
            method: 'DELETE',
        }
        axios.defaults.withCredentials = true
        axios(url, config)
            .then(onSuccess)
            .catch(onError)
    }
}

export default ImportClientsService;