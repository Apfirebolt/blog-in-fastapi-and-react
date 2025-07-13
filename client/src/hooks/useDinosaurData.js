// hooks/useDinosaurData.js
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import dinosaurReducer from '../reducers/dinosaurReducer'; // Adjust path as needed

const API_URL = 'https://dinosaur-facts-api.shultzlab.com/dinosaurs';

const initialDinosaurState = {
  dinosaurs: [],
  loading: false,
  error: null,
};

function useDinosaurData() {
  const [state, dispatch] = useReducer(dinosaurReducer, initialDinosaurState);

  useEffect(() => {
    const fetchDinosaurs = async () => {
      dispatch({ type: 'FETCH_DINOSAURS_REQUEST' });
      try {
        const response = await axios.get(API_URL);
        console.log('Dinosaurs fetched:', response.data);
        dispatch({ type: 'FETCH_DINOSAURS_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_DINOSAURS_FAILURE', payload: error.message });
      }
    };

    fetchDinosaurs();
  }, []); // Empty dependency array means this effect runs once on mount

  return state;
}

export default useDinosaurData;