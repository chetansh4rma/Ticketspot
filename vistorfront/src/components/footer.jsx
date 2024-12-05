import React, { FC } from 'react';
import { Box, Grid, Container, Typography, Link as MuiLink, List, ListItem } from '@mui/material';

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
    <MuiLink
      href={path}
      underline="hover"
      sx={{
        display: 'block',
        color: '#6e7074',
        fontSize: '1.2rem',
        '&:hover': {
          color: '#faa935', // Hover color
        },
      }}
    >
      {label}
    </MuiLink>
  );
};

// Footer Section Title component
const FooterSectionTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <Typography component="h5" variant="h6" sx={{ color: '#0b2727', fontWeight: '700', mb: 2 }}>
      {title}
    </Typography>
  );
};

// Social Link Item component
const SocialLinkItem: FC<{ item: { name: string; link: string; icon: string } }> = ({ item }) => (
  <Box
    component="li"
    sx={{
      display: 'inline-block',
      color: 'primary.contrastText',
      mr: 2,
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
    <Box sx={{ mb: 2 }}>
      <List sx={{ display: 'flex', padding: 0 }}>
        {socialLinks.map((item) => (
          <SocialLinkItem key={item.name} item={item} />
        ))}
      </List>
    </Box>
  );
};

// Main Footer component
const Footer: FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        paddingTop: '70px',
        paddingBottom: '30px',
        backgroundColor: 'white', // Replace with your theme color
        color: '#000', // Ensure text is visible against the background
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
                Monument Ticket Booking
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Explore, discover, and book tickets to iconic monuments around the world.
              </Typography>
              <SocialLinks />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <FooterSectionTitle title="Menu" />
            {pageMenu.map(({ label, path }, index) => (
              <NavigationItem key={index + path} label={label} path={path} />
            ))}
          </Grid>
          <Grid item xs={12} md={3}>
            <FooterSectionTitle title="Company" />
            {companyMenu.map(({ label, path }, index) => (
              <NavigationItem key={index + path} label={label} path={path} />
            ))}
          </Grid>
          <Grid item xs={12} md={3}>
            <FooterSectionTitle title="Connect" />
            <Typography variant="body2" sx={{ mb: 2 }}>
              Follow us on social media for the latest updates and offers.
            </Typography>
            <SocialLinks />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            &copy; {new Date().getFullYear()} Monument Ticket Booking. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
