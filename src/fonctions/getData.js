import axios from "axios";

const VITE_URL_VERIFY_TOKEN = import.meta.env.VITE_URL_VERIFY_TOKEN;
const VITE_URL_LOGIN = import.meta.env.VITE_URL_LOGIN;
export const VITE_URL_BASE = import.meta.env.VITE_URL_BASE;


export async function getData(URL, methode = 'get', data = null) {
    let configuration = {
        method: methode,
        url: URL,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        data: data
    };

    try {
        return await axios.request(configuration);
    } catch (error) {
        // CORRECTION : Propager l'erreur complète pour avoir accès à error.response
        console.error('Erreur getData:', error.response?.data || error.message);
        throw error; // Important : propager l'erreur
    }
}
export async function getDataLogin( data = null) {
    let response;
    let configuration = {
        method: 'post',
        url: VITE_URL_LOGIN,
        headers: {
            "Accept": "application/json"
           // "Authorization": "Bearer " + localStorage.getItem('token'),

        },
        data: data
    };
    try {
        response = await axios.request(configuration);
    } catch (error) {
        console.error(error.message);
    }

    return response
}

export async function getDataToken(token) {
    let response;
    let configuration = {
        method: 'post',
        url: VITE_URL_VERIFY_TOKEN,
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token ,
        },
        data: token
    };
    try {
        response = await axios.request(configuration);
    } catch (error) {
        console.error(error.message);
    }

    return response
}

export async function getDataDelete(URL, data) {
    let response;
    let configuration = {
        method: 'post',
        url: URL,
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            // 'Access-Control-Request-Headers': 'application/json',
            // 'Accept-Encoding': 'multipart/encrypted',
            // ' Access-Control-Allow-Origin': '*'
        },
        data: data
    };
    try {
        response = await axios.request(configuration);
    } catch (error) {
        console.error(error.message);
    }

    return response
}


export async function postData(URL, data) {
    let response;
    let configuration = {
        method: 'post',
        url: URL,
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            // 'Access-Control-Request-Headers': 'application/json',
            // 'Accept-Encoding': 'multipart/encrypted',
            // ' Access-Control-Allow-Origin': '*'
        },
        data: data
    };
    try {
        response = await axios.request(configuration);
    } catch (error) {
        console.error(error.message);
    }

    return response
}

export async function getDesc(URL ) {
    let response;
    let configuration = {
        url: URL,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    try {
        response = await axios.request(configuration);
    } catch (error) {
        console.error(error.message);
    }

    return response
}