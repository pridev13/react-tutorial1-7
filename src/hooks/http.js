import { useReducer, useCallback } from 'react';

const initState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (cState, action) => {

  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RES':
      return {
        ...cState,
        loading: false,
        error: null,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return {
        ...cState,
        loading: false,
        error: action.error
      };
    case 'CLEAR':
      return initState;
    default:
      throw new Error('Should not get here');
  }

}

const useHTTP = () => {

  const [http, httpDispatch] = useReducer(httpReducer, initState);

  const sendReq = useCallback((url, method, body, extra, reqIdentifier) => {

    httpDispatch({ type: 'SEND', identifier: reqIdentifier });

    fetch(url, {
      method: method,
      body: body,
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {

        httpDispatch({
          type: 'RES',
          responseData: res,
          extra: extra
        });

      })
      .catch((err) => {

        httpDispatch({
          type: 'ERROR',
          error: err.message
        });

      });

  }, []);

  const clear = useCallback(() => httpDispatch({type: 'CLEAR'}), []);

  return {
    loading: http.loading,
    error: http.error,
    data: http.data,
    sendReq: sendReq,
    extra: http.extra,
    reqID: http.identifier,
    clear: clear
  };

};

export default useHTTP;