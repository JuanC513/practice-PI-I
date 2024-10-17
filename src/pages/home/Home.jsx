import { Canvas } from "@react-three/fiber";
import Controls from "./controls/Controls";
import Lights from "./lights/Lights";
import { Physics } from "@react-three/rapier";
import Beach from "./world/Beach";
import Staging from "./staging/Staging";
import { Loader, PositionalAudio } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useRef } from "react";
import Video from "./world/Video";

import useHomeStore from "../../stores/useHomeStore";

// The component we show when the user first enters the page, then we ask for an interaction by them
const StartingComponent = () => {
  const {setHome } = useHomeStore();

  useEffect(() => {
    const handleUserInteraction = () => {
      setHome({
        showHome: true,
      });
    };

    // We detect the user's first interaction through keyboard
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center", alignItems: "center",
      height: "100vh",
      fontWeight: "bold",
      fontSize: 30,
      backgroundColor: "gray",
    }}>
      Hello, press any key to continue
    </div>
  )
}

const PrincipalComponent = () => {
  const audioRef = useRef(null);

  const cameraSettings = {
    position: [0, 15, 15],
  };

  useEffect(() => {
    // When the component is put, we start to check for the moment when the audio reference is ready so we can play the audio
    const checkAudioReady = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.setVolume(10);
        audio.play();
      } else {
        // If the reference is not ready yet, we try again but we wait a bit using a Timeout
        setTimeout(checkAudioReady, 100);
      }
    };

    // We start to verify when we have audio
    checkAudioReady();
  }, []);

  return (
    <>
      <Canvas camera={cameraSettings}>
        <Suspense fallback={null}>
          <Perf position={"top-left"} />
          <Controls />
          <Lights />
          <Staging />
          <Physics debug={false}>
            <Beach />
          </Physics>
          <Video name="screen" position-y={10} scale={8} />
          <group position={[0, 5, 0]}>
            <PositionalAudio
              ref={audioRef}
              url="/sounds/waves.mp3"
              distance={3}
            />
          </group>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}

const Home = () => {
  // State using a Zustand's store
  const {home} = useHomeStore();
  return (
    <>
      {home.showHome ?
        <PrincipalComponent />
      :
        <StartingComponent />
      }
    </>
  );
};

export default Home;
