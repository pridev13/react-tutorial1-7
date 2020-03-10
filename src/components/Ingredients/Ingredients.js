import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';

const ingReducer = (cState, action) => {

  switch (action.type) {
    case 'SET_ING':
      return action.ings;
    case 'ADD_ING':
      return [...cState, action.ing];
    case 'DEL_ING':
      return cState.filter((ing) => ing.id !== action.id);
    default:
      throw new Error('Should not get here');
  }

}

const httpReducer = (cState, action) => {

  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RES':
      return { loading: false, error: null };
    case 'ERROR':
      return { loading: false, error: action.error };
    default:
      throw new Error('Should not get here');
  }

}

const Ingredients = () => {

  const [ings, dispatch] = useReducer(ingReducer, []);
  const [http, httpDispatch] = useReducer(httpReducer, { loading: false, error: null });

  useEffect(() => {
    console.log('Ingredients updated')
  }, [ings]);

  const onFilterHandler = useCallback((ings) => {

    dispatch({
      type: 'SET_ING',
      ings: ings
    });

  }, []);

  const addIngHandler = (ing) => {

    httpDispatch({
      type: 'SEND'
    });

    fetch('https://reacthooks-9fbff.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {

        httpDispatch({
          type: 'RES'
        });

        return res.json();

      })
      .then((res) => {

        dispatch({
          type: 'ADD_ING',
          ing: {
            id: res.name,
            ...ing
          }
        });

      })
      .catch((err) => {

        httpDispatch({
          type: 'ERROR',
          error: err.message
        });

      });

  }

  const removeIngHandler = (id) => {

    httpDispatch({
      type: 'SEND'
    });

    fetch(`https://reacthooks-9fbff.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    })
      .then((res) => {

        httpDispatch({
          type: 'RES'
        });

        dispatch({
          type: 'DEL_ING',
          id: id
        });

      })
      .catch((err) => {
        httpDispatch({
          type: 'ERROR',
          error: err.message
        });
      });

  }

  const clearError = () => {

    httpDispatch({
      type: 'RES'
    });
    
  }

  return (
    <div className="App">

      {http.error && <ErrorModal onClose={clearError}>{http.error}</ErrorModal>}

      <IngredientForm
        onAddIng={addIngHandler}
        loading={http.loading}
      />

      <section>
        <Search onFilterIngs={onFilterHandler} />
        <IngredientList
          ingredients={ings}
          onRemoveItem={removeIngHandler}
        />
      </section>
    </div>
  );

}

export default Ingredients;
