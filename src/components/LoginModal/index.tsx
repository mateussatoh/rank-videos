import { useState } from "react";
import Box from "@mui/material/Box";
import { Typography, TextField, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { connect, ConnectedProps } from "react-redux";
import { hideLoginModal, showSignupModal } from "../../app/store/actions";
import { RootState } from "../../app/store/reducers";
import axios from "axios";

import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import Firebase from "../../lib/firebase";

import GoogleButton from "react-google-button";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 500,
   bgcolor: "background.paper",
   borderRadius: "10px",
   boxShadow: 24,
   p: 4,
};

const mapStateToProps = (state: RootState) => ({
   modal: state.modal.modal,
});

const mapDispatchToProps = {
   dispatchHideModal: hideLoginModal,
   dispatchShowSignupModal: showSignupModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ModalProps = {} & ConnectedProps<typeof connector>;

function LoginModal(props: ModalProps) {
   const { dispatchHideModal, dispatchShowSignupModal, modal } = props;
   const handleClose = () => {
      dispatchHideModal();
   };

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   return (
      <>
         <Modal
            open={modal === "Login" ? true : false}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box sx={style}>
               <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component="h1" variant="h5">
                  Fazer login
               </Typography>
               <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Seu melhor email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(event) => {
                     setEmail(event.target.value);
                  }}
               />
               <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => {
                     setPassword(event.target.value);
                  }}
               />
               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={async () => {
                     await Firebase.login(email, password);
                     dispatchHideModal();
                  }}
               >
                  Login
               </Button>
               <GoogleButton
                  onClick={async () => {
                     await Firebase.googleOAuth();
                     dispatchHideModal();
                  }}
               />
               <Grid container justifyContent="flex-end">
                  <Grid item>
                     <Link
                        href="#"
                        variant="body2"
                        onClick={() => {
                           dispatchShowSignupModal();
                        }}
                     >
                        Não tem uma conta? Crie uma
                     </Link>
                  </Grid>
               </Grid>
            </Box>
         </Modal>
         <ToastContainer />
      </>
   );
}

export default connector(LoginModal);
