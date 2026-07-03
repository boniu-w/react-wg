import React, { useState, useEffect, useRef } from 'react';

/**
 * 3D 地球仪组件
 * 12个数字均匀分布在赤道圆环上，每个数字沿自身经线绕 X 轴运动
 * 运动轨迹：赤道 → 北极 → 赤道 → 南极 → 赤道（循环）
 * 点击画面可暂停/继续动画
 *
 * CSS 3D 变换执行顺序（从右到左）：
 *   translateZ(半径)   → 将元素推到球体表面
 *   rotateX(角度)      → 绕 X 轴旋转（经线方向运动）
 *   rotateY(基础角度)  → 分布在赤道圆环的不同位置
 *
 * 核心原理：
 *   - 赤道线是一个 flat 的圆形边框，通过 rotateX(90deg) 竖起形成水平圆环
 *   - 经线是 flat 的圆形边框，通过 rotateY(baseAngle+90) 绕 Y 轴旋转后形成竖直圆面（经线平面）
 *   - 数字通过 rotateX 在经线平面上运动，遍历北极、赤道、南极
 *   - baseAngle 偏移 +15°：避免数字落在 X 旋转轴上（90°/270°），导致该轴上数字不运动
 *   - 使用 useRef 存储暂停状态：切换暂停不会触发 effect 重建，避免动画循环堆叠
 */
const GlobeWithNumbers = () => {
  // 每个数字独立的旋转角度（初始均为 0°）
  const [rotations, setRotations] = useState(Array(12).fill(0));
  // 每个数字的速度（° / 帧）
  // 公式：v_i = 0.025 + i × 0.1（i = 1~12），范围 0.125 ~ 1.225
  // 第 3600 帧所有数字同时到达北极（90°），圈数 = v_i × 10
  const speeds = Array.from({ length: 12 }, (_, i) => 0.025 + (i + 1) * 0.1);
//   const speeds = Array.from({ length: 12 }, (_, i) => 0.15 + i * 0.1);
  // 暂停标记，使用 ref 避免 effect 重建
  const isPausedRef = useRef(false);
  // 生成 1~12 的数字数组
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
  // 球体半径（px）
  const sphereRadius = 150;

  // 动画循环：每帧累加旋转角度
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      // 未暂停时才累加角度
      if (!isPausedRef.current) {
        setRotations(prev => prev.map((angle, i) => angle + speeds[i]));
      }
      // 递归请求下一帧
      animationFrameId = requestAnimationFrame(animate);
    };
    // 启动动画循环
    animationFrameId = requestAnimationFrame(animate);
    // 组件卸载时清理
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // 空依赖数组 = 只挂载时运行一次，避免循环堆叠

  // 点击切换暂停/继续
  const handleClick = () => {
    isPausedRef.current = !isPausedRef.current;
  };

  return (
    // 外层容器：居中、深色背景、3D 透视
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#111',
      perspective: '800px', // 3D 透视距离
      cursor: 'pointer',
    }} onClick={handleClick}>
      {/* 3D 场景容器：稍倾斜便于观察球体立体感 */}
      <div style={{
        position: 'relative',
        width: sphereRadius * 2,
        height: sphereRadius * 2,
        transformStyle: 'preserve-3d', // 保留子元素的 3D 变换
        transform: 'rotateX(-20deg)',   // 整体略微倾斜
      }}>

        {/* ========== 球体表面 ========== */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: sphereRadius * 2,
          height: sphereRadius * 2,
          marginLeft: -sphereRadius, // 居中偏移
          marginTop: -sphereRadius,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 50%, rgba(150,150,150,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
        }} />

        {/* ========== 赤道线 ========== */}
        {/* 原理：画一个 flat 圆形，rotateX(90deg) 将其竖起形成水平圆环 */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: sphereRadius * 2,
          height: sphereRadius * 2,
          marginLeft: -sphereRadius,
          marginTop: -sphereRadius,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: 'rotateX(90deg)', // 将圆形竖起 = 赤道平面
        }} />

        {/* ========== 12 条经线轨迹 ========== */}
        {/* 原理：画一个 flat 圆形，rotateY(baseAngle+90) 使其成为竖直圆面 */}
        {/* +90° 是因为经线平面垂直于赤道平面（在球面上相差 90°） */}
        {numbers.map((_, index) => {
          const baseAngle = index * 30 + 15; // 间隔30°，偏移15°避开旋转轴
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
              transform: `rotateY(${baseAngle + 90}deg)`, // 竖直圆面 = 经线平面
            }} />
          );
        })}

        {/* ========== 12 个运动数字 ========== */}
        {numbers.map((num, index) => {
          // 基础角度：数字在赤道上的初始位置（12个均匀分布 + 偏移15°）
          const baseAngle = index * 30 + 15;
          // 当前旋转角度（每个数字独立，速度不同）
          const angle = rotations[index];

          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: '50%', top: '50%',
                width: '40px', height: '40px',
                marginLeft: '-20px', marginTop: '-20px', // 居中
                transformStyle: 'preserve-3d',
                // CSS 变换链（从右到左执行）：
                //   1) translateZ(sphereRadius)  → 元素推到球体表面
                //   2) rotateX(angle)            → 绕 X 轴旋转 = 沿经线运动
                //   3) rotateY(baseAngle)        → 定位到赤道上的初始位置
                // 效果：数字始终附着在球面上，在赤道-北极-南极之间循环
                transform: `rotateY(${baseAngle}deg) rotateX(${angle}deg) translateZ(${sphereRadius}px)`
              }}
            >
              {/* 数字外壳：圆形半透明背景 */}
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                color: '#fff', fontSize: '18px', fontWeight: 'bold',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
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