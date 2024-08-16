import { useState } from 'react';
import axios from 'axios';

function useRequest({ url, method, body, onSuccess }) {
  // console.log({ url, method, body });
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios({
        method: method,
        url,
        data: {
          ...body,
          ...props,
        },
      });
      console.log({ response_useRequest: response });
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      console.error({ useRequest_err: err });
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err?.response?.data?.errors?.map?.(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}

export default useRequest;
