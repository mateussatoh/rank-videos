import { initializeApp } from "firebase/app";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
   signInWithPopup,
   GoogleAuthProvider,
   signInWithEmailAndPassword,
} from "firebase/auth";

import { hideSignupModal } from "../app/store/actions";

const provider = new GoogleAuthProvider();
class Firebase {
   app: any;
   db: any;
   auth: any;
   constructor() {
      this.app = initializeApp({
         apiKey: process.env.NEXT_PUBLIC_API_KEY,
         authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
         projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
         storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
         messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
         appId: process.env.NEXT_PUBLIC_APP_ID,
      });
      this.db = getFirestore();
      this.auth = getAuth();
   }

   async sendVideo(title, thumb, id) {
      const videoRef = doc(this.db, "videos", id);
      const videoSnap = await getDoc(videoRef);

      var hasVideo = false;
      if (videoSnap.exists()) {
         hasVideo = true;
      }
      if (hasVideo) {
         toast.warn("Você não pode enviar um vídeo já incluso na plataforma.", {
            position: toast.POSITION.BOTTOM_LEFT,
         });
      } else {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: id,
            votes: 0,
         });
         toast.success("Enviado com sucesso!!", {
            position: toast.POSITION.TOP_CENTER,
         });
      }
   }

   async getAllVideos() {
      const querySnapshot = await getDocs(collection(this.db, "videos"));
      let allVideos = [];
      querySnapshot.forEach((doc) => {
         // doc.data() is never undefined for query doc snapshots
         allVideos.push(doc.data());
      });
      return allVideos;
   }

   async createUserEmailPass(email, password) {
      createUserWithEmailAndPassword(this.auth, email, password)
         .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
         })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
         });
   }
   async login(email, password) {
      signInWithEmailAndPassword(this.auth, email, password)
         .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
         })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
         });
   }

   async googleOAuth() {
      signInWithPopup(this.auth, provider)
         .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            // ...
         })
         .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
         });
   }

   async sendDownVote(videoId, email, isUpvote, votes, title, thumb) {
      const videoRef = doc(this.db, "videos", videoId);
      const videosRef = doc(this.db, "votes", videoId + email);

      if (isUpvote) {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: videoId,
            votes: votes - 2,
         });
      } else {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: videoId,
            votes: votes - 1,
         });
      }

      await setDoc(videosRef, {
         videoId: videoId,
         email: email,
         vote: "false",
      });
      toast.success("Enviado com sucesso!!", {
         position: toast.POSITION.TOP_CENTER,
      });
   }

   async sendNeutralVote(videoId, email, isUpvote, votes, title, thumb) {
      const videosRef = doc(this.db, "votes", videoId + email);
      const videoRef = doc(this.db, "videos", videoId);
      if (isUpvote) {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: videoId,
            votes: votes - 1,
         });
      } else {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: videoId,
            votes: votes + 1,
         });
      }
      await setDoc(videosRef, {
         videoId: videoId,
         email: email,
         vote: "neutral",
      });
      toast.success("Enviado com sucesso!!", {
         position: toast.POSITION.TOP_CENTER,
      });
   }

   async sendUpVote(videoId, email, isUpvote, votes, title, thumb) {
      const videosRef = doc(this.db, "votes", videoId + email);
      const videoRef = doc(this.db, "videos", videoId);

      if (!isUpvote) {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: videoId,
            votes: votes + 2,
         });
      } else {
         await setDoc(videoRef, {
            thumb: thumb,
            title: title,
            id: videoId,
            votes: votes + 1,
         });
      }

      await setDoc(videosRef, {
         videoId: videoId,
         email: email,
         vote: "true",
      });
      toast.success("Enviado com sucesso!!", {
         position: toast.POSITION.TOP_CENTER,
      });
   }

   async getAllVotes() {
      const querySnapshot = await getDocs(collection(this.db, "votes"));
      let allVotes = [];
      querySnapshot.forEach((doc) => {
         // doc.data() is never undefined for query doc snapshots
         allVotes.push(doc.data());
      });
      return allVotes;
   }
}

export default new Firebase();
