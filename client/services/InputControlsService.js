import axios from "axios";

class InputControlsService {
  static create(data) {
    const url = "/api/inputcontrols";
    const config = {
      method: "POST",
      data: data
    };
    axios.defaults.withCredentials = true;
    return axios(url, config);
  }

  static update(formId, data, onSuccess, onError) {
    const url = `/api/inputcontrols/${formId}`;
    const config = {
      method: "PUT",
      data: data
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }

  static delete(formId, onSuccess, onError) {
    const url = `/api/inputcontrols/${formId}`;
    const config = {
      method: "DELETE"
    };
    axios.defaults.withCredentials = true;
    axios(url, config)
      .then(onSuccess)
      .catch(onError);
  }
}

export default InputControlsService;
