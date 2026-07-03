import React, { useState, useEffect } from 'react';

const GlobeWithNumbers = () => {
  const [rotation, setRotation] = useState(0);
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  const sphereRadius = 150; // 球体半径

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      // 球体自转(X轴) 与 数字沿经线运动(Y轴) 保持相同的速度和周期
      setRotation(prev => (prev + 0.5) % 360);
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
      perspective: '800px' // 3D 透视距离
    }}>
      
      {/* 1. 球体及经线层：绕 X 轴匀速自转 */}
      <div style={{
        position: 'relative',
        width: sphereRadius * 2,
        height: sphereRadius * 2,
        transformStyle: 'preserve-3d',
        // 核心：球体绕 X 轴自转
        transform: `rotateX(${rotation}deg)` 
      }}>
        
        {/* 球体背景蒙版 */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(100, 150, 255, 0.2), transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(100, 150, 255, 0.1) inset',
          transform: 'translateZ(-1px)' 
        }} />

        {/* 12 条静止的经线（相对于球体） */}
        {numbers.map((_, index) => {
          const angle = index * 30; 
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
                transform: `rotateY(${angle}deg) scaleY(0.01)` 
              }}
            />
          );
        })}
      </div>

      {/* 2. 数字轨道层：与球体分离，独立绕 Y 轴匀速自转 */}
      <div style={{
        position: 'absolute',
        width: sphereRadius * 2,
        height: sphereRadius * 2,
        transformStyle: 'preserve-3d',
        // 核心：数字轨道绕 Y 轴匀速自转（周期与球体X轴自转一致）
        transform: `rotateY(${rotation}deg)` 
      }}>
        
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
                // 将数字固定在对应的经线大圆上
                transform: `rotateY(${baseAngle}deg) translateZ(${sphereRadius}px)`
              }}
            >
              {/* 数字本体：进行反向补偿，确保始终正对屏幕 */}
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
                // 核心补偿：抵消父级的 Y 轴旋转和球体的 X 轴自转
                transform: `rotateY(-${baseAngle + rotation}deg) rotateX(-${rotation}deg)` 
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