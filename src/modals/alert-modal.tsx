"use client";
import { closeAlert } from "@/redux/slices/alert-slice";
import { RootState } from "@/redux/store";
import { success, info, warning, error } from "@/theme/colors";
import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

type Severity = "error" | "success" | "info" | "warning" | undefined;

const AlertModal = () => {
  const dispatch = useDispatch();
  const alertData = useSelector((state: RootState) => state.alert);

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeAlert());
  };

  return (
    <Snackbar
      open={alertData.isOpen}
      autoHideDuration={4000}
      onClose={handleCloseAlert}
      message={alertData.message}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      className="z-[500000]"
    >
      {alertData.isOpen ? (
        <Alert
          severity={alertData.type as Severity}
          onClose={handleCloseAlert}
          variant="filled"
          sx={{
            width: "auto",
            minWidth: "200px",
            borderRadius: "16px",
            paddingY: "8px",
            "&.MuiAlert-filledSuccess": {
              backgroundColor: `${success.main} !important`,
              color: success.lightest,
            },
            "&.MuiAlert-filledError": {
              backgroundColor: `${error.main} !important`,
              color: error.lightest,
            },
            "&.MuiAlert-filledInfo": {
              backgroundColor: `${info.main} !important`,
              color: info.lightest,
            },
            "&.MuiAlert-filledWarning": {
              backgroundColor: `${warning.main} !important`,
              color: warning.lightest,
            },
          }}
        >
          {alertData.message}
        </Alert>
      ) : (
        <div></div>
      )}
    </Snackbar>
  );
};

export default AlertModal;
