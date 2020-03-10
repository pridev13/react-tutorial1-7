import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHTTP from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {

  const { onFilterIngs } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  const { loading, error, data, sendReq, clear } = useHTTP();

  useEffect(() => {

    const timer = setTimeout(() => {

      if (filter === inputRef.current.value) {

        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;

        sendReq(
          'https://reacthooks-9fbff.firebaseio.com/ingredients.json' + query,
          'GET'
        );

      }

    }, 500);

    return () => {
      clearTimeout(timer);
    };

  }, [filter, inputRef, sendReq]);

  useEffect(() => {

    if (!loading && !error && data) {

      const lddIngs = [];

      for (const key in data) {
        lddIngs.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }

      onFilterIngs(lddIngs);

    }

  }, [loading, error, data, onFilterIngs]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
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
