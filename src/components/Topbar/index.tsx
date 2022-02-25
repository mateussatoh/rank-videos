import styles from "./styles.module.scss";
import { Typography, TextField, Avatar, Button } from "@mui/material";
import ThumbsUpDownOutlinedIcon from "@mui/icons-material/ThumbsUpDownOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import {
   showNewVideoModal,
   showLoginModal,
   showSignupModal,
} from "../../app/store/actions";
import { connect, ConnectedProps } from "react-redux";

const mapDispatchToProps = {
   dispatchShowNewVideoModal: showNewVideoModal,
   dispatchShowLoginModal: showLoginModal,
   dispatchShowSignupModal: showSignupModal,
};
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
const connector = connect(undefined, mapDispatchToProps);

type AppProps = {} & ConnectedProps<typeof connector>;

function Topbar(props: AppProps) {
   const {
      dispatchShowNewVideoModal,
      dispatchShowLoginModal,
      dispatchShowSignupModal,
   } = props;
   const auth = getAuth();

   const [user, setUser] = useState(false);

   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setUser(true);
         } else {
            setUser(false);
         }
      });
   }, []);

   return (
      <div className={styles.container}>
         <div className={styles.group}>
            <ThumbsUpDownOutlinedIcon
               className={styles.icons}
               fontSize="large"
            />
            <Typography variant="h5">rankvideos</Typography>
         </div>
         {user ? (
            <div className={styles.group}>
               <Button
                  variant="contained"
                  endIcon={<AddCircleOutlinedIcon />}
                  onClick={() => {
                     dispatchShowNewVideoModal();
                  }}
               >
                  Adicionar vídeo
               </Button>
               <div
                  className={styles.logoutIcon}
                  onClick={() =>
                     signOut(auth).then(() => {
                        window.location.reload();
                     })
                  }
               >
                  <LogoutIcon fontSize="large" />
               </div>
            </div>
         ) : (
            <Button
               variant="contained"
               endIcon={<LoginIcon />}
               onClick={() => {
                  dispatchShowLoginModal();
               }}
            >
               Login
            </Button>
         )}
      </div>
   );
}

export default connector(Topbar);
