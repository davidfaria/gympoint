import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '~/services/api';
import history from '~/services/history';
import {
  studentsFailure,
  studentsSearchSuccess,
  studentsSaveSuccess,
  studentsDeleteSuccess,
} from './actions';

function* searchStudents({ payload }) {
  try {
    const { name, page } = payload.data;

    const res = yield call(api.get, 'students', {
      params: {
        name: name || '',
        page,
      },
    });

    yield put(studentsSearchSuccess(res.data));
  } catch (error) {
    toast.error('Erro pesquisar alunos!');
    yield put(studentsFailure());
  }
}

function* saveStudent({ payload }) {
  const { id } = payload.data;

  // console.tron.log('ID: ', id);

  if (id) {
    yield updateStudent(payload.data);
  } else {
    yield addStudent(payload.data);
  }
}

function* addStudent(data) {
  // console.tron.log('Add student: ', data);
  try {
    const res = yield call(api.post, 'students', data);

    toast.success('Aluno cadastrado com sucesso');
    yield put(studentsSaveSuccess(res.data));

    history.push('/alunos');
  } catch (error) {
    toast.error('Erro cadastrar aluno!');
    yield put(studentsFailure());
  }
}

function* updateStudent(data) {
  // console.tron.log('Update student: ', data);
  try {
    const res = yield call(api.put, `students/${data.id}`, data);

    toast.success('Aluno Atualizado com sucesso');
    yield put(studentsSaveSuccess(res.data));
  } catch (error) {
    toast.error('Erro atualizar aluno!');
    yield put(studentsFailure());
  }
}

function* deleteStudent({ payload }) {
  try {
    const { id } = payload;

    yield call(api.delete, `students/${id}`);

    toast.success('Aluno removido com sucesso');
    yield put(studentsDeleteSuccess(id));
  } catch (error) {
    toast.error('Erro remover alunos!');
    yield put(studentsFailure());
  }
}

export default all([
  takeLatest('@student/STUDENT_SEARCH_REQUEST', searchStudents),
  takeLatest('@student/STUDENT_SAVE_REQUEST', saveStudent),
  takeLatest('@student/STUDENT_DELETE_REQUEST', deleteStudent),
]);
