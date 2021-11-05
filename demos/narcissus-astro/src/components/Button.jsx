import React from 'react';

const Button = ({ children }) => {
  function handleOnClick() {
    alert('Hello');
  }

  return <button onClick={handleOnClick}>{children}</button>;
};

export { Button as default };
