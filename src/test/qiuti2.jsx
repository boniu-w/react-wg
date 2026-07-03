import React, { useState, useEffect } from 'react';

const GlobeWithNumbers = () => {
  const [rotationOffset, setRotationOffset] = useState(0);
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const sphereRadius = 150; // 球体半径

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setRotationOffset(prev => (prev + 0.5) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0a0a0a',
      perspective: '800px'
    }}>
      {/* 3D 球体容器 */}
      <div style={{
        position: 'relative',
        width: sphereRadius * 2,
        height: sphereRadius * 2,
        transformStyle: 'preserve-3d',
        transform: 'rotateX(-15deg)' // 稍微倾斜，方便观察球体立体感
      }}>
        
        {/* 1. 球体背景蒙版 */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(100, 150, 255, 0.2), transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(100, 150, 255, 0.1) inset',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-1px)' // 稍微往后退一点，防止遮挡数字
        }} />

        {/* 2. 12 条经线 */}
        {numbers.map((_, index) => {
          const angle = index * 30; // 每条经线间隔 30度
          return (
            <div
              key={`line-${index}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: sphereRadius * 2,
                height: sphereRadius * 2,
                marginLeft: -sphereRadius,
                marginTop: -sphereRadius,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transformStyle: 'preserve-3d',
                // 核心技巧：先绕Y轴旋转，再沿Z轴压缩 (scaleY(0.01)) 变成一条竖立的线
                transform: `rotateY(${angle}deg) scaleY(0.01)` 
              }}
            />
          );
        })}

        {/* 3. 12 个数字 */}
        {numbers.map((num, index) => {
          const baseAngle = index * 30;
          
          return (
            <div
              key={`num-${num}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '40px',
                height: '40px',
                marginLeft: '-20px',
                marginTop: '-20px',
                transformStyle: 'preserve-3d',
                // 数字跟着经线方向转动
                transform: `rotateY(${baseAngle + rotationOffset}deg) translateZ(${sphereRadius}px)`
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'rgba(100, 150, 255, 0.8)',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(100, 150, 255, 0.5)',
                // 反向旋转，让数字始终面向屏幕
                transform: `rotateY(-${baseAngle + rotationOffset}deg)` 
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