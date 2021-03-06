import {takeLatest, call, put, all} from 'redux-saga/effects';
import {Alert} from 'react-native';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';
import api from '~/services/api';
import {checkinSucess, checkinFailure, listCheckinSucess} from './actions';

function* listCheckins({payload}) {
  try {
    const {shouldRefresh} = payload;

    const res = yield call(
      api.get,
      `/students/${payload.student_id}/checkins`,
      {
        params: {
          page: payload.page,
        },
      },
    );

    const data = res.data.data.map(checkin => ({
      ...checkin,
      dateFormatted: formatRelative(parseISO(checkin.createdAt), new Date(), {
        locale: pt,
      }),
    }));

    const checkins = data;
    delete res.data.data;
    const pagination = res.data;

    yield put(listCheckinSucess({checkins, pagination, shouldRefresh}));
  } catch (error) {
    Alert.alert('Error', 'Erro ao listar os check-ins');
    yield put(checkinFailure());
  }
}

function* checkin(payload) {
  try {
    const res = yield call(api.post, `/students/${payload.id}/checkins`);

    Alert.alert('Sucesso', 'Checkin efetivado com sucesso!');

    const data = res.data;
    const dateFormatted = formatRelative(parseISO(data.createdAt), new Date(), {
      locale: pt,
    });

    yield put(checkinSucess({...data, dateFormatted}));
  } catch (error) {
    Alert.alert('Atenção', 'Você já realizou o limit máximo de checkins');
    yield put(checkinFailure());
  }
}

export default all([
  takeLatest('@checkin/LIST_CHECKIN_REQUEST', listCheckins),
  takeLatest('@checkin/CHECKIN_REQUEST', checkin),
]);
