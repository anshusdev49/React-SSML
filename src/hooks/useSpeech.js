import { useEffect, useState } from 'react';

const useSpeech = () => {
  const [synthesis, setSynthesis] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speaking, setSpeaking] = useState(null);

  useEffect(() => {
    const initSpeechSynthesis = () => {
      const synth = window.speechSynthesis;
      setSynthesis(synth);

      const updateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0]);
      };

      if (synth) {
        synth.addEventListener('voiceschanged', updateVoices);
        updateVoices();
      }

      return () => {
        if (synthesis) {
          synthesis.cancel();
          synth.removeEventListener('voiceschanged', updateVoices);
        }
      };
    };

    initSpeechSynthesis();
  }, [synthesis]);

  const speak = (text) => {
    if (synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      synthesis.cancel();
      synthesis.speak(utterance);
      setSpeaking(utterance);

      return utterance; 
    }
  };

  const pauseSpeech = () => {
    if (synthesis && speaking) {
      synthesis.pause();
      setSpeaking(null);
    }
  };

  const changeVoice = (voice) => {
    setSelectedVoice(voice);
  };

  return { speak, voices, selectedVoice, changeVoice, pauseSpeech };
};

export default useSpeech;
