import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onFilterIngs } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {

    const timer = setTimeout(() => {

      if (filter === inputRef.current.value) {

        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;

        fetch('https://reacthooks-9fbff.firebaseio.com/ingredients.json' + query)
          .then((res) => {
            return res.json();
          })
          .then((res) => {

            const lddIngs = [];

            for (const key in res) {
              lddIngs.push({
                id: key,
                title: res[key].title,
                amount: res[key].amount
              });
            }

            onFilterIngs(lddIngs);

          });

      }

    }, 500);

    return () => {
      clearTimeout(timer);
    };

  }, [filter, onFilterIngs, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text{"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
