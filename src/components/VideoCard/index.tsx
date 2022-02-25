import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import styles from "./styles.module.scss";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Typography from "@mui/material/Typography";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Firebase from "../../lib/firebase";

function VideoCard({ id, thumb, title, votes, setVideoInFrame, voteType }) {
   const [user, setUser] = useState(false);
   const [userEmail, setUserEmail] = useState("false");

   const auth = getAuth();

   interface HTMLCustomElement extends HTMLElement {
      src?: string;
   }

   useEffect(() => {
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setUser(true);
            setUserEmail(user.email);
         } else {
            setUser(false);
         }
      });
   }, []);

   return (
      <div className={styles.card}>
         <CardMedia
            component="img"
            height="194"
            image={thumb}
            alt="Thumbnail"
            onClick={() => {
               setVideoInFrame(id);
               const iframeById: HTMLCustomElement =
                  document.getElementById("iframe");
               iframeById.src = iframeById.src;
            }}
         />
         <Typography className={styles.title} variant="body1">
            {title}
         </Typography>

         <CardActions disableSpacing>
            <IconButton
               aria-label="add to favorites"
               className={
                  voteType === "true" ? styles.greenSelected : styles.normal
               }
               onClick={async () => {
                  if (!user) {
                     toast.warn("Voce precisa estar logado para poder votar", {
                        position: toast.POSITION.BOTTOM_LEFT,
                     });
                  } else if (voteType === "true") {
                     await Firebase.sendNeutralVote(
                        id,
                        userEmail,
                        true,
                        votes,
                        title,
                        thumb
                     );
                     document.location.reload();
                  } else if (voteType === "false") {
                     await Firebase.sendUpVote(
                        id,
                        userEmail,
                        false,
                        votes,
                        title,
                        thumb
                     );
                     document.location.reload();
                  } else {
                     await Firebase.sendUpVote(
                        id,
                        userEmail,
                        true,
                        votes,
                        title,
                        thumb
                     );
                     document.location.reload();
                  }
               }}
            >
               <ThumbUpIcon />
            </IconButton>
            <IconButton
               aria-label="share"
               className={
                  voteType === "false" ? styles.redSelected : styles.normal
               }
               onClick={async () => {
                  if (!user) {
                     toast.warn("Voce precisa estar logado para poder votar", {
                        position: toast.POSITION.BOTTOM_LEFT,
                     });
                  } else if (voteType === "false") {
                     await Firebase.sendNeutralVote(
                        id,
                        userEmail,
                        false,
                        votes,
                        title,
                        thumb
                     );
                     document.location.reload();
                  } else if (voteType === "true") {
                     await Firebase.sendDownVote(
                        id,
                        userEmail,
                        true,
                        votes,
                        title,
                        thumb
                     );
                     document.location.reload();
                  } else {
                     await Firebase.sendDownVote(
                        id,
                        userEmail,
                        false,
                        votes,
                        title,
                        thumb
                     );
                     document.location.reload();
                  }
               }}
            >
               <ThumbDownIcon />
            </IconButton>
            <Typography className={styles.numeroVotos} variant="body1">
               Votos: {votes}
            </Typography>
         </CardActions>
         <ToastContainer />
      </div>
   );
}

export default VideoCard;
