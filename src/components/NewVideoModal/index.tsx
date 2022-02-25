import { useState } from "react";
import Box from "@mui/material/Box";
import { Typography, TextField, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { connect, ConnectedProps } from "react-redux";
import { hideNewVideoModal } from "../../app/store/actions";
import { RootState } from "../../app/store/reducers";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import styles from "./styles.module.scss";
import axios from "axios";

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
   dispatchHideModal: hideNewVideoModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ModalProps = {} & ConnectedProps<typeof connector>;

function NewVideoModal(props: ModalProps) {
   const { dispatchHideModal, modal } = props;
   const handleClose = () => {
      dispatchHideModal();
   };

   const [url, setUrl] = useState("");

   function parseUrl(url) {
      var regExp =
         /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
   }

   async function handleSendVideo(res, id) {
      // Firebase.getAllVideos()
      await Firebase.sendVideo(
         res.data.items[0].snippet.title,
         getMaxRes(res.data.items[0].snippet.thumbnails),
         id
      );
      window.location.reload();
   }

   function getVideoData(id) {
      axios
         .get(
            `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyBYlcqpMKAjcGRuYcr_Ay5D6unPh-Ai6Bg&part=snippet,contentDetails,statistics,status`
         )
         .then((res) => handleSendVideo(res, id));
   }

   function getMaxRes(thumbnails) {
      let format;
      if (thumbnails.maxres) {
         format = thumbnails.maxres.url;
      } else if (thumbnails.standard) {
         format = thumbnails.standard.url;
      } else if (thumbnails.high) {
         format = thumbnails.high.url;
      } else {
         format = thumbnails.medium.url;
      }
      return format;
   }

   return (
      <>
         <Modal
            open={modal === "NewVideo" ? true : false}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box sx={style}>
               <div className={styles.title}>
                  <Typography
                     id="modal-modal-title"
                     variant="h6"
                     component="h2"
                  >
                     Envie um vídeo para nossa plataforma.
                  </Typography>
                  <CloseOutlinedIcon
                     fontSize="large"
                     onClick={() => {
                        handleClose();
                     }}
                     className={styles.closeButton}
                  />
               </div>
               <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Envie o link do vídeo do YouTube para adicionar.
               </Typography>
               <div className={styles.sendContainer}>
                  <TextField
                     className={styles.urlInput}
                     type="url"
                     id="filled-basic"
                     label="Url"
                     variant="filled"
                     onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                     variant="contained"
                     onClick={() => getVideoData(parseUrl(url))}
                  >
                     Enviar
                  </Button>
               </div>
            </Box>
         </Modal>
         <ToastContainer />
      </>
   );
}

export default connector(NewVideoModal);
