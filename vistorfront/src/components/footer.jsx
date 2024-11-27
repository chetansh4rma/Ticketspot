import React, { FC } from 'react';
import { Box, Grid, Container, Typography, Link as MuiLink } from '@mui/material';

// Define the navigation structure for the Monument Ticket Booking App
const pageMenu = [
  { label: 'Home', path: '#' },
  { label: 'Monuments', path: '#' },
  { label: 'My Tickets', path: '#' },
  { label: 'Contact Us', path: '#' },
];

const companyMenu = [
  { label: 'Privacy Policy', path: '#' },
  { label: 'Terms & Conditions', path: '#' },
  { label: 'FAQ', path: '#' },
  { label: 'Support', path: '#' },
];

// Define the social links
const socialLinks = [
  {
    name: 'Instagram',
    link: '#',
    icon: '/images/icons/instagram.svg',
  },
  {
    name: 'YouTube',
    link: '#',
    icon: '/images/icons/youtube.svg',
  },
  {
    name: 'Twitter',
    link: '#',
    icon: '/images/icons/twitter.svg',
  },
  {
    name: 'Facebook',
    link: '#',
    icon: '/images/icons/facebook.svg',
  },
];

// Navigation Item component
const NavigationItem: FC<{ label: string; path: string }> = ({ label, path }) => {
  return (
    <MuiLink href={path} underline="hover" sx={{ display: 'block', mb: 1, color: 'primary.contrastText' }}>
      {label}
    </MuiLink>
  );
};

// Footer Section Title component
const FooterSectionTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
      <Typography component="p" variant="h5" sx={{ color: 'primary.contrastText', fontWeight: '700' }}>
        {title}
      </Typography>
    </Box>
  );
};

// Social Link Item component
const SocialLinkItem: FC<{ item: { name: string; link: string; icon: string } }> = ({ item }) => (
  <Box
    component="li"
    sx={{
      display: 'inline-block',
      color: 'primary.contrastText',
      mr: 0.5,
    }}
  >
    <MuiLink
      target="_blank"
      sx={{
        lineHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        color: 'inherit',
        '&:hover': {
          backgroundColor: 'secondary.main',
        },
        '& img': {
          fill: 'currentColor',
          width: 22,
          height: 'auto',
        },
      }}
      href={item.link}
    >
      <img src={item.icon} alt={`${item.name} icon`} />
    </MuiLink>
  </Box>
);

// Social Links component
const SocialLinks: FC = () => {
  return (
    <Box sx={{ ml: -1 }}>
      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          lineHeight: 0,
          borderRadius: 3,
          listStyle: 'none',
        }}
      >
        {socialLinks.map((item) => (
          <SocialLinkItem key={item.name} item={item} />
        ))}
      </Box>
    </Box>
  );
};

// Main Footer component
const Footer: FC = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: 'primary.main', py: { xs: 6, md: 10 }, color: 'primary.contrastText' }}>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5}>
            <Box sx={{ width: { xs: '100%', md: 360 }, mb: { xs: 3, md: 0 } }}>
              <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
                Monument Ticket Booking
              </Typography>
              <Typography variant="subtitle1" sx={{ letterSpacing: 1, mb: 2 }}>
                Explore, discover, and book tickets to iconic monuments around the world.
              </Typography>
              <SocialLinks />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FooterSectionTitle title="Menu" />
                {pageMenu.map(({ label, path }, index) => (
                  <NavigationItem key={index + path} label={label} path={path} />
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <FooterSectionTitle title="Company" />
                {companyMenu.map(({ label, path }, index) => (
                  <NavigationItem key={index + path} label={label} path={path} />
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <FooterSectionTitle title="Connect" />
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.contrastText' }}>
                  Follow us on social media for the latest updates and offers.
                </Typography>
                <SocialLinks />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
