import axios from 'axios'

const baseUrl = 'https://phonebookapivlads.fly.dev/api/persons';


const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

export default { getAll, create, update, remove }


/*//obsolete
const getAll = () => {
  return fetch(baseUrl)
    .then(response => response.json());
};

const create = (newPerson) => {
  return fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPerson)
  }).then(response => response.json());
};

const update = (id, updatedPerson) => {
    return fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPerson)
    }).then(response => response.json());
  };

const remove = (id) => {
    return fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    }).then(response => response.json());
  };

export default {
  getAll,
  create,
  update,
  remove
};
*/