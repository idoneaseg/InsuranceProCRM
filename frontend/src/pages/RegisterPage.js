import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import { RegisterForm } from '../sections/auth/register';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Register | InsurancePro CRM </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            {/* ✅ Imagem convertida para .webp e com carregamento lazy */}
            <img
              src="/assets/illustrations/illustration_register.webp"
              alt="register"
              loading="lazy"
            />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign up to InsurancePro CRM
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Do you have an account?{' '}
              <Link to="/login">Sign In</Link>
            </Typography>

            <RegisterForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}