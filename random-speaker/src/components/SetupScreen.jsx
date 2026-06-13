import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Settings, Play, GripVertical, Plus, Trash2 } from 'lucide-react';
import './SetupScreen.css';

export default function SetupScreen({ onStart }) {
  const [inputText, setInputText] = useState('');
  const [students, setStudents] = useState([]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [showSecretMode, setShowSecretMode] = useState(false);
  const [secretOrder, setSecretOrder] = useState([]);

  const handleParseNames = () => {
    // 쉼표나 줄바꿈, 띄어쓰기로 이름 파싱
    const parsed = inputText
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    
    // 중복 제거 및 리스트 업데이트
    const uniqueStudents = Array.from(new Set(parsed));
    setStudents(uniqueStudents);
    
    // Secret order에서 없는 이름 제거
    setSecretOrder(prev => prev.filter(name => uniqueStudents.includes(name)));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(secretOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSecretOrder(items);
  };

  const addToSecretOrder = (name) => {
    if (!secretOrder.includes(name)) {
      setSecretOrder([...secretOrder, name]);
    }
  };

  const removeFromSecretOrder = (name) => {
    setSecretOrder(secretOrder.filter((n) => n !== name));
  };

  const handleStart = () => {
    if (students.length === 0) {
      alert("최소 1명 이상의 학생을 입력해주세요.");
      return;
    }
    onStart({ students, allowDuplicates, secretOrder });
  };

  return (
    <div className="setup-container">
      <h1 className="title">🎮 발표자 뽑기 세팅 🎮</h1>
      
      <div className="card">
        <h2>👥 반 명단 입력</h2>
        <p className="hint">학생 이름을 쉼표나 줄바꿈으로 구분해서 입력하세요. (엑셀 복붙 가능!)</p>
        <textarea
          className="name-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="홍길동, 김철수, 이영희..."
          rows={5}
        />
        <button className="btn-secondary" onClick={handleParseNames}>
          명단 적용하기 ({students.length}명)
        </button>
      </div>

      <div className="card options-card">
        <h2>⚙️ 옵션 설정</h2>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
          />
          한 번 발표한 학생 또 나올 수 있게 하기 (중복 허용)
        </label>
        
        <button 
          className="secret-toggle-btn" 
          onClick={() => setShowSecretMode(!showSecretMode)}
        >
          <Settings size={16} /> 비밀 모드 (선생님 전용)
        </button>

        {showSecretMode && (
          <div className="secret-panel">
            <h3>🤫 뽑힐 순서 미리 정하기</h3>
            <p className="hint">원하는 학생을 아래로 추가하고 드래그해서 순서를 변경하세요.</p>
            
            <div className="secret-layout">
              <div className="secret-list-available">
                <h4>전체 명단</h4>
                <div className="student-chips">
                  {students.filter(s => !secretOrder.includes(s)).map(student => (
                    <button 
                      key={`avail-${student}`} 
                      className="chip-btn"
                      onClick={() => addToSecretOrder(student)}
                    >
                      {student} <Plus size={14} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="secret-list-selected">
                <h4>뽑힐 순서 ({secretOrder.length}명)</h4>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="secret-order-list">
                    {(provided) => (
                      <ul 
                        className="sortable-list" 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                      >
                        {secretOrder.map((student, index) => (
                          <Draggable key={student} draggableId={student} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="sortable-item"
                              >
                                <span className="drag-handle" {...provided.dragHandleProps}>
                                  <GripVertical size={16} />
                                </span>
                                <span className="student-name">{index + 1}. {student}</span>
                                <button 
                                  className="remove-btn"
                                  onClick={() => removeFromSecretOrder(student)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="btn-primary start-btn" onClick={handleStart}>
        <Play size={24} /> 뽑기 시작!
      </button>
    </div>
  );
}
