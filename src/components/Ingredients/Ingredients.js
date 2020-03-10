import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';
import useHTTP from '../../hooks/http';

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

const Ingredients = () => {

  const [ings, dispatch] = useReducer(ingReducer, []);
  const { loading, error, data, sendReq, extra, reqID, clear } = useHTTP();

  useEffect(() => {

    if (!loading && !error && reqID === 'DEL_ING') {
      dispatch({
        type: 'DEL_ING',
        id: extra
      });
    }
    else if (!loading && !error && reqID === 'ADD_ING') {

      dispatch({
        type: 'ADD_ING',
        ing: {
          id: data.name,
          ...extra
        }
      });

    }

  }, [data, extra, reqID, loading, error]);

  const onFilterHandler = useCallback((ings) => {

    dispatch({
      type: 'SET_ING',
      ings: ings
    });

  }, []);

  const addIngHandler = useCallback((ing) => {

    sendReq(
      'https://reacthooks-9fbff.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ing),
      ing,
      'ADD_ING'
    );

  }, [sendReq]);

  const removeIngHandler = useCallback((id) => {

    sendReq(
      `https://reacthooks-9fbff.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'DEL_ING'
    );

  }, [sendReq]);

  const ingList = useMemo(() => {
    return (<IngredientList
      ingredients={ings}
      onRemoveItem={removeIngHandler}
    />
    )
  }, [ings, removeIngHandler]);

  return (
    <div className="App">

      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIng={addIngHandler}
        loading={loading}
      />

      <section>
        <Search onFilterIngs={onFilterHandler} />
        {ingList}
      </section>
    </div>
  );

}

export default Ingredients;
