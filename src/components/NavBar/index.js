import * as React from 'react';
import {useNavigate} from "react-router-dom";
import MuiLink from "@mui/material/Link";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from "@mui/icons-material/Person";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/auth';
import WalletButton from '../WalletButton';

export function Logo({ image, link }) {
  return (
    <Box component={MuiLink} href={link}>
      <Box component="img" src={image} width="64px" />
    </Box>
  );
}

const NavBar = ({logo, pages, components}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [profileMenu, setProfileMenu] = React.useState();
  const navigate = useNavigate();
  const dispath = useDispatch();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{paddingLeft:"0"}}>
        <Toolbar disableGutters sx={{justifyContent:"space-between"}}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages?.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">test</Typography>
                </MenuItem>
            </Menu>
          </Box>
          {pages && <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages?.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>}
          {
            components?.map((c, i) => (
            <Box key={`nav-components-${i}`}>
              {c}
            </Box>))
          }
          {/* <IconButton
            aria-haspopup="true"
            color="white"
            aria-controls="profile-menu"
            onClick={e=>setProfileMenu(e.currentTarget)}
          >
            <UserIcon/>
          </IconButton> */}
          <WalletButton />
          <Menu
            id="profile-menu"
            open={Boolean(profileMenu)}
            anchorEl={profileMenu}
            onClose={()=>setProfileMenu(null)}
            disableAutoFocusItem
          >
            <MenuItem 
              onClick={()=>{
                  dispath(logout());
                  navigate("/");
                }
              }
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
