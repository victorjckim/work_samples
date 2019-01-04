import axios from "axios";

class FormService {
  static create(data, onSuccess, onError) {
    const url = "/api/form";
    const config = {
      method: "POST",
      data: data
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static createOrgForm(data, onSuccess, onError) {
    const url = "/api/orgform";
    const config = {
      method: "POST",
      data: data
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static selectByFormId(formId, onSuccess, onError) {
    const url = `/api/inputcontrols/${formId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static selectByFormIdPromise(formId) {
    const url = `/api/inputcontrols/${formId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    return axios(url, config);
  }

  static selectFormById(formId, onSuccess, onError) {
    const url = `/api/form/${formId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static selectFormByIdPromise(formId) {
    const url = `/api/form/${formId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    return axios(url, config);
  }

  static update(formId, data, onSuccess, onError) {
    const url = `/api/form/${formId}`;
    const config = {
      method: "PUT",
      data: data
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static getAll(onSuccess, onError) {
    const url = `/api/orgform`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static getFormByOrgId(orgId, onSuccess, onError) {
    const url = `/api/orgform/${orgId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static deleteOrgForm(data, onSuccess, onError) {
    const url = `/api/orgform`;
    const config = {
      method: "DELETE",
      data: data
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static formDataInsert(data, onSuccess, onError) {
    const url = `/api/formdata`;
    const config = {
      method: "POST",
      data: data
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static orderByFormId(userId) {
    const url = `/api/formdata/order/${userId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    return axios(url, config);
  }

  static selectUserData(userId, formId) {
    const url = `/api/formdata/${userId}/${formId}`;
    const config = {
      method: "GET"
    };
    axios.defaults.withCredentials = true;
    return axios(url, config);
  }

  static deleteFormData(userId, formId) {
    const url = `/api/formdata/${userId}/${formId}`;
    const config = {
      method: "DELETE"
    };
    axios.defaults.withCredentials = true;
    return axios(url, config);
  }
}

export default FormService;
