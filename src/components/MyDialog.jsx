import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";

function MyDialog(props) {
    return (
        <Dialog className="myDialog" open={props.open} onClose={props.handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}

export default MyDialog;