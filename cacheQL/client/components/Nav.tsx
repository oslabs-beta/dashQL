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
import dashQL_Logo from "../assets/dashQL_logo.png";

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
            // maxWidth: '100em',
            position: "sticky",
            top: "0",
            display: "flex",
          }}
        >
          {/* <Toolbar
            sx={{
              alignItems: "center",
              justifyContent: "start",
              marginRight: "200px",
            }}
          >
<<<<<<< HEAD
            <div>
            <h1 className="nav-title"><strong>dashQL</strong></h1>
            </div>
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
              sx={{ width: "25px", height: "auto", marginLeft: "10px" , marginBottom: "1px"}}
            />
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
=======
            <Link href="/about">
              <Avatar
                alt="Example Alt"
                src={dashQL_Logo}
                sx={{
                  width: "130px",
                  marginTop: "10px",
                  alignItems: "center",
                  justifyContent: "end",
                  // marginLeft: "100px",
                }}
              />
            </Link>
          </Toolbar> */}

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
>>>>>>> 45c186f8eed79089ec6a777965ef44969461e8a9
    </div>
  );
}
