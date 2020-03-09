import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [ings, setIngs] = useState([]);

  useEffect(() => {
    console.log('Ingredients updated')
  }, [ings]);

  const onFilterHandler = useCallback((ings) => {
    setIngs(ings);
  }, []);

  const addIngHandler = (ing) => {

    fetch('https://reacthooks-9fbff.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {

        setIngs((prevState) => [
          ...prevState,
          {
            id: res.name,
            ...ing
          }
        ]);

      });


  }

  const removeIngHandler = (id) => {

    setIngs((prevState) => {

      return prevState.filter((ing) => ing.id !== id);

    });

  }

  return (
    <div className="App">
      <IngredientForm onAddIng={addIngHandler} />

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
