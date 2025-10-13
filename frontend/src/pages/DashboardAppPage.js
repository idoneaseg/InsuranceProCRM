/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Iconify from '../components/iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { apiget } from '../service/api';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const [totals, setTotals] = useState({
    lead: 0,
    contact: 0,
    policy: 0,
    event: 0,
  });

  const userid = useMemo(() => localStorage.getItem('user_id'), []);
  const userRole = useMemo(() => localStorage.getItem('userRole'), []);

  // ✅ Função genérica para buscar estatísticas em paralelo
  const fetchStats = useCallback(async () => {
    const endpoints = {
      lead: userRole === 'admin' ? 'lead/list' : `lead/list/?createdBy=${userid}`,
      contact: userRole === 'admin' ? 'contact/list' : `contact/list/?createdBy=${userid}`,
      policy: userRole === 'admin' ? 'policy/list' : `policy/list/?createdBy=${userid}`,
      event: userRole === 'admin' ? 'task/list' : `task/list/?createdBy=${userid}`,
    };

    try {
      const [leadRes, contactRes, policyRes, eventRes] = await Promise.all([
        apiget(endpoints.lead),
        apiget(endpoints.contact),
        apiget(endpoints.policy),
        apiget(endpoints.event),
      ]);

      setTotals({
        lead: leadRes?.data?.total_recodes || 0,
        contact: contactRes?.data?.total_recodes || 0,
        policy: policyRes?.data?.total_recodes || 0,
        event: eventRes?.data?.total_recodes || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }, [userid, userRole]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <Helmet>
        <title>Dashboard | InsurancePro CRM</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Widgets */}
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Leads" total={totals.lead} icon="ic:baseline-leaderboard" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Contacts" total={totals.contact} color="info" icon="fluent:book-contacts-24-filled" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Policies" total={totals.policy} color="warning" icon="ic:baseline-policy" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tasks" total={totals.event} color="error" icon="mdi:events" />
          </Grid>

          {/* Website Visits */}
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={Array.from({ length: 11 }, (_, i) => `0${i + 1}/01/2003`)}
              chartData={[
                { name: 'Team A', type: 'column', fill: 'solid', data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30] },
                { name: 'Team B', type: 'area', fill: 'gradient', data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43] },
                { name: 'Team C', type: 'line', fill: 'solid', data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39] },
              ]}
            />
          </Grid>

          {/* Current Visits */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          {/* Conversion Rates */}
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          {/* Current Subject */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={Array.from({ length: 6 }, () => theme.palette.text.secondary)}
            />
          </Grid>

          {/* News Update */}
          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={Array.from({ length: 5 }).map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobDescriptor(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          {/* Order Timeline */}
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={Array.from({ length: 5 }).map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          {/* Traffic by Site */}
          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                { name: 'Facebook', value: 323234, icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} /> },
                { name: 'Google', value: 341212, icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} /> },
                { name: 'LinkedIn', value: 411213, icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} /> },
                { name: 'Twitter', value: 443232, icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} /> },
              ]}
            />
          </Grid>

          {/* Tasks */}
          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}