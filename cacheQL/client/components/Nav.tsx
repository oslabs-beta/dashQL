import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider, Avatar } from "@mui/material";
import logo from "./github-logo.png";



const theme = createTheme({
  palette: {
    primary: {
      main: "#162345",
    },
  },
});

export default function Nav() {
  return (
    <div className="nav">
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "primary.main",
          maxWidth: "false",
          position: "sticky",
          top: "0",
          display: "flex",
        }}
      >
        <AppBar position="static" sx={{ display: "flex" }}>
          <Toolbar
            sx={{
              alignItems: "center",
              justifyContent: "end",
              marginRight: "200px",
            }}
          >
            <Button href="/" color="inherit">
              About
            </Button>
            <Button href="/demo" color="inherit" >
            Demo
            </Button>
            <Button href="/docs" color="inherit" >
            Docs
            </Button>
            <Avatar
              alt="Example Alt"
              src={logo}
              sx={{ width: "25px", height: "auto", marginLeft: "10px" }}
            />
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
    </div>
  );
}
