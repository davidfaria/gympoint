import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { formatCurrency } from '~/util';
import api from '~/services/api';
import history from '~/services/history';
import {
  enrollmentsFailure,
  enrollmentsSearchSuccess,
  enrollmentsSaveSuccess,
  enrollmentsDeleteSuccess,
} from './actions';

function* searchEnrollments({ payload }) {
  try {
    const { term, page } = payload.data;

    const res = yield call(api.get, 'enrollments', {
      params: {
        term,
        page,
      },
    });

    const data = res.data.data.map(item => ({
      ...item,
      startDateFormatted: format(
        parseISO(item.start_date),
        "dd 'de' MMMM 'de' yyyy",
        {
          locale: pt,
        }
      ),
      endDateFormatted: format(
        parseISO(item.end_date),
        "dd 'de' MMMM 'de' yyyy",
        {
          locale: pt,
        }
      ),
    }));

    delete res.data.data;
    const pagination = res.data;

    yield put(enrollmentsSearchSuccess({ data, pagination }));
  } catch (error) {
    toast.error('Erro pesquisar matrículas!');
    yield put(enrollmentsFailure());
  }
}

function* saveEnrollment({ payload }) {
  const { id } = payload.data;
  if (id) {
    yield updateEnrollment(payload.data);
  } else {
    yield addEnrollment(payload.data);
  }
}

function* addEnrollment(data) {
  try {
    const dataFormatted = { ...data, price: formatCurrency(data.price) };

    const res = yield call(api.post, 'enrollments', dataFormatted);

    toast.success('Matrícula cadastrada com sucesso');
    yield put(enrollmentsSaveSuccess(res.data));

    history.push('/matriculas');
  } catch (error) {
    toast.error('Erro cadastrar matrícula!');
    yield put(enrollmentsFailure());
  }
}

function* updateEnrollment(data) {
  try {
    const dataFormatted = { ...data, price: formatCurrency(data.price) };
    const res = yield call(
      api.put,
      `enrollments/${dataFormatted.id}`,
      dataFormatted
    );

    toast.success('Matrícula Atualizada com sucesso');
    yield put(enrollmentsSaveSuccess(res.data));
  } catch (error) {
    toast.error('Erro atualizar matrícula!');
    yield put(enrollmentsFailure());
  }
}

function* deleteEnrollment({ payload }) {
  try {
    const { id } = payload;

    yield call(api.delete, `enrollments/${id}`);

    toast.success('Matrícula removida com sucesso');
    yield put(enrollmentsDeleteSuccess(id));
  } catch (error) {
    toast.error('Erro remover matrículas!');
    yield put(enrollmentsFailure());
  }
}

export default all([
  takeLatest('@enrollment/ENROLLMENT_SEARCH_REQUEST', searchEnrollments),
  takeLatest('@enrollment/ENROLLMENT_SAVE_REQUEST', saveEnrollment),
  takeLatest('@enrollment/ENROLLMENT_DELETE_REQUEST', deleteEnrollment),
]);
