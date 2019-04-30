import React from 'react';
import { TextInput } from 'react-materialize';

export default function Filter({onChange}) {

  let tempValue = '';

  const onValidate = event => {
    const inputVal = event.target.value.toLowerCase().trim();
    if (inputVal !== '' && /^[a-zA-Z]+$/.test(inputVal)) {
      event.target.classList.remove('invalid');
      tempValue = inputVal;
      const timeout = setTimeout(() => {
        if (tempValue === inputVal){
          onChange(inputVal);
          clearTimeout(timeout);
        }
      }, 500);
    } else {
      if (inputVal.length <= tempValue.length) {
        event.target.classList.remove('invalid');
        tempValue = inputVal;
        const timeout = setTimeout(() => {
          if (tempValue === inputVal) {
            onChange(inputVal);
            clearTimeout(timeout);
          }
        }, 500);
      } else {
        event.target.classList.add('invalid');
      }
    }
  };

  return (
    <TextInput
      placeholder={'Search by name...'}
      onChange={onValidate}
      validate={true}
      error="Specify only letters"
    />
  );
}