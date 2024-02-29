
import "../App.css";
import logo from "../assets/github-logo.png";
import dashQL_Logo from "../assets/dashQL_Logo.png";

interface currentPageProps {
  currentPage: string
}
=======
import '../App.css';
import {
  createTheme,
  ThemeProvider,
  Avatar,
  Button,
  Toolbar,
  Box,
  AppBar,
  Link,
} from '@mui/material';
import logo from '../assets/github-logo.png';
import dashQL_Logo from '../assets/dashQL_Logo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#162345',
    },
  },
});

