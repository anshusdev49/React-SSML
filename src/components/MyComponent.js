import React, { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import './MyComponent.css'; 

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { speak, voices, selectedVoice, changeVoice, pauseSpeech } = useSpeech();
  const [speakingIndex, setSpeakingIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData([...data, ...result]);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSpeak = (title, body, index) => {
    const utterance = speak(`${title}. ${body}`);
    setSpeakingIndex(index);

    utterance.addEventListener('end', () => {
      setSpeakingIndex(null);
    });
  };

  const handlePause = (index) => {
    if(index!==speakingIndex)return
    pauseSpeech();
    setSpeakingIndex(null);
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleVoiceChange = (event) => {
    const selectedVoice = voices.find((voice) => voice.name === event.target.value);
    if (selectedVoice) {
      changeVoice(selectedVoice);
    }
  };

  return (
    <div className="container">
      <div className="select-container">
        <label className="label">Select Voice: </label>
        <select className="select" value={selectedVoice ? selectedVoice.name : ''} onChange={handleVoiceChange}>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      {data.map((post, index) => (
        <div key={post.id} className="post-container">
          <h2 className="title">{post.title}</h2>
          <p className="body">{post.body}</p>
          <button
            className={`speak-button ${index === speakingIndex ? 'speaking' : ''}`}
            onClick={() => handleSpeak(post.title, post.body, index)}
          >
           { index === speakingIndex ? 'speaking...' : 'speak'}
          </button>
          <button className="pause-button" onClick={()=>handlePause(index)}>Pause</button>
        </div>
      ))}
      <button className="load-more-button" onClick={handleLoadMore}>Load More</button>
    </div>
  );
};

export default MyComponent;
