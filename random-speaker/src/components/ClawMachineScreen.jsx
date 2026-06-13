import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ResultModal from './ResultModal';
import './ClawMachineScreen.css';

export default function ClawMachineScreen({ 
  students, 
  allowDuplicates, 
  secretOrder, 
  onBack 
}) {
  const [remainingStudents, setRemainingStudents] = useState([...students]);
  const [currentSecretIndex, setCurrentSecretIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pickedStudent, setPickedStudent] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // 사운드 객체 (무료 음원 URL 사용)
  const bgmRef = useRef(null);
  const drawSoundRef = useRef(null);
  const cheerSoundRef = useRef(null);

  useEffect(() => {
    // 배경음악 자동 재생 (사용자 인터랙션 필요할 수 있음)
    bgmRef.current = new Audio('https://cdn.freesound.org/previews/573/573611_4996917-lq.mp3');
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.2;
    // bgmRef.current.play().catch(e => console.log("BGM play failed, waiting for user interaction"));
    
    drawSoundRef.current = new Audio('https://cdn.freesound.org/previews/146/146726_2437358-lq.mp3');
    drawSoundRef.current.volume = 0.5;

    cheerSoundRef.current = new Audio('https://cdn.freesound.org/previews/337/337000_5121236-lq.mp3');
    cheerSoundRef.current.volume = 0.6;

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };
  }, []);

  // 무작위로 배치된 구슬들 생성 (한 번만 계산)
  const backgroundBalls = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      colorClass: `ball-${i % 5}`,
      left: `${Math.random() * 90}%`,
      bottom: `${Math.random() * 220 - 10}px`,
      zIndex: Math.floor(Math.random() * 20),
      rotate: `${Math.random() * 360}deg`
    }));
  }, []);

  const handleDraw = () => {
    if (isDrawing) return;
    
    // BGM이 안 켜져있다면 켬
    if (bgmRef.current && bgmRef.current.paused) {
      bgmRef.current.play().catch(e => console.log("Audio play failed"));
    }

    if (remainingStudents.length === 0 && !allowDuplicates) {
      alert('모든 학생이 발표를 마쳤습니다!');
      return;
    }

    setIsDrawing(true);
    if (drawSoundRef.current) {
      drawSoundRef.current.currentTime = 0;
      drawSoundRef.current.play().catch(e => console.log(e));
    }

    let selectedStudent = null;

    // 1. Secret Order 체크
    if (currentSecretIndex < secretOrder.length) {
      selectedStudent = secretOrder[currentSecretIndex];
      setCurrentSecretIndex(prev => prev + 1);
    } else {
      // 2. 랜덤 추출
      const pool = allowDuplicates ? students : remainingStudents;
      const randomIndex = Math.floor(Math.random() * pool.length);
      selectedStudent = pool[randomIndex];
    }

    // 상태 업데이트
    if (!allowDuplicates) {
      setRemainingStudents(prev => prev.filter(s => s !== selectedStudent));
    }
    
    setPickedStudent(selectedStudent);

    // 애니메이션 시퀀스 대기 후 결과 보여주기
    setTimeout(() => {
      setIsDrawing(false);
      setShowResult(true);
      if (cheerSoundRef.current) {
        cheerSoundRef.current.currentTime = 0;
        cheerSoundRef.current.play().catch(e => console.log(e));
      }
    }, 2500); // 집게 내려갔다 올라오는 시간
  };

  const closeResult = () => {
    setShowResult(false);
  };

  return (
    <div className="claw-container">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={24} /> 다시 세팅하기
      </button>

      <div className="status-board">
        남은 학생: {allowDuplicates ? '무제한 (중복 허용)' : `${remainingStudents.length}명`}
      </div>

      <div className="machine-wrapper">
        <div className="machine">
          <div className="machine-glass">
            {/* 집게 애니메이션 */}
            <motion.div 
              className="claw"
              animate={isDrawing ? {
                y: [0, 500, 0],
                rotate: [0, -5, 5, 0]
              } : { y: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            >
              <div className="claw-arm claw-left"></div>
              <div className="claw-arm claw-right"></div>
              {isDrawing && (
                <motion.div 
                  className="picked-ball"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 1, 1], y: [500, 500, 0, 0] }}
                  transition={{ duration: 2.5, times: [0, 0.4, 0.45, 1] }}
                />
              )}
            </motion.div>

            {/* 바닥에 깔린 구슬들 */}
            <div className="balls-container">
              {backgroundBalls.map((ball) => (
                <div 
                  key={ball.id} 
                  className={`ball ${ball.colorClass}`} 
                  style={{
                    left: ball.left,
                    bottom: ball.bottom,
                    zIndex: ball.zIndex,
                    transform: `rotate(${ball.rotate})`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="machine-base">
            <button 
              className={`draw-btn ${isDrawing ? 'disabled' : ''}`}
              onClick={handleDraw}
              disabled={isDrawing}
            >
              {isDrawing ? '뽑는 중...' : '뽑기!'}
            </button>
            <div className="prize-chute"></div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResult && (
          <ResultModal student={pickedStudent} onClose={closeResult} />
        )}
      </AnimatePresence>
    </div>
  );
}
