import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { login } from '../features/user/userSlice';

function SignUpForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(r => {
      if (r.ok) {
        r.json().then(r => dispatch(login(r)));
        history.push('/');
      } else {
        r.json().then(r => setErrors(r.errors));
      }
    });
  }

  function handleFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div className='field'>
        <label htmlFor='username'>Username </label>
        <input
          type='text'
          id='username'
          name='username'
          value={formData.username}
          onChange={handleFormData}
        />
      </div>
      <div className='field'>
        <label htmlFor='password'>Password </label>
        <input
          type='password'
          id='password'
          name='password'
          value={formData.password}
          onChange={handleFormData}
        />
      </div>
      <div className='field'>
        <label htmlFor='password-confirmation'>Password confirmation </label>
        <input
          type='password'
          id='password-confirmation'
          name='password_confirmation'
          value={formData.password_confirmation}
          onChange={handleFormData}
        />
      </div>
      {errors.map(error => (
        <p>{error}</p>
      ))}
      <button className='Submit-button' type='submit'>
        Submit
      </button>
    </form>
  );
}

export default SignUpForm;
