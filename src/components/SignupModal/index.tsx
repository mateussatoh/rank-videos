import { useState } from "react";
import Box from "@mui/material/Box";
import { Typography, TextField, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { connect, ConnectedProps } from "react-redux";
import { hideSignupModal, showLoginModal } from "../../app/store/actions";
import { RootState } from "../../app/store/reducers";
import axios from "axios";
import GoogleButton from "react-google-button";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import Firebase from "../../lib/firebase";

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
   dispatchHideModal: hideSignupModal,
   dispatchShowLoginModal: showLoginModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ModalProps = {} & ConnectedProps<typeof connector>;

function SignupModal(props: ModalProps) {
   const { dispatchHideModal, dispatchShowLoginModal, modal } = props;
   const handleClose = () => {
      dispatchHideModal();
   };

   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [email, setEmail] = useState("");

   function checkPassword() {
      return Boolean(
         password !== confirmPassword && password && confirmPassword
      );
   }

   return (
      <>
         <Modal
            open={modal === "SignupModal" ? true : false}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box sx={style}>
               <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component="h1" variant="h5">
                  Criar conta
               </Typography>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        required
                        fullWidth
                        id="email"
                        label="Seu melhor email"
                        name="email"
                        autoComplete="email"
                        onChange={(event) => {
                           setEmail(event.target.value);
                        }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        error={checkPassword()}
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        autoComplete="new-password"
                        onChange={(event) => setPassword(event.target.value)}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        error={checkPassword()}
                        helperText={
                           checkPassword() ? "As senhas são diferentes" : ""
                        }
                        required
                        fullWidth
                        name="password"
                        label="Repita sua senha"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={(event) =>
                           setConfirmPassword(event.target.value)
                        }
                     />
                  </Grid>
               </Grid>

               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={async () => {
                     if (!checkPassword()) {
                        await Firebase.createUserEmailPass(email, password);
                        dispatchHideModal();
                     } else {
                        toast.warn("As senahs precisam ser iguais.", {
                           position: toast.POSITION.BOTTOM_LEFT,
                        });
                     }
                  }}
               >
                  Criar conta
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
                           dispatchShowLoginModal();
                        }}
                     >
                        Já tem uma conta? Faça o login
                     </Link>
                  </Grid>
               </Grid>
            </Box>
         </Modal>
         <ToastContainer />
      </>
   );
}

export default connector(SignupModal);
