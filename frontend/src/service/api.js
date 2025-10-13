/* eslint-disable dot-notation */
/* eslint-disable consistent-return */

import axios from "axios";
import { toast } from "react-toastify";

// 🌍 Define a URL base flexível (Render ou local)
const BASE_URL =
  process.env.REACT_APP_API_URL || "https://insuranceprocrm.onrender.com";

export const apiget = async (path) => {
  try {
    const response = await axios.get(`${BASE_URL}/${path}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.status === 200 && response.data.message) {
      toast.success(response.data.message);
    }

    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  }
};

export const apipost = async (path, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/${path}`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.status === 200 && response.data.message) {
      toast.success(response.data.message);
    }

    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
  }
};

export const apiput = async (path, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/${path}`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.status === 200 && response.data.message) {
      toast.success(response.data.message);
    }

    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
  }
};

export const apidelete = async (path) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${path}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.status === 200 && response.data.message) {
      toast.success(response.data.message);
    }

    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
  }
};

export const deleteManyApi = async (path, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/${path}`, data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.status === 200 && response.data.message) {
      toast.success(response.data.message);
    }

    return response;
  } catch (error) {
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    }
  }
};