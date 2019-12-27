import React, { useState, useEffect, useMemo } from 'react';
import sockeio from 'socket.io-client';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification,
} from './styles';
import api from '~/services/api';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [helpOrders, setHelpOrders] = useState([]);

  const hasUnAnswered = useMemo(
    () => !!helpOrders.find(help => help.answer_at === null),
    [helpOrders]
  );

  async function loadNotifications() {
    const res = await api.get('notifications');

    const data = res.data.map(notification => ({
      ...notification,
      createdAtFormatted: formatRelative(
        parseISO(notification.createdAt),
        new Date(),
        {
          locale: pt,
        }
      ),
    }));

    setHelpOrders(data);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const socket = useMemo(
    () =>
      sockeio(process.env.REACT_APP_BASE_URL, {
        query: {},
      }),
    []
  );

  useEffect(() => {
    socket.on('HELP_ORDER_CREATE_NOTIFICATION', helpOrder => {
      const data = {
        ...helpOrder,
        createdAtFormatted: formatRelative(
          parseISO(helpOrder.createdAt),
          new Date(),
          {
            locale: pt,
          }
        ),
      };
      setHelpOrders([...helpOrders, data]);
    });
  }, [socket, helpOrders]);

  function handleToggleVisible() {
    setVisible(!visible);
  }

  return (
    <Container>
      <Badge
        onClick={handleToggleVisible}
        hasUnAnswered={hasUnAnswered}
        total={helpOrders.length}
      >
        <MdNotifications color="#7915c1" size={24} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {helpOrders.map(help => (
            <Notification key={String(help.id)}>
              <p>{help.question}</p>
              <time>
                {help.createdAtFormatted} - {help.student.name}
              </time>
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
