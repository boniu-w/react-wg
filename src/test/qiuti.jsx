import React, { useState, useEffect, useRef } from 'react';

const GlobeWithNumbers = () => {
  const [rotationOffset, setRotationOffset] = useState(0);
  const isPausedRef = useRef(false);
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const sphereRadius = 150; // 球体半径

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      if (!isPausedRef.current) {
        setRotationOffset(prev => prev + 0.5);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // 只运行一次，不会重复创建循环

  const handleClick = () => {
    isPausedRef.current = !isPausedRef.current;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#111',
      perspective: '800px',
      cursor: 'pointer',
    }} onClick={handleClick}>
      {/* 3D 球体容器 */}
      <div style={{
        position: 'relative',
        width: sphereRadius * 2,
        height: sphereRadius * 2,
        transformStyle: 'preserve-3d',
        transform: 'rotateX(-20deg)'
      }}>

        {/* 球体表面 */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: sphereRadius * 2,
          height: sphereRadius * 2,
          marginLeft: -sphereRadius,
          marginTop: -sphereRadius,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 50%, rgba(150,150,150,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
        }} />

        {/* 赤道线（初始位置的圆环） */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: sphereRadius * 2,
          height: sphereRadius * 2,
          marginLeft: -sphereRadius,
          marginTop: -sphereRadius,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: 'rotateX(90deg)',
        }} />

        {/* 12条经线轨迹（每个数字的运动路径） */}
        {numbers.map((_, index) => {
          const baseAngle = index * 30 + 15;
          return (
            <div key={`meridian-${index}`} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: sphereRadius * 2,
              height: sphereRadius * 2,
              marginLeft: -sphereRadius,
              marginTop: -sphereRadius,
              borderRadius: '50%',
              border: '1px solid rgba(100,180,255,0.15)',
              transform: `rotateY(${baseAngle + 90}deg)`,
            }} />
          );
        })}

        {numbers.map((num, index) => {
          // 初始位置均匀分布在赤道圆环上（间隔30°，整体偏移15°避开旋转轴）
          const baseAngle = index * 30 + 15;
          // 所有数字相同速度
          const angle = rotationOffset;

          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '40px',
                height: '40px',
                marginLeft: '-20px',
                marginTop: '-20px',
                transformStyle: 'preserve-3d',
                // 1. translateZ: 推到球面
                // 2. rotateX: 沿自身经线运动（赤道→北极→赤道→南极）
                // 3. rotateY: 分布在赤道圆环上
                transform: `rotateY(${baseAngle}deg) rotateX(${angle}deg) translateZ(${sphereRadius}px)`
              }}
            >
              {/* 数字本身 */}
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                // 数字跟随球面自然转动，不做反向矫正
              }}>
                {num}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GlobeWithNumbers;