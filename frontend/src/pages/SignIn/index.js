import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from '@rocketseat/unform';
import * as Yup from 'yup';

import { Container } from './styles';
import logo from '~/assets/logo.png';

import { signInRequest } from '~/store/modules/auth/actions';
import Label from '~/components/Label';
import Input from '~/components/Input';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é Obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

// import { Container } from './styles';

export default function SignIn() {
  const dispath = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  function handleSubmit({ email, password }) {
    // console.tron.log(data);
    dispath(signInRequest(email, password));
  }

  return (
    <Container>
      <img src={logo} alt="GoBarber" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Label>SEU E-MAIL</Label>
        <Input name="email" type="email" placeholder="Seu e-mail" />

        <Label>SUA SENHA</Label>
        <Input name="password" type="password" placeholder="Sua Senha" />

        <button type="submit">
          {loading ? 'Carregando...' : 'Entrar no sistema'}
        </button>
      </Form>
    </Container>
  );
}
