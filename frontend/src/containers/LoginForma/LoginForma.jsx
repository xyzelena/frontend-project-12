import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';

import { useFormik } from 'formik';

import useAuth from '../../hooks/useAuth.js';

import axiosApi from '../../api/axiosApi.js';

import ROUTES from '../../utils/routes.js';

const LoginForma = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const refUsername = useRef();
  const refPassword = useRef();
  const refFeedback = useRef();

  const { logIn, logOut } = useAuth();

  const [validAuth, setValidAuth] = useState(null);
  const [error, setError] = useState('');

  const networkErrCode = 401;

  useEffect(() => {
    refUsername.current.focus();
  }, []);

  useEffect(() => {
    if (validAuth === false) {
      refUsername.current.focus();
      refUsername.current.classList.add('is-invalid');
      refPassword.current.classList.add('is-invalid');
      refFeedback.current.style.display = 'block';
    }

    if (validAuth === true) {
      refUsername.current.classList.remove('is-invalid');
      refPassword.current.classList.remove('is-invalid');

      refUsername.current.classList.add('is-valid');
      refPassword.current.classList.add('is-valid');

      refFeedback.current.style.display = 'none';
    }
  }, [validAuth]);

  useEffect(() => {
    if (validAuth) navigate(ROUTES.home, { replace: false });
  }, [validAuth, navigate]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (valuesForm) => {
      setError('');

      try {
        const response = await axiosApi.post(ROUTES.login, valuesForm);
        //console.log(response.data); // => { token: ..., username: 'admin' }
        if (response.data.token) {
          logIn(response.data);
          setValidAuth(true);
        }
      } catch (err) {
        setValidAuth(false);
        setError(t('loginForma.invalidCredentials'));

        if (err.response && err.response.status === networkErrCode) {
          logOut();
        }
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <input
          name="username"
          id="username"
          autoComplete="username"
          required
          placeholder={t('loginForma.login')}
          type="text"
          className="form-control"
          onChange={formik.handleChange}
          value={formik.values.username}
          ref={refUsername}
        />
      </div>

      <div className="form-group">
        <input
          name="password"
          id="password"
          autoComplete="current-password"
          required
          placeholder={t('loginForma.password')}
          type="password"
          className="form-control"
          onChange={formik.handleChange}
          value={formik.values.password}
          ref={refPassword}
        />

        <div className="invalid-feedback" ref={refFeedback}>
          {error}
        </div>
      </div>

      <button type="submit">{t('loginForma.btnSubmit')}</button>
    </Form>
  );
};

export default LoginForma;
