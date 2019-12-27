import React, { useEffect, useState } from 'react';
import { Form } from '@rocketseat/unform';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { MdDone } from 'react-icons/md';
import * as Yup from 'yup';

import { Container, Row, Column } from '~/components/Grid';
import Title from '~/components/Title';
import { HeaderPage } from '~/components/HeaderPage/styles';
import { Controls } from '~/components/Controls/styles';

import Input from '~/components/Input';
import ButtonLink from '~/components/ButtonLink';
import Button from '~/components/Button';

import colors from '~/styles/colors';
import { Panel } from '~/components/Panel/styles';
import Label from '~/components/Label';
import { FormGroup } from '~/components/FormGroup/styles';

import { studentsSaveRequest } from '~/store/modules/student/actions';
import api from '~/services/api';

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é Obrigatório'),
  age: Yup.number()
    .min(0, 'A idade deve ser maior ou igual 0 ano')
    .max(150, 'A idade deve ser menor ou igual 150 anos')
    .required('A idade é obrigatória'),
  weight: Yup.number().required('O peso é obrigatório'),
  feet_tall: Yup.number().required('A Altura é obrigatória'),
});

export default function StudentForm() {
  const { id } = useParams();
  const [student, setStudent] = useState({});
  const dispath = useDispatch();

  function handleSubmit(data) {
    dispath(studentsSaveRequest({ ...data, id }));
  }

  useEffect(() => {
    if (id) {
      async function loadStudent() {
        const res = await api.get(`students/${id}`);
        setStudent(res.data);
      }

      loadStudent();
    }
  }, [id]);

  return (
    <Container>
      <HeaderPage>
        <Title>{id > 0 ? 'Edição de aluno' : 'Cadastro de aluno'}</Title>
        <Controls>
          <ButtonLink to="/alunos" color={colors.second}>
            <MdArrowBack size={24} color="#fff" />
            <span>Voltar</span>
          </ButtonLink>
          <Button
            type="submit"
            label="Salvar"
            icon={<MdDone size={24} color="#fff" />}
            form="formStudent"
          ></Button>
        </Controls>
      </HeaderPage>

      <Panel>
        <Form
          id="formStudent"
          initialData={student}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Input name="id" type="hidden" />
          <Label>NOME COMPLETO</Label>
          <Input name="name" placeholder="Digite seu nome completo" />

          <Label>E-MAIL</Label>
          <Input
            name="email"
            type="email"
            placeholder="Digite seu endereço de e-Mail"
          />
          <Row>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>IDADE</Label>
                <Input type="number" name="age" placeholder="Sua Idade" />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>PESO (em kg)</Label>
                <Input
                  step="0.01"
                  type="number"
                  name="weight"
                  placeholder="Seu Peso"
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>ALTURA</Label>
                <Input
                  step="0.01"
                  type="number"
                  name="feet_tall"
                  placeholder="Sua Altura"
                />
              </FormGroup>
            </Column>
          </Row>
        </Form>
      </Panel>
    </Container>
  );
}
