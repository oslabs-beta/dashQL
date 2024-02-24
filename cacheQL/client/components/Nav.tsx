import "../App.css";
import {
  createTheme,
  ThemeProvider,
  Avatar,
  Button,
  Toolbar,
  Box,
  AppBar,
  Link,
} from "@mui/material";
import logo from "../assets/github-logo.png";
import dashQL_Logo from "../assets/dashQL_Logo.png";
import { useState } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#162345",
    },
  },
});



export default function Nav(currentPage:string) {
  console.log('in nav', currentPage.currentPage)

  
  
  return (
    <nav>
      <div id="left-nav">
        <a href="/"><img src={dashQL_Logo}/></a>
      </div>
      <div id="right-nav">
        <a href="/" id={currentPage.currentPage == "Home" ? "pageStyle" : ""}>Home</a>
        <a href="/demo" id={currentPage.currentPage == "Demo" ? "pageStyle" : ""}>Demo</a>
        <a href="/docs" id={currentPage.currentPage == "Docs" ? "pageStyle" : ""}>Docs</a>
      </div>
    </nav>

    /* // material ui nav
    // <div className="nav">
    //   <ThemeProvider theme={theme}>
    //     <Box
          sx={{
            bgcolor: "primary.main",
            position: "sticky",
            top: "0",
            display: "flex",
          }}
        >
          <AppBar
            position="static"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Link href="/about">
              <Avatar
                alt="Example Alt"
                src={dashQL_Logo}
                sx={{
                  width: "130px",
                  marginTop: "15px",
                  alignItems: "center",
                  justifyContent: "end",
                  marginLeft: "200px",
                }}
              />
            </Link>
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
              <Button href="/demo" color="inherit">
                Demo
              </Button>
              <Button href="/docs" color="inherit">
                Docs
              </Button>
              <Avatar
                alt="Example Alt"
                src={logo}
                sx={{
                  width: "25px",
                  height: "auto",
                  marginLeft: "10px",
                  marginBottom: "1px",
                }}
              />
            </Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
    </div> */
  );
}
