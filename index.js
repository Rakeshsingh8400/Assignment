import React, { useState, useRef } from 'react';

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [newSubtitleText, setNewSubtitleText] = useState('');
  const videoRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
  };

  const handleSubtitleChange = (event) => {
    setNewSubtitleText(event.target.value);
  };

  const handleAddSubtitle = () => {
    const currentTime = videoRef.current.currentTime;

    // Assuming subtitles are an array of objects with 'time' and 'text' properties
    setSubtitles([...subtitles, { time: currentTime, text: newSubtitleText }]);
    setNewSubtitleText('');
  };

  const handleVideoPlay = () => {
    videoRef.current.play();
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br />
      {videoFile && (
        <>
          <video ref={videoRef} controls>
            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <br />
          <textarea
            placeholder="Add custom subtitle..."
            value={newSubtitleText}
            onChange={handleSubtitleChange}
          />
          <button onClick={handleAddSubtitle}>Add Subtitle</button>
          <button onClick={handleVideoPlay}>Play Video</button>
          <br />
          <h3>Subtitles:</h3>
          <ul>
            {subtitles.map((subtitle, index) => (
              <li key={index}>
                Time: {subtitle.time.toFixed(2)}s - {subtitle.text}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default VideoEditor;
