import type { NextPage } from "next";
import Head from "next/head";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

import Topbar from "../components/Topbar";
import NewVideoModal from "../components/NewVideoModal";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

import VideoCard from "../components/VideoCard";
import YoutubeEmbed from "../components/YoutubeEmbed";
import styles from "../styles/Home.module.css";
import { GetServerSideProps } from "next";
import Firebase from "../lib/firebase";
import { useEffect, useState } from "react";
interface IAllVideos {
   allVideos: Array<{
      id: String;
      thumb: String;
      title: String;
      votes: number;
   }>;
   allVotes: Array<{
      email: String;
      videoId: String;
      vote: String;
   }>;
}

const IndexPage: NextPage<IAllVideos> = () => {
   const auth = getAuth();

   const [allVotes, setAllVotes] = useState([]);
   const [userEmail, setUserEmail] = useState("");
   const [allVideos, setAllVideos] = useState([]);
   const [videoInFrame, setVideoInFrame] = useState("");

   useEffect(() => {
      Firebase.getAllVideos().then((res) => {
         res.sort((videoA, videoB) => videoB.votes - videoA.votes);
         setAllVideos(res);
         setVideoInFrame(res[0].id);
      });
      Firebase.getAllVotes().then((res) => {
         setAllVotes(res);
      });
      onAuthStateChanged(auth, (user) => {
         if (user) {
            setUserEmail(user.email);
         }
      });
   }, []);

   const videosWithVotes = allVideos.map((video) => ({
      ...video,
      ...allVotes.find(
         (vote) => vote.email === userEmail && vote.videoId === video.id
      ),
   }));

   return (
      <>
         <div className={styles.container}>
            <Head>
               <title>rankvideos</title>
               <link rel="icon" href="/favicon.svg" />
            </Head>
            <YoutubeEmbed embedId={videoInFrame} />
            <Topbar />
            <div className={styles.videoCardContainer}>
               {videosWithVotes.map((video) => (
                  <VideoCard
                     id={video.id}
                     thumb={video.thumb}
                     title={video.title}
                     votes={video.votes}
                     setVideoInFrame={setVideoInFrame}
                     voteType={video.vote}
                  />
               ))}
            </div>
         </div>
         <NewVideoModal />
         <LoginModal />
         <SignupModal />
      </>
   );
};

export default IndexPage;
