import React, { useEffect, useState, useMemo } from 'react';
import * as Yup from 'yup';
import { Form } from '@rocketseat/unform';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { MdDone } from 'react-icons/md';

import { Container, Row, Column } from '~/components/Grid';
import Title from '~/components/Title';
import { HeaderPage } from '~/components/HeaderPage/styles';
import { Controls } from '~/components/Controls/styles';

import ButtonLink from '~/components/ButtonLink';
import Input from '~/components/Input';
import Button from '~/components/Button';

import colors from '~/styles/colors';
import { Panel } from '~/components/Panel/styles';
import Label from '~/components/Label';
import InputInfo from '~/components/InputInfo';
import { FormGroup } from '~/components/FormGroup/styles';

import { plansSaveRequest } from '~/store/modules/plan/actions';
import api from '~/services/api';
import InputCurrency from '~/components/InputCurrency';
import { formatCurrency, formatCurrencyBR } from '~/util';

const schema = Yup.object().shape({
  title: Yup.string().required('O título do plano é obrigatório'),
  duration: Yup.number()
    .min(1, 'A duração dever ser no mínimo 1 mês')
    .max(60, 'A duração dever ser no máximo 60 meses')
    .required('A duração em meses é obrigatório'),
  price: Yup.string().required('O preço é obrigatório'),
});

export default function PlanForm() {
  const dispath = useDispatch();
  const { id } = useParams();
  const [plan, setPlan] = useState({});

  const totalPrice = useMemo(() => {
    let total = 0.0;

    if (plan.duration && plan.price) {
      total = parseInt(plan.duration, 10) * formatCurrency(plan.price);
    }
    return formatCurrencyBR(total);
  }, [plan.duration, plan.price]);

  function handleSubmit(data) {
    dispath(plansSaveRequest({ ...data, id }));
    // resetForm();
  }

  useEffect(() => {
    if (id) {
      async function loadPlan() {
        const res = await api.get(`plans/${id}`);
        setPlan({
          ...res.data,
          price: formatCurrencyBR(res.data.price, false),
        });
      }

      loadPlan();
    }
  }, [id]);

  return (
    <Container>
      <HeaderPage>
        <Title>{id > 0 ? 'Edição de plano' : 'Cadastro de plano'}</Title>
        <Controls>
          <ButtonLink to="/planos" color={colors.second}>
            <MdArrowBack size={24} color="#fff" />
            <span>Voltar</span>
          </ButtonLink>
          <Button
            type="submit"
            label="Salvar"
            icon={<MdDone size={24} color="#fff" />}
            form="formPlan"
          ></Button>
        </Controls>
      </HeaderPage>

      <Panel>
        <Form
          id="formPlan"
          initialData={plan}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Input name="id" type="hidden" />
          <Label>TÍTULO DO PLANO</Label>
          <Input
            name="title"
            placeholder="Plano Ouro"
            onChange={e => setPlan({ ...plan, name: e.target.value })}
          />
          <Row>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>DURAÇÃO (em meses)</Label>
                <Input
                  type="number"
                  name="duration"
                  placeholder="12 meses"
                  onChange={e => setPlan({ ...plan, duration: e.target.value })}
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>PREÇO MENSAL</Label>
                <InputCurrency
                  name="price"
                  value={plan.price}
                  onChange={e => setPlan({ ...plan, price: e })}
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="4">
              <FormGroup>
                <Label>PREÇO TOTAL</Label>
                <InputInfo value={totalPrice} />
              </FormGroup>
            </Column>
          </Row>
        </Form>
      </Panel>
    </Container>
  );
}
