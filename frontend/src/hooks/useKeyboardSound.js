 // Audio setup 
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    // Select a random keyboard sound
    const randomSound =
      keyStrokeSounds[
        Math.floor(Math.random() * keyStrokeSounds.length)
      ];

    // Restart the sound if it is already playing
    randomSound.currentTime = 0;

    randomSound.play().catch((error) => {
      console.log("Audio play failed:", error);
    });
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
