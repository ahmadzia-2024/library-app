"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "white", // Set background color to white
          position: "relative", // Set position to relative
          boxShadow: "none", // Optional: Remove box shadow
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "black", // Set text color to black for contrast
        },
      },
    },
  },
});

const Header = () => {
  return (
    <div className="mb-10 shadow-md bg-white h-16 fixed w-full">
      <ThemeProvider theme={theme}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                width: "85%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Link href={""} className="bg-black p-1 rounded-md px-4">
                Logout
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </div>
  );
};

export default Header;
