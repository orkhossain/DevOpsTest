import genId from '@lib/gen-id';
import tasks from '@db/tasks-db';
import axios, { AxiosResponse, AxiosError } from 'axios';

const data = {
  title: "ciao",
  price: 20,
  description: "hello",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};


export const createProduct = (input) => {
  input = data;
  try {
    const data =   axios.post('http://localhost:4915/api/products/create', input)
    console.log(data)
  } catch (error) {
    console.log(error.message)
  }

};

export const getTaskById = (id) => tasks.find((task) => task.id === id);

export const getProducts = async () => {
  try {
    const data = await axios.get('http://localhost:4915/api/products/')
    return(data.data)
  } catch (error) {
    return(error.message)
  }
};
