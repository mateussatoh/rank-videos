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
import Image from "next/image";

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
         <img
            height="194"
            width="340"
            src={thumb}
            onClick={() => {
               setVideoInFrame(id);
               const iframeById: HTMLCustomElement =
                  document.getElementById("iframe");
               iframeById.src = iframeById.src;
            }}
         />

         <Typography
            className={styles.title}
            variant="body1"
            onClick={() => {
               setVideoInFrame(id);
               const iframeById: HTMLCustomElement =
                  document.getElementById("iframe");
               iframeById.src = iframeById.src;
            }}
         >
            {title}
         </Typography>
         <div className={styles.actions}>
            <div>
               <IconButton
                  aria-label="add to favorites"
                  onClick={async () => {
                     if (!user) {
                        toast.warn(
                           "Voce precisa estar logado para poder votar",
                           {
                              position: toast.POSITION.BOTTOM_LEFT,
                           }
                        );
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
                  <ThumbUpIcon
                     className={
                        voteType === "true"
                           ? styles.greenSelected
                           : styles.normal
                     }
                  />
               </IconButton>
               <IconButton
                  aria-label="share"
                  onClick={async () => {
                     if (!user) {
                        toast.warn(
                           "Voce precisa estar logado para poder votar",
                           {
                              position: toast.POSITION.BOTTOM_LEFT,
                           }
                        );
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
                  <ThumbDownIcon
                     className={
                        voteType === "false"
                           ? styles.redSelected
                           : styles.normal
                     }
                  />
               </IconButton>
            </div>
            <Typography
               className={votes > 0 ? styles.greenSelected : styles.redSelected}
               variant="h6"
               onClick={() => {
                  setVideoInFrame(id);
                  const iframeById: HTMLCustomElement =
                     document.getElementById("iframe");
                  iframeById.src = iframeById.src;
               }}
            >
               Votos: {votes}
            </Typography>
         </div>
         <ToastContainer />
      </div>
   );
}

export default VideoCard;
