import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';

import { Container } from '~/components/Grid';
import Title from '~/components/Title';
import { Table, Thead, Th, Tbody, Tr, Td } from '~/components/Table';
import InputSearch from '~/components/InputSearch';
import Loading from '~/components/Loading';
import { HeaderPage } from '~/components/HeaderPage/styles';
import { Controls } from '~/components/Controls/styles';
import colors from '~/styles/colors';

import {
  plansSearchRequest,
  plansDeleteRequest,
} from '~/store/modules/plan/actions';
import ButtonLink from '~/components/ButtonLink';
import Alert from '~/util/alert';
import { Panel } from '~/components/Panel/styles';
import NoResultFound from '~/components/NoResultFound';
import Pagination from '~/components/Pagination';
import PaginationInfo from '~/components/Pagination/PaginationInfo';
import ButtonLikeLink from '~/components/ButtonLikeLink';

export default function PlanList() {
  const [termSearch, setTermSearch] = useState('');
  const plans = useSelector(state => state.plan.plans);
  const loading = useSelector(state => state.plan.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(plansSearchRequest({ title: termSearch, page: 1 }));
  }, []); // eslint-disable-line

  function handleSearchMain(value, page = 1) {
    setTermSearch(value);
    dispatch(plansSearchRequest({ title: value, page }));
  }

  function handleDelete(id) {
    Alert.delete().then(result => {
      if (result.value) {
        dispatch(plansDeleteRequest(id));
      }
    });
  }

  function handleLoadPage(page) {
    // console.tron.log('load: ', page);
    handleSearchMain(termSearch, page);
  }

  return (
    <Container>
      <HeaderPage>
        <Title>Gerenciando planos</Title>
        <Controls>
          <ButtonLink to="/planos/new">
            <MdAdd size={24} color="#fff" title="Adicionar Novo Plano" />
            <span>Cadastrar</span>
          </ButtonLink>

          <InputSearch
            handleSearch={handleSearchMain}
            placeholder="Buscar plano"
          />
        </Controls>
      </HeaderPage>

      {loading ? (
        <Loading>Carregando...</Loading>
      ) : (
        <Panel>
          {plans.total === 0 ? (
            <NoResultFound />
          ) : (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th>TÍTULO</Th>
                    <Th>DURAÇÃO</Th>
                    <Th align="center">VALOR P/ MÊS</Th>
                    <Th colSpan="2" />
                  </Tr>
                </Thead>
                <Tbody>
                  {plans.data.map(plan => (
                    <Tr key={String(plan.id)}>
                      <Td>{plan.title}</Td>
                      <Td>
                        {plan.duration} {plan.monthString}
                      </Td>
                      <Td align="center">{plan.priceFormatted}</Td>
                      <Td>
                        <Link
                          style={{ color: colors.edit }}
                          to={`/planos/${plan.id}/edit`}
                        >
                          editar
                        </Link>
                      </Td>
                      <Td>
                        <ButtonLikeLink onClick={() => handleDelete(plan.id)}>
                          apagar
                        </ButtonLikeLink>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <br />
              <PaginationInfo
                page={plans.page}
                perPage={plans.perPage}
                totalPage={plans.totalPage}
                total={plans.total}
              />
              <br />
              {plans.totalPage > 1 && (
                <Pagination
                  page={plans.page}
                  totalPage={plans.totalPage}
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
