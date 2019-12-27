import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { MdAdd, MdCheckCircle } from 'react-icons/md';

import colors from '~/styles/colors';
import { Container } from '~/components/Grid';
import { HeaderPage } from '~/components/HeaderPage/styles';
import { Controls } from '~/components/Controls/styles';
import Title from '~/components/Title';
import { Table, Thead, Th, Tbody, Tr, Td } from '~/components/Table';
import Loading from '~/components/Loading';

import {
  enrollmentsSearchRequest,
  enrollmentsDeleteRequest,
} from '~/store/modules/enrollment/actions';

import ButtonLink from '~/components/ButtonLink';
import Alert from '~/util/alert';
import { Panel } from '~/components/Panel/styles';
import NoResultFound from '~/components/NoResultFound';
import Pagination from '~/components/Pagination';
import PaginationInfo from '~/components/Pagination/PaginationInfo';
import ButtonLikeLink from '~/components/ButtonLikeLink';
import InputSearch from '~/components/InputSearch';

export default function EnrollmentList() {
  const [termSearch, setTermSearch] = useState('');
  const enrollments = useSelector(state => state.enrollment.enrollments);
  const pagination = useSelector(state => state.enrollment.pagination);
  const loading = useSelector(state => state.enrollment.loading);
  const dispatch = useDispatch();

  function loadEnrollments(term = termSearch, page = 1) {
    dispatch(enrollmentsSearchRequest({ term, page }));
  }

  useEffect(() => {
    loadEnrollments(termSearch, 1);
  }, []); // eslint-disable-line

  function handleSearchMain(value, page = 1) {
    setTermSearch(value);
    dispatch(enrollmentsSearchRequest({ term: value, page }));
  }

  function handleDelete(id) {
    Alert.delete().then(result => {
      if (result.value) {
        dispatch(enrollmentsDeleteRequest(id));
      }
    });
  }

  function handleLoadPage(page) {
    loadEnrollments(termSearch, page);
  }

  return (
    <Container>
      <HeaderPage>
        <Title>Gerenciando matrícula</Title>
        <Controls>
          <ButtonLink to="/matriculas/new">
            <MdAdd size={24} color="#fff" title="Adicionar Novo Enrollmento" />
            <span>Cadastrar</span>
          </ButtonLink>

          <InputSearch
            handleSearch={handleSearchMain}
            placeholder="Buscar aluno, plano"
          />
        </Controls>
      </HeaderPage>

      {loading ? (
        <Loading>Carregando...</Loading>
      ) : (
        <Panel>
          {pagination.total === 0 ? (
            <NoResultFound />
          ) : (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th>ALUNO</Th>
                    <Th align="center">PLANO</Th>
                    <Th align="center">INÍCIO</Th>
                    <Th align="center">TÉRMINO</Th>
                    <Th align="center">STATUS</Th>
                    <Th colSpan="2" />
                  </Tr>
                </Thead>
                <Tbody>
                  {enrollments.map(enrollment => (
                    <Tr key={String(enrollment.id)}>
                      <Td>{enrollment.student.name}</Td>
                      <Td align="center">
                        {enrollment.plan ? enrollment.plan.title : ''}
                      </Td>
                      <Td align="center">{enrollment.startDateFormatted}</Td>
                      <Td align="center">{enrollment.endDateFormatted}</Td>
                      <Td align="center">
                        {enrollment.status ? (
                          <MdCheckCircle size={23} color="#42CB59" />
                        ) : (
                          <MdCheckCircle size={23} color="#DDDDDD" />
                        )}
                      </Td>
                      <Td>
                        <Link
                          style={{ color: colors.edit }}
                          to={`/matriculas/${enrollment.id}/edit`}
                        >
                          editar
                        </Link>
                      </Td>
                      <Td>
                        <ButtonLikeLink
                          onClick={() => handleDelete(enrollment.id)}
                        >
                          apagar
                        </ButtonLikeLink>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <br />
              <PaginationInfo
                page={pagination.page}
                perPage={pagination.perPage}
                totalPage={pagination.totalPage}
                total={pagination.total}
              />
              <br />
              {pagination.totalPage > 1 && (
                <Pagination
                  page={pagination.page}
                  totalPage={pagination.totalPage}
                  align="center"
                  onLoadPage={handleLoadPage}
                />
              )}
            </>
          )}
        </Panel>
      )}
    </Container>
  );
}
