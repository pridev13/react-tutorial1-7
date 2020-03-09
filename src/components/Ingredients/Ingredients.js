import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [ings, setIngs] = useState([]);

  const addIngHandler = (ing) => {

    setIngs((prevState) => [
      ...prevState,
      {
        id: Math.random().toString(),
        ...ing
      }
    ]);

  }

  return (
    <div className="App">
      <IngredientForm onAddIng={addIngHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ings}
          onRemoveItem={() => { }}
        />
      </section>
    </div>
  );

}

export default Ingredients;
