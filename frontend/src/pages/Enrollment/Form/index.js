import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Form } from '@rocketseat/unform';
import { format, addMonths, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { MdDone } from 'react-icons/md';

import colors from '~/styles/colors';
import { Container, Row, Column } from '~/components/Grid';
import Title from '~/components/Title';
import { HeaderPage } from '~/components/HeaderPage/styles';
import { Controls } from '~/components/Controls/styles';
import ButtonLink from '~/components/ButtonLink';
import Button from '~/components/Button';
import { Panel } from '~/components/Panel/styles';
import Label from '~/components/Label';
import { FormGroup } from '~/components/FormGroup/styles';
import Select from '~/components/Select';
import SelectAsync from '~/components/SelectAsync';

import api from '~/services/api';

import { formatCurrencyBR, formatDatePicker } from '~/util';
import { enrollmentsSaveRequest } from '~/store/modules/enrollment/actions';
import Input from '~/components/Input';
import InputInfo from '~/components/InputInfo';

const schema = Yup.object().shape({
  student_id: Yup.number().required('O Aluno é obrigatório'),
  plan_id: Yup.number().required('O Plano é obrigatório'),
  start_date: Yup.date().required('A data de início é obrigatória'),
});

export default function EnrollmentForm() {
  const dispath = useDispatch();
  const { id } = useParams();

  const [enrollment, setEnrollment] = useState(null);
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentSelected, setStudentSelected] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [planSelected, setPlanSelected] = useState(null);
  const [endDateFormatted, setEndDateFormatted] = useState('');
  const [priceFormatted, setPriceFormatted] = useState('');

  async function loadEnrollment(id) {
    const res = await api.get(`enrollments/${id}`);
    const data = res.data;
    const startDateFormatted = formatDatePicker(data.start_date);

    setEnrollment({
      ...data,
      start_date: startDateFormatted,
    });

    setStartDate(startDateFormatted);
    setStudentSelected(data.student);
    setPlanSelected(data.plan);
  }

  async function loadPlans() {
    const res = await api.get('plans');
    const data = res.data.data.map(plan => ({
      ...plan,
      title: `${plan.title} - ${formatCurrencyBR(plan.price)} / ${
        plan.duration
      } (${plan.duration === 1 ? 'Mês' : 'Meses'})`,
    }));
    setPlans(data);
  }

  async function loadStudents(value) {
    const res = await api.get('students', {
      params: {
        name: value,
        page: 1,
        perPage: 10,
      },
    });

    const data = res.data.data;
    setStudents(data);

    return new Promise(resolve => {
      resolve(data);
    });
  }

  useEffect(() => {
    if (id) {
      loadEnrollment(id);
    }
  }, [id]);

  function handleSubmit(values) {
    const data = {
      ...values,
      id,
    };

    dispath(enrollmentsSaveRequest(data));
  }

  useMemo(() => {
    if (startDate && planSelected) {
      const parseStartDate = new Date(startDate);

      const end = addMonths(parseStartDate, planSelected.duration);

      setEndDateFormatted(
        format(end, 'dd/MM/yyyy', {
          locale: pt,
        })
      );
      const price = planSelected.duration * planSelected.price;
      setPriceFormatted(formatCurrencyBR(price));
    }
  }, [startDate, planSelected]);

  useEffect(() => {
    loadPlans();
    loadStudents();
  }, []);

  return (
    <Container>
      <HeaderPage>
        <Title>
          {id > 0 ? 'Edição de matrícula' : 'Cadastro de matrícula'}
        </Title>
        <Controls>
          <ButtonLink to="/matriculas" color={colors.second}>
            <MdArrowBack size={24} color="#fff" />
            <span>Voltar</span>
          </ButtonLink>
          <Button
            type="submit"
            label="Salvar"
            icon={<MdDone size={24} color="#fff" />}
            form="formEnrollment"
          ></Button>
        </Controls>
      </HeaderPage>

      <Panel>
        <Form
          id="formEnrollment"
          initialData={enrollment}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Label>ALUNO</Label>
          <SelectAsync
            placeholder="Digite o nome do aluno..."
            name="student_id"
            options={students}
            value={studentSelected}
            onChange={e => setStudentSelected(e)}
            asyncFunc={loadStudents}
          />
          <br />
          <Row>
            <Column mobile="12" desktop="3">
              <FormGroup>
                <Label>PLANO</Label>

                <Select
                  name="plan_id"
                  options={plans}
                  value={planSelected}
                  getOptionLabel={option => option.title}
                  onChange={e => setPlanSelected(e)}
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="3">
              <FormGroup>
                <Label>DATA DE INÍCIO</Label>
                <Input
                  name="start_date"
                  type="date"
                  onChange={e => setStartDate(parseISO(e.target.value))}
                />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="3">
              <FormGroup>
                <Label>DATA DE TÉRMINO</Label>
                <InputInfo value={endDateFormatted} />
              </FormGroup>
            </Column>
            <Column mobile="12" desktop="3">
              <FormGroup>
                <Label>VALOR FINAL</Label>
                <InputInfo value={priceFormatted} />
              </FormGroup>
            </Column>
          </Row>
        </Form>
      </Panel>
    </Container>
  );
}
