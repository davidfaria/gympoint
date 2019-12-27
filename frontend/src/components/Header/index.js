import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import colors from '~/styles/colors';

import logo from '~/assets/logo-header.png';

import { Container, Content, Profile, Menu } from './styles';
import { signOut } from '~/store/modules/auth/actions';
import Notifications from '../Notifications';

export default function Header() {
  const profile = useSelector(state => state.user.profile);
  const dispacth = useDispatch();

  function handleSignOut() {
    dispacth(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <Link to="/">
            <img src={logo} alt="Gympoint" />
          </Link>

          <ul>
            <li>
              <Menu activeStyle={{ color: colors.linkActive }} to="/alunos">
                ALUNOS
              </Menu>
            </li>
            <li>
              <Menu activeStyle={{ color: colors.linkActive }} to="/planos">
                PLANOS
              </Menu>
            </li>
            <li>
              <Menu activeStyle={{ color: colors.linkActive }} to="/matriculas">
                MATRÍCULAS
              </Menu>
            </li>
            <li>
              <Menu activeStyle={{ color: colors.linkActive }} to="/help">
                PEDIDOS DE AUXÍLIO
              </Menu>
            </li>
          </ul>
        </nav>

        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>{profile.name}</strong>
              <span onClick={handleSignOut}>sair do sistema</span>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
