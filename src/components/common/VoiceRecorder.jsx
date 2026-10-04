import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Volume2 } from "lucide-react";

export default function VoiceRecorder({ audioData, onAudioChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Voice recording not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          onAudioChange(reader.result);
        };
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access error:", err);
      setMicError("Microphone unavailable or permission denied. Using voice simulation.");
      // Fallback voice note for testing
      simulateVoiceNote();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const simulateVoiceNote = () => {
    // Generate a demo synthetic speech audio blob or test tone
    onAudioChange("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=");
    setIsRecording(false);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  return (
    <div className="voice-recorder-wrapper">
      {!audioData ? (
        <div className="voice-record-row">
          <label className="form-label">Voice Recording</label>

          {isRecording ? (
            <div className="recording-active-box">
              <span className="recording-pulsing-dot" />
              <span className="recording-timer">{formatTime(recordSeconds)}</span>
              <button
                type="button"
                className="btn-pill-record recording"
                onClick={stopRecording}
              >
                <Square size={13} fill="#ffffff" />
                <span>Stop</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-pill-record"
              onClick={startRecording}
            >
              <span className="record-red-dot" />
              <span>Record</span>
            </button>
          )}
        </div>
      ) : (
        <div className="voice-playback-box">
          <div className="voice-playback-header">
            <div className="voice-playback-label">
              <Volume2 size={16} color="var(--accent-cyan)" />
              <span>Voice Note Attached</span>
            </div>
            <button
              type="button"
              className="icon-btn text-danger"
              onClick={() => onAudioChange(null)}
              title="Delete voice recording"
            >
              <Trash2 size={16} color="#ef4444" />
            </button>
          </div>
          <audio controls src={audioData} className="audio-player" />
        </div>
      )}

      {micError && <div className="form-hint text-warning">{micError}</div>}
    </div>
  );
}
