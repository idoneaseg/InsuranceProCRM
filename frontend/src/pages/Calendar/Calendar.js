/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Stack, Typography } from '@mui/material';
import { apiget } from '../../service/api';
import AddTask from '../../components/task/AddTask';
import AddMeeting from '../../components/meeting/Addmeetings';
import AddCall from '../../components/call/Addcalls';
import ActionButtonTwo from '../../components/ActionButtonTwo';

const Calendar = () => {
  const [data, setData] = useState([]);
  const [openTask, setOpenTask] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [openCall, setOpenCall] = useState(false);
  const [userAction, setUserAction] = useState(null);

  const userid = useMemo(() => localStorage.getItem('user_id'), []);
  const userRole = useMemo(() => localStorage.getItem('userRole'), []);

  // ✅ Compactação de handlers
  const toggleTask = useCallback(() => setOpenTask((prev) => !prev), []);
  const toggleMeeting = useCallback(() => setOpenMeeting((prev) => !prev), []);
  const toggleCall = useCallback(() => setOpenCall((prev) => !prev), []);

  // ✅ Fetch genérico e memoizado
  const fetchData = useCallback(async () => {
    const urls = [
      userRole === 'admin' ? 'task/list' : `task/list/?createdBy=${userid}`,
      userRole === 'admin' ? 'meeting/list' : `meeting/list/?createdBy=${userid}`,
      userRole === 'admin' ? 'call/list' : `call/list/?createdBy=${userid}`,
    ];

    try {
      const [taskRes, meetingRes, callRes] = await Promise.all(urls.map((url) => apiget(url)));

      const tasks =
        taskRes?.data?.result?.map((item) => ({
          title: item.subject,
          start: item.startDate,
          end: item.endDate,
          textColor: item.textColor,
          backgroundColor: item.backgroundColor,
        })) || [];

      const meetings =
        meetingRes?.data?.result?.map((item) => ({
          title: item.subject,
          start: item.startDate,
          end: item.endDate,
        })) || [];

      const calls =
        callRes?.data?.result?.map((item) => ({
          title: item.subject,
          start: item.startDateTime,
        })) || [];

      setData([...tasks, ...meetings, ...calls]);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  }, [userid, userRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData, userAction]);

  const handleEventClick = useCallback((clickInfo) => {
    if (clickInfo.event.url) {
      clickInfo.jsEvent.preventDefault();
      window.open(clickInfo.event.url);
    }
  }, []);

  const renderEventContent = useCallback(
    (eventInfo) => (
      <>
        <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
      </>
    ),
    []
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Calendar</Typography>
        <ActionButtonTwo
          handleOpenTask={toggleTask}
          handleOpenMeeting={toggleMeeting}
          handleOpenCall={toggleCall}
        />
      </Stack>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="600px"
        events={data}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        buttonText={{
          today: 'Today',
          dayGridMonth: 'Month',
          timeGridWeek: 'Week',
          timeGridDay: 'Day',
        }}
      />

      {/* Modal Components */}
      <AddTask open={openTask} handleClose={toggleTask} setUserAction={setUserAction} lead="lead" contact="contact" />
      <AddMeeting open={openMeeting} handleClose={toggleMeeting} setUserAction={setUserAction} />
      <AddCall open={openCall} handleClose={toggleCall} setUserAction={setUserAction} />
    </Container>
  );
};

export default Calendar;