/**
 * config 结构
 * {
 *   width: 600, // 图片宽度
 *   height: 400, // 图片高度
 *   interval: 5 * 1000, // 切换完成后停留时长, 毫秒
 *   process: 5 * 1000, // 切换过程时长, 毫秒
 *   times: 20, // 切换过程次数，越大则切换效果越平滑，但是消耗的计算资源也越大，反之则越顿挫
 *   container: element, // 展示容器 dom 节点
 *   getImgSrc: function // 获取展示图片地址的函数
 * }
 */
const Slider = ({ width, height, interval, process, container, getImgSrc }) => {
  if (!container || !container.appendChild) throw Error(`指定容器不存在`);
  width = Math.max(+width, 0) || 600;
  height = Math.max(+height, 0) || 400;
  times = Math.max(+times, 0) || 20;
  interval = Math.max(+interval, 0) || 5 * 1000;
  process = Math.max(+process, 0) || 5 * 1000;
  const dy = Math.ceil(height / times);
  container.innerHTML = `
    <canvas style="position: absolute; z-index: 1" width="${width}" height="${height}"></canvas>
    <canvas style="position: absolute; z-index: 2" width="${width}" height="${height}"></canvas>
  `;
  const [fgCanvas, bgCanvas] = container.getElementByTagName("canvas");
  const fg = fgCanvas.getContext("2d");
  const bg = bgCanvas.getContext("2d");
  let _index = 0;

  // 执行过渡效果
  const slide = (i, remainMS) => {
    if (times <= i + 1) return setTimeout(drawNextImage, interval);
    const y = dy * i;
    const imgData = bg.getImageData(0, y, width, dy);
    const timeout = Math.floor(remainMS / (times - i));
    setTimeout(() => {
      fg.putImageData(imgData, 0, y);
      slide(i + 1, remainMS - timeout);
    }, timeout);
  };

  // 加载绘制下一张图片
  const drawNextImage = () => {
    const img = new Image();
    img.onload = () => {
      bg.drawImage(img, 0, 0);
      slide(0, process);
    };
    img.src = getImgSrc(_index++);
  };

  // 初始化第一张图片
  const Init = () => {
    const img = new Image();
    img.onload = () => {
      fg.drawImage(img, 0, 0);
    };
    img.src = getImgSrc(_index++);

    setTimeout(drawNextImage, interval);
  };

  Init();
};

module.exports = Slider;
