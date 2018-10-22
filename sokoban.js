function main() {
    const canvas = document.getElementById('canvas');
    const map = canvas.getContext('2d');
    const mapSize = map.canvas.width;//地图大小
    const step = 20;// 一步(一个格子的大小)
    let startXY, endXY, boxXY;
    do {
        startXY = random(mapSize, step);
        endXY = random(mapSize, step);
        boxXY = random(mapSize, step);
        if (boxXY[0] === 1) boxXY[0] += step;
        if (boxXY[0] === mapSize - step + 1) boxXY[0] -= step;
        if (boxXY[1] === 1) boxXY[1] += step;
        if (boxXY[1] === mapSize - step + 1) boxXY[1] -= step;
    } while (startXY === endXY || startXY === boxXY || endXY === boxXY);

    const boxFour = [
        boxXY[0], boxXY[1] - step,
        boxXY[0], boxXY[1] + step,
        boxXY[0] - step, boxXY[1],
        boxXY[0] + step, boxXY[1]
    ];
    let maxF = step;//最远的格子
    let maxTemp = step;//临时最远
    let endTemp = [];//临时终点
    for (let i = 0; i < boxFour.length; i += 2) {//找到最远的
        maxTemp = (Math.abs((endXY[0] - boxFour[i])) + Math.abs((endXY[1] - boxFour[i + 1])));
        if (maxTemp > maxF) {
            maxF = maxTemp;
            endTemp[0] = boxFour[i];
            endTemp[1] = boxFour[i + 1];
        }
    }
    let stepID = 1;

    //寻路
    console.log('开始找箱子');
    let stepBlack = [0, 0];

    step1();

    function step1() {
        map.clearRect(0, 0, canvas.width, canvas.height);
        drawMap(map, step);//绘制地图
        //终点
        map.fillStyle = 'rgba(0, 0, 0, 1.0)';//好看的棕色
        map.fillRect(endXY[0], endXY[1], step - 2, step - 2);

        //箱子
        map.fillStyle = 'rgba(89, 61, 61, 1.0)';//好看的棕色
        map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);

        //起点
        map.fillStyle = 'rgba(50, 177, 108, 1.0)';//好看的绿色
        //map.fillRect(startXY[0], startXY[1], step - 2, step - 2);

        let nextStep = [];

        //过滤箱子跟上一步
        if ((startXY[0] === boxXY[0] && startXY[1] - step === boxXY[1]) && (startXY[0] === stepBlack[0] && startXY[1] - step === stepBlack[1])) {
        } else nextStep.push(startXY[0], startXY[1] - step);
        if ((startXY[0] === boxXY[0] && startXY[1] + step === boxXY[1]) && (startXY[0] === stepBlack[0] && startXY[1] + step === stepBlack[1])) {
        } else nextStep.push(startXY[0], startXY[1] + step);
        if ((startXY[0] - step === boxXY[0] && startXY[1] + step === boxXY[1]) && (startXY[0] - step === stepBlack[0] && startXY[1] + step === stepBlack[1])) {
        } else nextStep.push(startXY[0] - step, startXY[1]);
        if ((startXY[0] + step === boxXY[0] && startXY[1] + step === boxXY[1]) && (startXY[0] + step === stepBlack[0] && startXY[1] + step === stepBlack[1])) {
        } else nextStep.push(startXY[0] + step, startXY[1]);

        let minF = canvas.width * 5;//=
        let minTemp = step;//=
        for (let i = 0; i < nextStep.length; i += 2) {//=
            minTemp = (Math.abs((endTemp[0] - nextStep[i])) + Math.abs((endTemp[1] - nextStep[i + 1])));
            if (minTemp < minF) {
                minF = minTemp;
                startXY[0] = nextStep[i];
                startXY[1] = nextStep[i + 1];
            }
        }
        stepBlack[0] = startXY[0];
        stepBlack[1] = startXY[1];

        if (minF >= 0) {
            map.fillRect(startXY[0], startXY[1], step - 2, step - 2);
            if (startXY[0] === endTemp[0] && startXY[1] === endTemp[1]) {
                endTemp[0] = boxXY[0];//新的临时终点
                endTemp[1] = endXY[1];//新的临时终点

                stepID = 2;
                console.log('找到箱子');
                console.log('开始推箱子');
                setTimeout(step2, 200);
            }
            if (stepID === 1) {
                setTimeout(step1, 200);
            }
        }
    }

    //推向直线
    function step2() {
        map.clearRect(0, 0, canvas.width, canvas.height);
        drawMap(map, step);//绘制地图
        //终点
        map.fillStyle = 'rgba(0, 0, 0, 1.0)';//好看的棕色
        map.fillRect(endXY[0], endXY[1], step - 2, step - 2);

        startXY[0] = boxXY[0];//起点跟随箱子
        startXY[1] = boxXY[1];//起点跟随箱子
        //起点
        map.fillStyle = 'rgba(50, 177, 108, 1.0)';//好看的绿色
        map.fillRect(startXY[0], startXY[1], step - 2, step - 2);

        //箱子
        map.fillStyle = 'rgba(89, 61, 61, 1.0)';//好看的棕色
        //map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);

        const nextStepBox = [
            boxXY[0], boxXY[1] - step,
            boxXY[0], boxXY[1] + step,
            boxXY[0] - step, boxXY[1],
            boxXY[0] + step, boxXY[1]
        ];

        let minF = canvas.width * 5;//=
        let minTemp = step;//=
        for (let i = 0; i < nextStepBox.length; i += 2) {//=
            minTemp = (Math.abs((endTemp[0] - nextStepBox[i])) + Math.abs((endTemp[1] - nextStepBox[i + 1])));
            if (minTemp < minF) {
                minF = minTemp;
                boxXY[0] = nextStepBox[i];
                boxXY[1] = nextStepBox[i + 1];
            }
        }

        if (minF >= 0) {
            map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);

            if (boxXY[0] === endTemp[0] && boxXY[1] === endTemp[1]) {
                stepID = 3;
                console.log('推到同一直线');
                if (boxXY[0] === endXY[0] && boxXY[1] === endXY[1]) {//终点跟箱子重合
                    stepID = 10;
                    console.error('GAME OVER!!!');
                    setTimeout(reload, 2000);
                    return;
                }
                //拐角
                console.log('漂移过弯');
                setTimeout(step3, 200);
            }
            if (stepID === 2) {
                setTimeout(step2, 200);
            }
        }
    }

    //拐角
    function step3() {
        map.clearRect(0, 0, canvas.width, canvas.height);
        drawMap(map, step);//绘制地图
        //终点
        map.fillStyle = 'rgba(0, 0, 0, 1.0)';//好看的棕色
        map.fillRect(endXY[0], endXY[1], step - 2, step - 2);

        //起点
        map.fillStyle = 'rgba(50, 177, 108, 1.0)';//好看的绿色
        //map.fillRect(startXY[0], startXY[1], step - 2, step - 2);

        //箱子
        map.fillStyle = 'rgba(89, 61, 61, 1.0)';//好看的棕色
        map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);

        const boxFour = [
            boxXY[0], boxXY[1] - step,
            boxXY[0], boxXY[1] + step,
            boxXY[0] - step, boxXY[1],
            boxXY[0] + step, boxXY[1]
        ];
        let minF = canvas.width * 5;//最远的格子
        let minTemp = step;//临时最远
        let endTemp = [];//临时终点
        for (let i = 0; i < boxFour.length; i += 2) {//找到最远的
            minTemp = (Math.abs((endXY[0] - boxFour[i])) + Math.abs((endXY[1] - boxFour[i + 1])));
            if (minTemp < minF) {
                minF = minTemp;
                endTemp[0] = boxFour[i];
                endTemp[1] = boxFour[i + 1];
            }
        }
        if (endTemp[0] > boxXY[0]) {//最小的反方向
            endTemp[0] -= step * 2;
        } else {
            endTemp[0] += step * 2;

        }
        step31();

        function step31() {
            map.clearRect(0, 0, canvas.width, canvas.height);
            drawMap(map, step);//绘制地图
            //终点
            map.fillStyle = 'rgba(0, 0, 0, 1.0)';//好看的棕色
            map.fillRect(endXY[0], endXY[1], step - 2, step - 2);

            //箱子
            map.fillStyle = 'rgba(89, 61, 61, 1.0)';//好看的棕色
            map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);

            //起点
            map.fillStyle = 'rgba(50, 177, 108, 1.0)';//好看的绿色
            //map.fillRect(startXY[0], startXY[1], step - 2, step - 2);

            let nextStep = [];

            //过滤箱子
            if (startXY[0] === boxXY[0] && startXY[1] - step === boxXY[1]) {
            } else nextStep.push(startXY[0], startXY[1] - step);
            if (startXY[0] === boxXY[0] && startXY[1] + step === boxXY[1]) {
            } else nextStep.push(startXY[0], startXY[1] + step);
            if (startXY[0] - step === boxXY[0] && startXY[1] + step === boxXY[1]) {
            } else nextStep.push(startXY[0] - step, startXY[1]);
            if (startXY[0] + step === boxXY[0] && startXY[1] + step === boxXY[1]) {
            } else nextStep.push(startXY[0] + step, startXY[1]);

            let minF = canvas.width * 5;//=
            let minTemp = step;//=
            for (let i = 0; i < nextStep.length; i += 2) {//=
                minTemp = (Math.abs((endTemp[0] - nextStep[i])) + Math.abs((endTemp[1] - nextStep[i + 1])));
                if (minTemp < minF) {
                    minF = minTemp;
                    startXY[0] = nextStep[i];
                    startXY[1] = nextStep[i + 1];
                }
            }

            if (minF >= 0) {
                map.fillRect(startXY[0], startXY[1], step - 2, step - 2);
                //setTimeout(step1, 100);

                if (startXY[0] === endTemp[0] && startXY[1] === endTemp[1]) {
                    stepID = 4;
                    console.log('到达最远');
                    console.log('开始推箱子');
                    setTimeout(step4, 200);
                }
                if (stepID === 3) {
                    setTimeout(step31, 200);
                }
            }
        }
    }

    function step4() {
        map.clearRect(0, 0, canvas.width, canvas.height);
        drawMap(map, step);//绘制地图
        //终点
        map.fillStyle = 'rgba(0, 0, 0, 1.0)';//好看的棕色
        map.fillRect(endXY[0], endXY[1], step - 2, step - 2);

        startXY[0] = boxXY[0];//起点跟随箱子
        startXY[1] = boxXY[1];//起点跟随箱子
        //起点
        map.fillStyle = 'rgba(50, 177, 108, 1.0)';//好看的绿色
        map.fillRect(startXY[0], startXY[1], step - 2, step - 2);

        //箱子
        map.fillStyle = 'rgba(89, 61, 61, 1.0)';//好看的棕色
        //map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);

        const nextStepBox = [
            boxXY[0], boxXY[1] - step,
            boxXY[0], boxXY[1] + step,
            boxXY[0] - step, boxXY[1],
            boxXY[0] + step, boxXY[1]
        ];

        let minF = canvas.width * 5;//=
        let minTemp = step;//=
        for (let i = 0; i < nextStepBox.length; i += 2) {//=
            minTemp = (Math.abs((endXY[0] - nextStepBox[i])) + Math.abs((endXY[1] - nextStepBox[i + 1])));
            if (minTemp < minF) {
                minF = minTemp;
                boxXY[0] = nextStepBox[i];
                boxXY[1] = nextStepBox[i + 1];
            }
        }

        if (minF >= 0) {
            map.fillRect(boxXY[0], boxXY[1], step - 2, step - 2);
            if (boxXY[0] === endXY[0] && boxXY[1] === endXY[1]) {//终点跟箱子重合
                stepID = 10;
                console.error('GAME OVER!!!');
                setTimeout(reload, 2000);
                return;
            }
            if (stepID === 4) {
                setTimeout(step4, 200);
            }
        }
    }
}

//绘制地图方法
function drawMap(map, step) {
    for (let i = 0; i <= map.canvas.width; i += step) {
        //绘制横线
        map.beginPath();//画一条路径
        map.moveTo(0, i);//开始路径位置
        map.lineTo(map.canvas.width, i);//结束路径位置
        map.stroke();//绘制路径(默认不显示)

        //绘制竖线
        map.beginPath();
        map.moveTo(i, 0);
        map.lineTo(i, map.canvas.height);
        map.stroke();
    }
}

//随机生成一个点
function random(mapSize, step) {
    const x = Math.floor((Math.random() * mapSize) / step) * step + 1;
    const y = Math.floor((Math.random() * mapSize) / step) * step + 1;
    return [x, y];
}

function reload() {
    location.reload();
}
