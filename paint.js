
// window.addEventListener('DOMContentLoaded', (event) => {
const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
for (let t = 0; t < 10000000; t++) {
    squaretable[`${t}`] = Math.sqrt(t)
    if (t > 999) {
        t += 9
    }
}
let bral = Math.sqrt((255 * 255) * 3)
let video_recorder
let recording = 0
let thash = {}
function CanvasCaptureToWEBM(canvas, bitrate) {
    // the video_recorder is set to  '= new CanvasCaptureToWEBM(canvas, 4500000);' in the setup, 
    // it uses the same canvas as the rest of the file.
    // to start a recording call .record() on video_recorder
    /*
    for example, 
    if(keysPressed['-'] && recording == 0){
        recording = 1
        video_recorder.record()
    }
    if(keysPressed['='] && recording == 1){
        recording = 0
        video_recorder.stop()
        video_recorder.download('File Name As A String.webm')
    }
    */
    this.record = Record
    this.stop = Stop
    this.download = saveToDownloads
    let blobCaptures = []
    let outputFormat = {}
    let recorder = {}
    let canvasInput = canvas.captureStream()
    if (typeof canvasInput == undefined || !canvasInput) {
        return
    }
    const video = document.createElement('video')
    video.style.display = 'none'

    function Record() {
        let formats = [
            'video/vp8',
            "video/webm",
            'video/webm,codecs=vp9',
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/webm\;codecs=h21",
            "video/mpeg"
        ];

        for (let t = 0; t < formats.length; t++) {
            if (MediaRecorder.isTypeSupported(formats[t])) {
                outputFormat = formats[t]
                break
            }
        }
        if (typeof outputFormat != "string") {
            return
        } else {
            let videoSettings = {
                mimeType: outputFormat,
                videoBitsPerSecond: bitrate || 2000000 // 2Mbps
            };
            blobCaptures = []
            try {
                recorder = new MediaRecorder(canvasInput, videoSettings)
            } catch (error) {
                return;
            }
            recorder.onstop = handleStop
            recorder.ondataavailable = handleAvailableData
            recorder.start(100)
        }
    }
    function handleAvailableData(event) {
        if (event.data && event.data.size > 0) {
            blobCaptures.push(event.data)
        }
    }
    function handleStop() {
        const superBuffer = new Blob(blobCaptures, { type: outputFormat })
        video.src = window.URL.createObjectURL(superBuffer)
    }
    function Stop() {
        recorder.stop()
        video.controls = true
    }
    function saveToDownloads(input) { // specifying a file name for the output
        const name = input || 'video_out.webm'
        const blob = new Blob(blobCaptures, { type: outputFormat })
        const url = window.URL.createObjectURL(blob)
        const storageElement = document.createElement('a')
        storageElement.style.display = 'none'
        storageElement.href = url
        storageElement.download = name
        document.body.appendChild(storageElement)
        storageElement.click()
        setTimeout(() => {
            document.body.removeChild(storageElement)
            window.URL.revokeObjectURL(url)
        }, 100)
    }
}
const gamepadAPI = {
    controller: {},
    turbo: true,
    connect: function (evt) {
        if (navigator.getGamepads()[0] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[1] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[2] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[3] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        }
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] === null) {
                continue;
            }
            if (!gamepads[i].connected) {
                continue;
            }
        }
    },
    disconnect: function (evt) {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
    },
    update: function () {
        gamepadAPI.controller = navigator.getGamepads()[0]
        gamepadAPI.buttonsCache = [];// clear the buttons cache
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        gamepadAPI.buttonsStatus = [];// clear the buttons status
        var c = gamepadAPI.controller || {}; // get the gamepad object
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                if (c.buttons[b].pressed) {
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                axes.push(c.axes[a].toFixed(2));
            }
        }
        gamepadAPI.axesStatus = axes;// assign received values
        gamepadAPI.buttonsStatus = pressed;
        // //console.log(pressed); // return buttons for debugging purposes
        return pressed;
    },
    buttonPressed: function (button, hold) {
        var newPress = false;
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
            if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                newPress = true;// set the boolean variable to true
                if (!hold) {// if we want to check the single press
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                        if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                            newPress = false;
                        }
                    }
                }
            }
        }
        return newPress;
    },
    buttons: [
        'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
    ],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};
let canvas
let canvas_context
let keysPressed = {}
let FLEX_engine
let TIP_engine = {}
TIP_engine.x = 72
TIP_engine.y = 10
let XS_engine
let YS_engine
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = 0
    }
    pointDistance(point) {
        return (new LineOP(this, point, "transparent", 0)).hypotenuse()
    }
}

class Vector { // vector math and physics if you prefer this over vector components on circles
    constructor(object = (new Point(0, 0)), xmom = 0, ymom = 0) {
        this.xmom = xmom
        this.ymom = ymom
        this.object = object
    }
    isToward(point) {
        let link = new LineOP(this.object, point)
        let dis1 = link.squareDistance()
        let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
        let link2 = new LineOP(dummy, point)
        let dis2 = link2.squareDistance()
        if (dis2 < dis1) {
            return true
        } else {
            return false
        }
    }
    rotate(angleGoal) {
        let link = new Line(this.xmom, this.ymom, 0, 0)
        let length = link.hypotenuse()
        let x = (length * Math.cos(angleGoal))
        let y = (length * Math.sin(angleGoal))
        this.xmom = x
        this.ymom = y
    }
    magnitude() {
        return (new Line(this.xmom, this.ymom, 0, 0)).hypotenuse()
    }
    normalize(size = 1) {
        let magnitude = this.magnitude()
        this.xmom /= magnitude
        this.ymom /= magnitude
        this.xmom *= size
        this.ymom *= size
    }
    multiply(vect) {
        let point = new Point(0, 0)
        let end = new Point(this.xmom + vect.xmom, this.ymom + vect.ymom)
        return point.pointDistance(end)
    }
    add(vect) {
        return new Vector(this.object, this.xmom + vect.xmom, this.ymom + vect.ymom)
    }
    subtract(vect) {
        return new Vector(this.object, this.xmom - vect.xmom, this.ymom - vect.ymom)
    }
    divide(vect) {
        return new Vector(this.object, this.xmom / vect.xmom, this.ymom / vect.ymom) //be careful with this, I don't think this is right
    }
    draw() {
        let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
        let link = new LineOP(this.object, dummy, "#FFFFFF", 1)
        link.draw()
    }
}
class Line {
    constructor(x, y, x2, y2, color, width) {
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.width = width
    }
    angle() {
        return Math.atan2(this.y1 - this.y2, this.x1 - this.x2)
    }
    squareDistance() {
        let xdif = this.x1 - this.x2
        let ydif = this.y1 - this.y2
        let squareDistance = (xdif * xdif) + (ydif * ydif)
        return squareDistance
    }
    hypotenuse() {
        let xdif = this.x1 - this.x2
        let ydif = this.y1 - this.y2
        let hypotenuse = (xdif * xdif) + (ydif * ydif)
        if (hypotenuse < 10000000 - 1) {
            if (hypotenuse > 1000) {
                return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
            } else {
                return squaretable[`${Math.round(hypotenuse)}`]
            }
        } else {
            return Math.sqrt(hypotenuse)
        }
    }
    draw() {
        let linewidthstorage = canvas_context.lineWidth
        canvas_context.strokeStyle = this.color
        canvas_context.lineWidth = this.width
        canvas_context.beginPath()
        canvas_context.moveTo(this.x1, this.y1)
        canvas_context.lineTo(this.x2, this.y2)
        canvas_context.stroke()
        canvas_context.lineWidth = linewidthstorage
    }
}
class LineOP {
    constructor(object, target, color, width) {
        this.object = object
        this.target = target
        this.color = color
        this.width = width
    }
    intersects(line) {
        //console.log(line)
        var det, gm, lm;
        det = (this.target.x - this.object.x) * (line.target.y - line.object.y) - (line.target.x - line.object.x) * (this.target.y - this.object.y);
        if (det === 0) {
            return false;
        } else {
            lm = ((line.target.y - line.object.y) * (line.target.x - this.object.x) + (line.object.x - line.target.x) * (line.target.y - this.object.y)) / det;
            gm = ((this.object.y - this.target.y) * (line.target.x - this.object.x) + (this.target.x - this.object.x) * (line.target.y - this.object.y)) / det;
            return (0 < lm && lm < 1) && (0 < gm && gm < 1);
        }
    }
    squareDistance() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.y - this.target.y
        let squareDistance = (xdif * xdif) + (ydif * ydif)
        return squareDistance
    }
    hypotenuse() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.y - this.target.y
        let hypotenuse = (xdif * xdif) + (ydif * ydif)
        if (hypotenuse < 10000000 - 1) {
            if (hypotenuse > 1000) {
                return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
            } else {
                return squaretable[`${Math.round(hypotenuse)}`]
            }
        } else {
            return Math.sqrt(hypotenuse)
        }
    }
    angle() {
        return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
    }
    draw() {
        let linewidthstorage = canvas_context2.lineWidth
        canvas_context2.strokeStyle = this.color
        canvas_context2.lineWidth = this.width
        canvas_context2.beginPath()
        canvas_context2.moveTo(this.object.x, this.object.y)
        canvas_context2.lineTo(this.target.x, this.target.y)
        canvas_context2.stroke()
        canvas_context2.lineWidth = linewidthstorage
    }
}
class Rectangle {
    constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
        this.xmom = 0
        this.ymom = 0
        this.stroke = stroke
        this.strokeWidth = strokeWidth
        this.fill = fill
    }
    draw() {
        canvas_context2.fillStyle = this.color
        canvas_context2.fillRect(this.x, this.y, this.width, this.height)
    }
    move() {
        this.x += this.xmom
        this.y += this.ymom
    }
    isPointInside(point) {
        if (point.x >= this.x) {
            if (point.y >= this.y) {
                if (point.x <= this.x + this.width) {
                    if (point.y <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        if (point.x + point.radius >= this.x) {
            if (point.y + point.radius >= this.y) {
                if (point.x - point.radius <= this.x + this.width) {
                    if (point.y - point.radius <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
}
class Circle {
    constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.xmom = xmom
        this.ymom = ymom
        this.friction = friction
        this.reflect = reflect
        this.strokeWidth = strokeWidth
        this.strokeColor = strokeColor
    }
    draw() {
        canvas_context.lineWidth = this.strokeWidth
        canvas_context.strokeStyle = this.color
        canvas_context.beginPath();
        if (this.radius > 0) {
            canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
            canvas_context.fillStyle = this.color
            canvas_context.fill()
            // canvas_context.stroke();
        } else {
            // //console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
        }
    }
    move() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.x += this.xmom
        this.y += this.ymom
    }
    unmove() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.x -= this.xmom
        this.y -= this.ymom
    }
    frictiveMove() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.x += this.xmom
        this.y += this.ymom
        this.xmom *= this.friction
        this.ymom *= this.friction
    }
    frictiveunMove() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.xmom /= this.friction
        this.ymom /= this.friction
        this.x -= this.xmom
        this.y -= this.ymom
    }
    isPointInside(point) {
        this.areaY = point.y - this.y
        this.areaX = point.x - this.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
            return true
        }
        return false
    }
    doesPerimeterTouch(point) {
        this.areaY = point.y - this.y
        this.areaX = point.x - this.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
            return true
        }
        return false
    }
}
class Polygon {
    constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
        if (sides < 2) {
            sides = 2
        }
        this.reflect = reflect
        this.xmom = xmom
        this.ymom = ymom
        this.body = new Circle(x, y, size - (size * .293), "transparent")
        this.nodes = []
        this.angle = angle
        this.size = size
        this.color = color
        this.angleIncrement = (Math.PI * 2) / sides
        this.sides = sides
        for (let t = 0; t < sides; t++) {
            let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
            this.nodes.push(node)
            this.angle += this.angleIncrement
        }
    }
    isPointInside(point) { // rough approximation
        this.body.radius = this.size - (this.size * .293)
        if (this.sides <= 2) {
            return false
        }
        this.areaY = point.y - this.body.y
        this.areaX = point.x - this.body.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
            return true
        }
        return false
    }
    move() {
        if (this.reflect == 1) {
            if (this.body.x > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.body.y > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.body.x < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.body.y < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.body.x += this.xmom
        this.body.y += this.ymom
    }
    draw() {
        this.nodes = []
        this.angleIncrement = (Math.PI * 2) / this.sides
        this.body.radius = this.size - (this.size * .293)
        for (let t = 0; t < this.sides; t++) {
            let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
            this.nodes.push(node)
            this.angle += this.angleIncrement
        }
        canvas_context.strokeStyle = this.color
        canvas_context.fillStyle = this.color
        canvas_context.lineWidth = 0
        canvas_context.beginPath()
        canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
        for (let t = 1; t < this.nodes.length; t++) {
            canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
        }
        canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
        canvas_context.fill()
        canvas_context.stroke()
        canvas_context.closePath()
    }
}
class Shape {
    constructor(shapes) {
        this.shapes = shapes
    }
    draw() {
        for (let t = 0; t < this.shapes.length; t++) {
            this.shapes[t].draw()
        }
    }
    move() {
        if (typeof this.xmom != "number") {
            this.xmom = 0
        }
        if (typeof this.ymom != "number") {
            this.ymom = 0
        }
        for (let t = 0; t < this.shapes.length; t++) {
            this.shapes[t].x += this.xmom
            this.shapes[t].y += this.ymom
            this.shapes[t].draw()
        }
    }
    isPointInside(point) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (this.shapes[t].isPointInside(point)) {
                return true
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (this.shapes[t].doesPerimeterTouch(point)) {
                return true
            }
        }
        return false
    }
    innerShape(point) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (this.shapes[t].doesPerimeterTouch(point)) {
                return this.shapes[t]
            }
        }
        return false
    }
    isInsideOf(box) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (box.isPointInside(this.shapes[t])) {
                return true
            }
        }
        return false
    }
    adjustByFromDisplacement(x, y) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (typeof this.shapes[t].fromRatio == "number") {
                this.shapes[t].x += x * this.shapes[t].fromRatio
                this.shapes[t].y += y * this.shapes[t].fromRatio
            }
        }
    }
    adjustByToDisplacement(x, y) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (typeof this.shapes[t].toRatio == "number") {
                this.shapes[t].x += x * this.shapes[t].toRatio
                this.shapes[t].y += y * this.shapes[t].toRatio
            }
        }
    }
    mixIn(arr) {
        for (let t = 0; t < arr.length; t++) {
            for (let k = 0; k < arr[t].shapes.length; k++) {
                this.shapes.push(arr[t].shapes[k])
            }
        }
    }
    push(object) {
        this.shapes.push(object)
    }
}

class Spring {
    constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
        if (body == 0) {
            this.body = new Circle(x, y, radius, color)
            this.anchor = new Circle(x, y, radius, color)
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
            this.length = length
        } else {
            this.body = body
            this.anchor = new Circle(x, y, radius, color)
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
            this.length = length
        }
        this.gravity = gravity
        this.width = width
    }
    balance() {
        this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
        if (this.beam.hypotenuse() < this.length) {
            this.body.xmom += (this.body.x - this.anchor.x) / this.length
            this.body.ymom += (this.body.y - this.anchor.y) / this.length
            this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
            this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
        } else {
            this.body.xmom -= (this.body.x - this.anchor.x) / this.length
            this.body.ymom -= (this.body.y - this.anchor.y) / this.length
            this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
            this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
        }
        let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
        let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
        this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
        this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
        this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
        this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
    }
    draw() {
        this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
        this.beam.draw()
        this.body.draw()
        this.anchor.draw()
    }
    move() {
        this.anchor.ymom += this.gravity
        this.anchor.move()
    }

}
class SpringOP {
    constructor(body, anchor, length, width = 3, color = body.color) {
        this.body = body
        this.anchor = anchor
        this.beam = new LineOP(body, anchor, color, width)
        this.length = length
    }
    balance() {
        if (this.beam.hypotenuse() < this.length) {
            this.body.xmom += ((this.body.x - this.anchor.x) / this.length)
            this.body.ymom += ((this.body.y - this.anchor.y) / this.length)
            this.anchor.xmom -= ((this.body.x - this.anchor.x) / this.length)
            this.anchor.ymom -= ((this.body.y - this.anchor.y) / this.length)
        } else if (this.beam.hypotenuse() > this.length) {
            this.body.xmom -= (this.body.x - this.anchor.x) / (this.length)
            this.body.ymom -= (this.body.y - this.anchor.y) / (this.length)
            this.anchor.xmom += (this.body.x - this.anchor.x) / (this.length)
            this.anchor.ymom += (this.body.y - this.anchor.y) / (this.length)
        }

        let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
        let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
        this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
        this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
        this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
        this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
    }
    draw() {
        this.beam.draw()
    }
    move() {
        //movement of SpringOP objects should be handled separate from their linkage, to allow for many connections, balance here with this object, move nodes independently
    }
}

class Color {
    constructor(baseColor, red = -1, green = -1, blue = -1, alpha = 1) {
        this.hue = baseColor
        if (red != -1 && green != -1 && blue != -1) {
            this.r = red
            this.g = green
            this.b = blue
            if (alpha != 1) {
                if (alpha < 1) {
                    this.alpha = alpha
                } else {
                    this.alpha = alpha / 255
                    if (this.alpha > 1) {
                        this.alpha = 1
                    }
                }
            }
            if (this.r > 255) {
                this.r = 255
            }
            if (this.g > 255) {
                this.g = 255
            }
            if (this.b > 255) {
                this.b = 255
            }
            if (this.r < 0) {
                this.r = 0
            }
            if (this.g < 0) {
                this.g = 0
            }
            if (this.b < 0) {
                this.b = 0
            }
        } else {
            this.r = 0
            this.g = 0
            this.b = 0
        }
    }
    normalize() {
        if (this.r > 255) {
            this.r = 255
        }
        if (this.g > 255) {
            this.g = 255
        }
        if (this.b > 255) {
            this.b = 255
        }
        if (this.r < 0) {
            this.r = 0
        }
        if (this.g < 0) {
            this.g = 0
        }
        if (this.b < 0) {
            this.b = 0
        }
    }
    randomLight() {
        var letters = '0123456789ABCDEF';
        var hash = '#';
        for (var i = 0; i < 6; i++) {
            hash += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        var color = new Color(hash, 55 + Math.random() * 200, 55 + Math.random() * 200, 55 + Math.random() * 200)
        return color;
    }
    randomDark() {
        var letters = '0123456789ABCDEF';
        var hash = '#';
        for (var i = 0; i < 6; i++) {
            hash += letters[(Math.floor(Math.random() * 12))];
        }
        var color = new Color(hash, Math.random() * 200, Math.random() * 200, Math.random() * 200)
        return color;
    }
    random() {
        var letters = '0123456789ABCDEF';
        var hash = '#';
        for (var i = 0; i < 6; i++) {
            hash += letters[(Math.floor(Math.random() * 16))];
        }
        var color = new Color(hash, Math.random() * 255, Math.random() * 255, Math.random() * 255)
        return color;
    }
}
class Softbody { //buggy, spins in place
    constructor(x, y, radius, color, members = 10, memberLength = 5, force = 10, gravity = 0) {
        this.springs = []
        this.pin = new Circle(x, y, radius, color)
        this.spring = new Spring(x, y, radius, color, this.pin, memberLength, gravity)
        this.springs.push(this.spring)
        for (let k = 0; k < members; k++) {
            this.spring = new Spring(x, y, radius, color, this.spring.anchor, memberLength, gravity)
            if (k < members - 1) {
                this.springs.push(this.spring)
            } else {
                this.spring.anchor = this.pin
                this.springs.push(this.spring)
            }
        }
        this.forceConstant = force
        this.centroid = new Point(0, 0)
    }
    circularize() {
        this.xpoint = 0
        this.ypoint = 0
        for (let s = 0; s < this.springs.length; s++) {
            this.xpoint += (this.springs[s].anchor.x / this.springs.length)
            this.ypoint += (this.springs[s].anchor.y / this.springs.length)
        }
        this.centroid.x = this.xpoint
        this.centroid.y = this.ypoint
        this.angle = 0
        this.angleIncrement = (Math.PI * 2) / this.springs.length
        for (let t = 0; t < this.springs.length; t++) {
            this.springs[t].body.x = this.centroid.x + (Math.cos(this.angle) * this.forceConstant)
            this.springs[t].body.y = this.centroid.y + (Math.sin(this.angle) * this.forceConstant)
            this.angle += this.angleIncrement
        }
    }
    balance() {
        for (let s = this.springs.length - 1; s >= 0; s--) {
            this.springs[s].balance()
        }
        this.xpoint = 0
        this.ypoint = 0
        for (let s = 0; s < this.springs.length; s++) {
            this.xpoint += (this.springs[s].anchor.x / this.springs.length)
            this.ypoint += (this.springs[s].anchor.y / this.springs.length)
        }
        this.centroid.x = this.xpoint
        this.centroid.y = this.ypoint
        for (let s = 0; s < this.springs.length; s++) {
            this.link = new Line(this.centroid.x, this.centroid.y, this.springs[s].anchor.x, this.springs[s].anchor.y, 0, "transparent")
            if (this.link.hypotenuse() != 0) {
                this.springs[s].anchor.xmom += (((this.springs[s].anchor.x - this.centroid.x) / (this.link.hypotenuse()))) * this.forceConstant
                this.springs[s].anchor.ymom += (((this.springs[s].anchor.y - this.centroid.y) / (this.link.hypotenuse()))) * this.forceConstant
            }
        }
        for (let s = 0; s < this.springs.length; s++) {
            this.springs[s].move()
        }
        for (let s = 0; s < this.springs.length; s++) {
            this.springs[s].draw()
        }
    }
}
class Observer {
    constructor(x, y, radius, color, range = 100, rays = 10, angle = (Math.PI * .125)) {
        this.body = new Circle(x, y, radius, color)
        this.color = color
        this.ray = []
        this.rayrange = range
        this.globalangle = Math.PI
        this.gapangle = angle
        this.currentangle = 0
        this.obstacles = []
        this.raymake = rays
    }
    beam() {
        this.currentangle = this.gapangle / 2
        for (let k = 0; k < this.raymake; k++) {
            this.currentangle += (this.gapangle / Math.ceil(this.raymake / 2))
            let ray = new Circle(this.body.x, this.body.y, 1, "white", (((Math.cos(this.globalangle + this.currentangle)))), (((Math.sin(this.globalangle + this.currentangle)))))
            ray.collided = 0
            ray.lifespan = this.rayrange - 1
            this.ray.push(ray)
        }
        for (let f = 0; f < this.rayrange; f++) {
            for (let t = 0; t < this.ray.length; t++) {
                if (this.ray[t].collided < 1) {
                    this.ray[t].move()
                    for (let q = 0; q < this.obstacles.length; q++) {
                        if (this.obstacles[q].isPointInside(this.ray[t])) {
                            this.ray[t].collided = 1
                        }
                    }
                }
            }
        }
    }
    draw() {
        this.beam()
        this.body.draw()
        canvas_context.lineWidth = 1
        canvas_context.fillStyle = this.color
        canvas_context.strokeStyle = this.color
        canvas_context.beginPath()
        canvas_context.moveTo(this.body.x, this.body.y)
        for (let y = 0; y < this.ray.length; y++) {
            canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
            canvas_context.lineTo(this.body.x, this.body.y)
        }
        canvas_context.stroke()
        canvas_context.fill()
        this.ray = []
    }
}
let stop2 = 0
let frames = 0
function setUp(canvas_pass, style = "#000000") {
    canvas = canvas_pass
    video_recorder = new CanvasCaptureToWEBM(canvas, 4500000);
    canvas_context = canvas.getContext('2d');
    canvas_context2 = canvas2.getContext('2d');
    canvas.style.background = style
    window.setInterval(function () {
        if (stop2 > 0) {
            main()
            frames++
        }
        stop2++
        // if (keysPressed[' ']) {
        //     stop2 = -5
        // }
    }, 40)
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });
    window.addEventListener('pointerdown', e => {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        // TIP_engine.x = XS_engine / 3
        // TIP_engine.y = YS_engine / 3
        TIP_engine.body = TIP_engine
        // TIP_engine.x = Math.min(719 / 3, TIP_engine.x)
        // TIP_engine.y = Math.min(719 / 3, TIP_engine.y)
        // TIP_engine.y = Math.max(0, TIP_engine.y)
        // TIP_engine.x = Math.max(0, TIP_engine.x)
        // let circ = new PointCircle(TIP_engine.x, TIP_engine.y, 12)
        // for (let t = 0; t < circs.length; t++) {
        //     circs[t].shiftBy(circ)
        // }
        return
        sand.checkFlag = 1
        // circs.push(circ)

        if (keysPressed['r']) {
            sand.redFlag = 1
        }
        if (keysPressed['b']) {
            sand.blueFlag = 1
        }
        if (keysPressed['g']) {
            sand.greenFlag = 1
        }



        // let l = new LineOP(TIP_engine, {})
        // for (let t = 0; t < drops.length; t++) {
        //     l.target = drops[t]
        //     let a = l.angle()
        //     drops[t].xmom += -Math.cos(a) * .4
        //     drops[t].ymom += -Math.sin(a) * .4
        // }

        // canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
        // for (let t = 0; t < circs.length; t++) {
        //     circs[t].draw()
        // }
        // example usage: if(object.isPointInside(TIP_engine)){ take action }
    });
    window.addEventListener('pointermove', continued_stimuli);
    window.addEventListener('pointerup', e => {
        // window.removeEventListener("pointermove", continued_stimuli);
    })
    function continued_stimuli(e) {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        // TIP_engine.x = XS_engine / 3
        // TIP_engine.y = YS_engine / 3
        // TIP_engine.x = Math.min(719 / 3, TIP_engine.x)
        // TIP_engine.y = Math.min(719 / 3, TIP_engine.y)
        // TIP_engine.y = Math.max(0, TIP_engine.y)
        // TIP_engine.x = Math.max(0, TIP_engine.x)
        TIP_engine.body = TIP_engine
        return
        sand.ucheckFlag = 1
    }
}
function gamepad_control(object, speed = 1) { // basic control for objects using the controler
    //         //console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0]) //debugging
    if (typeof object.body != 'undefined') {
        if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                object.body.x += (gamepadAPI.axesStatus[0] * speed)
                object.body.y += (gamepadAPI.axesStatus[1] * speed)
            }
        }
    } else if (typeof object != 'undefined') {
        if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                object.x += (gamepadAPI.axesStatus[0] * speed)
                object.y += (gamepadAPI.axesStatus[1] * speed)
            }
        }
    }
}
function control(object, speed = 1) { // basic control for objects
    if (typeof object.body != 'undefined') {
        if (keysPressed['w']) {
            object.body.y -= speed
        }
        if (keysPressed['d']) {
            object.body.x += speed
        }
        if (keysPressed['s']) {
            object.body.y += speed
        }
        if (keysPressed['a']) {
            object.body.x -= speed
        }
    } else if (typeof object != 'undefined') {
        if (keysPressed['w']) {
            object.y -= speed
        }
        if (keysPressed['d']) {
            object.x += speed
        }
        if (keysPressed['s']) {
            object.y += speed
        }
        if (keysPressed['a']) {
            object.x -= speed
        }
    }
}
function getRandomLightColor() { // random color that will be visible on  black background
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 12) + 4)];
    }
    return color;
}
function getRandomColor() { // random color
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 16) + 0)];
    }
    return color;
}
function getRandomDarkColor() {// color that will be visible on a black background
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 12))];
    }
    return color;
}
function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
    let limit = granularity
    let shape_array = []
    for (let t = 0; t < limit; t++) {
        let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
        circ.toRatio = t / limit
        circ.fromRatio = (limit - t) / limit
        shape_array.push(circ)
    }
    return (new Shape(shape_array))
}

function castBetweenPoints(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
    let limit = granularity
    let shape_array = []
    for (let t = 0; t < limit; t++) {
        let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
        circ.toRatio = t / limit
        circ.fromRatio = (limit - t) / limit
        shape_array.push(circ)
    }
    return shape_array
}

class Disang {
    constructor(dis, ang) {
        this.dis = dis
        this.angle = ang
    }
}

class BezierHitbox {
    constructor(x, y, cx, cy, ex, ey, color = "red") { // this function takes a starting x,y, a control point x,y, and a end point x,y
        this.color = color
        this.x = x
        this.y = y
        this.cx = cx
        this.cy = cy
        this.ex = ex
        this.ey = ey
        this.metapoint = new Circle((x + cx + ex) / 3, (y + cy + ey) / 3, 3, "#FFFFFF")
        this.granularity = 100
        this.body = [...castBetweenPoints((new Point(this.x, this.y)), (new Point(this.ex, this.ey)), this.granularity, 0)]

        let angle = (new Line(this.x, this.y, this.ex, this.ey)).angle()

        this.angles = []
        for (let t = 0; t < this.granularity; t++) {
            this.angles.push(angle)
        }
        for (let t = 0; t <= 1; t += 1 / this.granularity) {
            this.body.push(this.getQuadraticXY(t))
            this.angles.push(this.getQuadraticAngle(t))
        }
        this.hitbox = []
        for (let t = 0; t < this.body.length; t++) {
            let link = new LineOP(this.body[t], this.metapoint)
            let disang = new Disang(link.hypotenuse(), link.angle() + (Math.PI * 2))
            this.hitbox.push(disang)
        }
        this.constructed = 1
    }
    isPointInside(point) {
        let link = new LineOP(point, this.metapoint)
        let angle = (link.angle() + (Math.PI * 2))
        let dis = link.hypotenuse()
        for (let t = 1; t < this.hitbox.length; t++) {
            if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                continue
            }
            if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                if (dis < (this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) {
                    return true
                }
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        let link = new LineOP(point, this.metapoint)
        let angle = (link.angle() + (Math.PI * 2))
        let dis = link.hypotenuse()
        for (let t = 1; t < this.hitbox.length; t++) {
            if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                continue
            }
            if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                if (dis < ((this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) + point.radius) {
                    return this.angles[t]
                }
            }
        }
        return false
    }
    draw() {
        this.metapoint.draw()
        let tline = new Line(this.x, this.y, this.ex, this.ey, this.color, 3)
        tline.draw()
        canvas_context.beginPath()
        this.median = new Point((this.x + this.ex) * .5, (this.y + this.ey) * .5)
        let angle = (new LineOP(this.median, this.metapoint)).angle()
        let dis = (new LineOP(this.median, this.metapoint)).hypotenuse()
        canvas_context.bezierCurveTo(this.x, this.y, this.cx - (Math.cos(angle) * dis * .38), this.cy - (Math.sin(angle) * dis * .38), this.ex, this.ey)

        canvas_context.fillStyle = this.color
        canvas_context.strokeStyle = this.color
        canvas_context.lineWidth = 3
        canvas_context.stroke()
    }
    getQuadraticXY(t) {
        return new Point((((1 - t) * (1 - t)) * this.x) + (2 * (1 - t) * t * this.cx) + (t * t * this.ex), (((1 - t) * (1 - t)) * this.y) + (2 * (1 - t) * t * this.cy) + (t * t * this.ey))
    }
    getQuadraticAngle(t) {
        var dx = 2 * (1 - t) * (this.cx - this.x) + 2 * t * (this.ex - this.cx);
        var dy = 2 * (1 - t) * (this.cy - this.y) + 2 * t * (this.ey - this.cy);
        return -Math.atan2(dx, dy) + 0.5 * Math.PI;
    }
}
Number.prototype.between = function (a, b, inclusive) {
    var min = Math.min(a, b),
        max = Math.max(a, b);
    return inclusive ? this >= min && this <= max : this > min && this < max;
}



class Weight {
    constructor(from, to) {
        this.value = this.weight()
        this.from = from
        this.to = to
        this.change = 0
        this.delta = 1
    }
    valueOf() {
        return this.value
    }
    weight() {
        return ((Math.random() - .5) * 2)
    }
    setChange(num) {
        this.change = num
    }
    setWeight(num) {
        this.value = num
    }
}
class Perceptron {
    constructor(inputs) {
        this.bias = ((Math.random() - .5) * 2) / 1
        this.value = this.bias
        this.weights = []
        this.outputConnections = []
        this.inputs = inputs
        this.error = 0
        this.delta = 1
        for (let t = 0; t < this.inputs.length; t++) {
            this.weights.push(this.weight(this.inputs[t]))
        }
        this.z = -1
        this.change = 0
    }
    setError(error) {
        this.error = error
    }
    setDelta(delta) {
        this.delta = delta
        for (let t = 0; t < this.outputConnections.length; t++) {
            this.outputConnections[t].delta = this.delta
        }
    }
    setBias(bias) {
        this.bias = bias
    }
    setChange(num) {
        this.change = num
    }
    weight(link) {
        let weight = new Weight(link, this)
        if (typeof link != "number") {
            link.outputConnections.push(weight)
        }
        return weight
    }
    valueOf() {
        return this.value
    }
    compute(inputs = this.inputs) {
        this.inputs = inputs
        this.value = this.bias
        for (let t = 0; t < inputs.length; t++) {
            if (t > this.weights.length - 1) {
                this.weights.push(this.weight())
                this.value += (inputs[t].valueOf() * this.weights[t].valueOf())
            } else {
                this.value += (inputs[t].valueOf() * this.weights[t].valueOf())
            }
        }
        this.sig()
        // this.gauss()
        return this.value
    }
    relu() {
        this.value = Math.min(Math.max(this.value, perc.reluslime), 1)
    }
    sig() {
        this.value = 1 / (1 + (Math.pow(Math.E, -this.value)))
    }
    gauss() {
        this.value = Math.min(Math.max(Math.abs(this.value), 0.00000001), 1)

    }
}
class Network {
    constructor(inputs, layerSetupArray) {
        this.reluslime = .00001
        this.momentum = .025
        this.learningRate = .0025
        this.setup = layerSetupArray
        this.inputs = inputs
        this.structure = []
        this.outputs = []
        for (let t = 0; t < layerSetupArray.length; t++) {
            let scaffold = []
            for (let k = 0; k < layerSetupArray[t]; k++) {
                let cept
                if (t == 0) {
                    cept = new Perceptron(this.inputs)
                } else {
                    cept = new Perceptron(this.structure[t - 1])
                }
                scaffold.push(cept)
            }
            this.structure.push(scaffold)
        }
        this.lastinputs = [...this.inputs]
        this.lastgoals = [...this.lastinputs]
        this.swap = []
    }

    becomeNetworkFrom(network) { //using a js file with one variable can be good for this
        // //console.log(this.structure[0][0].bias)
        for (let t = 0; t < this.structure.length; t++) {
            // //console.log("h1")
            for (let k = 0; k < this.structure[t].length; k++) {
                // //console.log("h2")
                this.structure[t][k].bias = network.structure[t][k].bias
                for (let w = 0; w < this.structure[t][k].weights.length; w++) {
                    // //console.log("h3")
                    this.structure[t][k].weights[w].setWeight(network.structure[t][k][w].valueOf())
                }
            }
        }
        // //console.log(this.structure[0][0].bias)
    }
    log() {
        let json = {}
        json.structure = []
        json.setup = [...this.setup]
        for (let t = 0; t < this.structure.length; t++) {
            json.structure.push({})
            for (let k = 0; k < this.structure[t].length; k++) {
                json.structure[t][k] = {}
                json.structure[t][k].bias = this.structure[t][k].bias.valueOf()
                for (let w = 0; w < this.structure[t][k].weights.length; w++) {
                    json.structure[t][k][w] = (this.structure[t][k].weights[w].valueOf())
                }
            }
        }
        //console.log(json)
    }
    calculateDeltasSigmoid(goals) {
        for (let t = this.structure.length - 1; t >= 0; t--) {
            const layer = this.structure[t]
            for (let k = 0; k < layer.length; k++) {
                const perceptron = layer[k]
                let output = perceptron.valueOf()
                let error = 0
                if (t === this.structure.length - 1) {
                    error = goals[k] - output;
                } else {
                    for (let k = 0; k < perceptron.outputConnections.length; k++) {
                        const currentConnection = perceptron.outputConnections[k]
                        ////console.log(currentConnection)
                        error += currentConnection.to.delta * currentConnection.valueOf()
                    }
                }
                perceptron.setError(error)
                perceptron.setDelta(error * output * (1 - output))
            }
        }
    }
    adjustWeights() {
        for (let t = 0; t < this.structure.length; t++) {
            const layer = this.structure[t]
            for (let k = 0; k < layer.length; k++) {
                const perceptron = layer[k]
                let delta = perceptron.delta
                for (let i = 0; i < perceptron.weights.length; i++) {
                    const connection = perceptron.weights[i]
                    let change = connection.change
                    change = (this.learningRate * delta * perceptron.inputs[i].valueOf()) + (this.momentum * change);
                    connection.setChange(change)
                    connection.setWeight(connection.valueOf() + change)
                }
                perceptron.setBias(perceptron.bias + (this.learningRate * delta))
            }
        }
    }
    clone(nw) {
        let input = nw.inputs
        let perc = new Network(input, nw.setup)
        for (let t = 0; t < nw.structure.length; t++) {
            for (let k = 0; k < nw.structure[t].length; k++) {
                perc.structure[t][k] = new Perceptron([0, 0, 0, 0, 0, 0, 0])
                for (let f = 0; f < nw.structure[t][k].weights.length; f++) {
                    perc.structure[t][k].weights[f] = nw.structure[t][k].weights[f]
                    perc.structure[t][k].bias = nw.structure[t][k].bias
                }
            }
        }
        return perc
    }
    compute(inputs = this.inputs) {
        this.inputs = [...inputs]
        for (let t = 0; t < this.structure.length; t++) {
            for (let k = 0; k < this.structure[t].length; k++) {
                if (t == 0) {
                    this.structure[t][k].compute(this.inputs)
                } else {
                    this.structure[t][k].compute(this.structure[t - 1])
                }
            }
        }
        this.outputs = []
        this.dataoutputs = []
        for (let t = 0; t < this.structure[this.structure.length - 1].length; t++) {
            this.outputs.push(this.structure[this.structure.length - 1][t].valueOf())
            this.dataoutputs.push(new Data(this.structure[this.structure.length - 1][t].valueOf()))
        }
    }
}
class Data {
    constructor(input = -100) {
        this.delta = 0
        this.outputConnections = []
        if (input == -100) {
            this.value = this.weight()
        } else {
            this.value = input
        }
    }
    valueOf() {
        return this.value
    }
    weight() {
        return Math.random() - .5
    }
}

let setup_canvas = document.getElementById('canvas') //getting canvas from document
let canvas2 = document.getElementById('canvas2') //getting canvas from document

setUp(setup_canvas) // setting up canvas refrences, starting timer. 

// object instantiation and creation happens here 


let pom = new Image()
pom.src = "pat.png"



let pointCircleMax = 180
class PointCircle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.radius = r
        this.nodes = []
        this.a = Math.PI / 4
        for (let t = 0; t < pointCircleMax; t++) {
            let circ = new Circle(this.x + (Math.cos(this.a) * this.radius), this.y + (Math.sin(this.a) * this.radius), 1, this.color)
            this.nodes.push(circ)
            this.a += (Math.PI * 2) / pointCircleMax
        }
        this.color = (["black", "gray", "White", "gray"])[circs.length % 4]  // getRandomColor() // `rgba(${(circs.length%230)+32}, ${(circs.length%100)+32}, ${(circs.length%200)+32},  ${(circs.length%200)+32})`
    }
    draw() {
        if (this.marked == 1) {
            return
        }
        canvas_context.strokeStyle = this.color
        canvas_context.fillStyle = this.color
        canvas_context.lineWidth = 1
        canvas_context.beginPath()
        canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
        for (let t = 1; t < this.nodes.length; t++) {
            canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
        }
        canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
        canvas_context.fill()
        canvas_context.stroke()
        canvas_context.closePath()
    }
    shiftBy(pointCircle) {
        if (this.marked == 1) {
            return
        }
        let l = new LineOP(this, pointCircle)
        // let rect = new Rectangle(-canvas.width*1,-canvas.height*1,canvas.width*3, canvas.height*3)
        for (let t = 0; t < this.nodes.length; t++) {
            l.object = this.nodes[t]
            let length = l.hypotenuse()
            let root = (Math.sqrt(1 + ((pointCircle.radius * pointCircle.radius) / (length * length))))

            let pcx = (this.nodes[t].x - pointCircle.x)
            let pcy = (this.nodes[t].y - pointCircle.y)
            this.nodes[t].x = pointCircle.x + ((pcx) * root)
            this.nodes[t].y = pointCircle.y + ((pcy) * root)
            // if(rect.isPointInside(this.nodes[t])){

            // }else{
            //     this.marked = 1
            // }
        }
    }
}


let dots = []
let circs = []


let angle = 0
let sangle = 0
let wrangle = 0
let z = -22

let pix = canvas_context.getImageData(0, 0, canvas.width / 5, canvas.width / 5)

for (let t = 0; t < pix.data.length; t++) {

    let x = ((t / 4)) % (canvas.width / 5)
    let y = Math.floor(((t / 4)) / (canvas.width / 5))
    thash[`${t}`] = { x: x, y: y }
}
for (let t = 0; t < pix.data.length; t++) {

}

let smoothingRadius = 3
let densityGoal = 1.2

let pressureMult = .02

function CDP(d) {
    let de = d - densityGoal
    let p = de * pressureMult
    return p
}

let friction = .98
let bound = 239
let prime2 = 5111111111111
let prime1 = 56003
let colors = ["#000088", "blue", "#00aaFF", "cyan", "teal", "#00ff00", "#AAFF00", "yellow", "orange", "red", "magenta"]


let pixbaskets = []

function neighbors(basket) {
    var ret = [];
    var x = basket.x;
    var y = basket.y;
    this.diagonal = true
    // east
    if (x > 0) {
        for (let t = 0; t < baskets.length; t++) {
            if (baskets[t].x == x - 1 && baskets[t].y == y) {
                ret.push(baskets[t])
                break
            }
        }
    }
    //west
    if (x < 24) {
        for (let t = 0; t < baskets.length; t++) {
            if (baskets[t].x == x + 1 && baskets[t].y == y) {
                ret.push(baskets[t])
                break
            }
        }
    }



    // north
    if (y > 0) {
        for (let t = 0; t < baskets.length; t++) {
            if (baskets[t].y == y - 1 && baskets[t].x == x) {
                ret.push(baskets[t])
                break
            }
        }
    }
    //south
    if (y < 24) {
        for (let t = 0; t < baskets.length; t++) {
            if (baskets[t].y == y + 1 && baskets[t].x == x) {
                ret.push(baskets[t])
                break
            }
        }
    }



    // northeast
    if (x > 0) {
        if (y > 0) {
            for (let t = 0; t < baskets.length; t++) {
                if (baskets[t].y == y - 1 && baskets[t].x == x - 1) {
                    ret.push(baskets[t])
                    break
                }
            }
        }
    }
    //northwest
    if (x < 24) {
        if (y > 0) {
            for (let t = 0; t < baskets.length; t++) {
                if (baskets[t].y == y - 1 && baskets[t].x == x + 1) {
                    ret.push(baskets[t])
                    break
                }
            }
        }
    }
    //southeast
    if (y < 24) {
        if (x > 0) {
            for (let t = 0; t < baskets.length; t++) {
                if (baskets[t].y == y + 1 && baskets[t].x == x - 1) {
                    ret.push(baskets[t])
                    break
                }
            }
        }
    }
    //southwest
    if (y < 24) {
        if (x < 24) {
            for (let t = 0; t < baskets.length; t++) {
                if (baskets[t].y == y + 1 && baskets[t].x == x + 1) {
                    ret.push(baskets[t])
                    break
                }
            }
        }
    }




    if (x > 0) {
        if (y > 0) {

        }
    }

    // if (grid[x - 1] && grid[x - 1][y]) {
    //     // if (grid[x - 1][y].type == node.type || (node.type2 == -1 && grid[x - 1][y].type2 == -1)) {
    //     // if (grid[x - 1][y].marked == 1) {
    //     ret.push(grid[x - 1][y]);
    //     // }
    //     // }
    // }
    // // East
    // if (grid[x + 1] && grid[x + 1][y]) {
    //     // if (grid[x + 1][y].type == node.type || (node.type2 == -1 && grid[x + 1][y].type2 == -1)) {
    //     // if (grid[x + 1][y].marked == 1) {
    //     ret.push(grid[x + 1][y]);
    //     // }
    //     // }
    // }
    // // South
    // if (grid[x] && grid[x][y - 1]) {
    //     // if (grid[x][y - 1].type == node.type || (node.type2 == -1 && grid[x][y - 1].type2 == -1)) {
    //     // if (grid[x][y - 1].marked == 1) {
    //     ret.push(grid[x][y - 1]);
    //     // }
    //     // }
    // }
    // // North
    // if (grid[x] && grid[x][y + 1]) {
    //     // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
    //     // if (grid[x][y + 1].marked == 1) {
    //     ret.push(grid[x][y + 1]);
    //     // }
    //     // }
    // }
    // if (this.diagonal) {
    //     // Southwest
    //     if (grid[x - 1] && grid[x - 1][y - 1]) {
    //         // if (grid[x - 1][y - 1].marked == 1) {
    //         ret.push(grid[x - 1][y - 1]);
    //         // }
    //     }
    //     // Southeast
    //     if (grid[x + 1] && grid[x + 1][y - 1]) {
    //         // if (grid[x + 1][y - 1].marked == 1) {
    //         ret.push(grid[x + 1][y - 1]);
    //         // }
    //     }
    //     // Northwest
    //     if (grid[x - 1] && grid[x - 1][y + 1]) {
    //         // if (grid[x - 1][y + 1].marked == 1) {
    //         ret.push(grid[x - 1][y + 1]);
    //         // }
    //     }
    //     // Northeast
    //     if (grid[x + 1] && grid[x + 1][y + 1]) {
    //         // if (grid[x + 1][y + 1].marked == 1) {
    //         ret.push(grid[x + 1][y + 1]);
    //         // }
    //     }
    // }

    return ret;
}



class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.xmom = Math.random() - .5
        this.ymom = Math.random() - .5
        this.radius = smoothingRadius
        this.key = this.basket()
        this.pointnum = drops.length
        this.body = new Circle(this.x, this.y, 1, "blue")

        if (this.x < 1) {
            this.x = 1
            this.xmom *= -.9
        }
        if (this.y < 1) {
            this.y = 1
            this.ymom *= -.9
        }
        if (this.x > bound) {
            this.x = bound
            this.xmom *= -.9
        }
        if (this.y > bound) {
            this.y = bound
            this.ymom *= -.9
        }
    }
    basket() {

        if (this.x < 1) {
            this.x = 1
            this.xmom *= -.9
        }
        if (this.y < 1) {
            this.y = 1
            this.ymom *= -.9
        }
        if (this.x > bound) {
            this.x = bound
            this.xmom *= -.9
        }
        if (this.y > bound) {
            this.y = bound
            this.ymom *= -.9
        }
        this.key = (((Math.floor(this.x / 10) * prime1) + (Math.floor(this.y / 10) * prime2))) % ((24 * 24))
        this.pixkey = (((Math.floor(this.x) * prime1) + (Math.floor(this.y) * prime2))) % ((canvas.width * canvas.width))
        return this.key
    }


    draw() {

        if (this.x < 1) {
            this.x = 1
            this.xmom *= -.9
        }
        if (this.y < 1) {
            this.y = 1
            this.ymom *= -.9
        }
        if (this.x > bound) {
            this.x = bound
            this.xmom *= -.9
        }
        if (this.y > bound) {
            this.y = bound
            this.ymom *= -.9
        }
        this.body.draw()
    }
    move() {
        if (keysPressed[' ']) {

            this.ymom += .1
        }
        this.body.color = colors[Math.min(Math.floor((Math.abs(this.xmom) + Math.abs(this.ymom)) * 3), colors.length)]
        this.x += this.xmom / 4
        this.y += this.ymom / 4
        this.xmom *= friction
        this.ymom *= friction
        if (this.x < 1) {
            this.x = 1
            this.xmom *= -.9
        }
        if (this.y < 1) {
            this.y = 1
            this.ymom *= -.9
        }
        if (this.x > bound) {
            this.x = bound
            this.xmom *= -.9
        }
        if (this.y > bound) {
            this.y = bound
            this.ymom *= -.9
        }
        this.body.x = this.x
        this.body.y = this.y
    }
}

let drops = []
let baskets = []
let starts = []

for (let t = 0; t < 1200; t++) {
    let drop = new Particle(Math.random() * canvas.width, Math.random() * canvas.width)
    drops.push(drop)
}

function calculateStarts() {
    // let prev = baskets[0].basket
    // for (let t = 1; t < baskets.length; t++) {
    //     if (baskets[t].basket != baskets[t-1].basket) {
    //         starts.push(prev)
    //     } else {
    //         starts.push(-1)
    //         prev = baskets[t].basket
    //     }
    // }

    for (let t = 0; t < 100; t++) {
        starts.push(-1)
    }


    for (let t = 0; t < baskets.length; t++) {
        if ((starts[baskets[t].basket] == -1)) {

            starts[baskets[t].basket] = t
        }
    }
}
function calculateBaskets() {
    for (let t = 0; t < drops.length; t++) {
        baskets.push({ "basket": drops[t].basket(), 't': t, "x": Math.floor(drops[t].x / 10), "y": Math.floor(drops[t].y / 10) })
    }
    baskets.sort((a, b) => a.basket > b.basket ? 1 : -1)
    pixbaskets = []

    for (let t = 0; t < pix.data.length; t += 4) {
        pixbaskets.push([])
    }
    // //console.log(pixbaskets)
    for (let t = 0; t < drops.length; t++) {

        if (drops[t].x < 1) {
            drops[t].x = 1
            drops[t].xmom *= -.9
        }
        if (drops[t].y < 1) {
            drops[t].y = 1
            this.ymom *= -.9
        }
        if (drops[t].x > bound) {
            drops[t].x = bound
            drops[t].xmom *= -.9
        }
        if (drops[t].y > bound) {
            drops[t].y = bound
            drops[t].ymom *= -.9
        }


        index = (Math.floor(drops[t].x)) + (Math.floor(drops[t].y) * canvas.width)
        // //console.log(index, pixbaskets.length, drops[t])
        pixbaskets[Math.floor(index)].push(drops[t])
    }
    //     let outdrops = []
    //     for (let t = 0; t < drops.length; t++) {
    //         outdrops[t] = drops[baskets[t].t]
    //     }   
    //     drops = [...outdrops]
}


// public void Tick()
// {
//     Color[][] newCellsArray = Enumerable.Repeat(0, size)
//         .Select(i => Enumerable.Repeat(Color.White, size).ToArray())
//         .ToArray();

//     for (int x = 0; x < size; x++)
//     {
//         for (int y = 0; y < size; y++)
//         {
//             var cell = this.GetColor(x, y);
//             if (cell == Color.White)
//             {
//                 continue;
//             }
//             //else
//             (int, int)[] directions = [(0, 1), (1, 0), (0, -1), (-1, 0)];
//             float currentHue = cell.GetHue();

//             foreach (var direction in directions)
//             {
//                 Color targetCell;
//                 if ((x + direction.Item1) < 0 | (x + direction.Item1) > (size - 1) | (y + direction.Item2) < 0 | (y + direction.Item2) > (size - 1))
//                 {
//                     continue;
//                 }

//                 targetCell = Cells[x + direction.Item1][y + direction.Item2];

//                 if (targetCell != Color.White)
//                 {
//                     continue;
//                 }
//                 if (rnd.Next(1, 3) == 1)
//                 {
//                     continue;
//                 }
//                 //else

//                 float newHue = currentHue + (float)rnd.Next(-3, 5) / 2;
//                 Color newColor = HslColorSupport.ColorFromHSV(newHue, 1, 1);

//                 newCellsArray[x + direction.Item1][y + direction.Item2] = newColor;

//             }
//             newCellsArray[x][y] = cell;
//         }
//     }


canvas_context.fillStyle = getRandomColor()
canvas_context.fillRect(0, 0, canvas.width, canvas.width)
canvas_context.fillStyle = getRandomColor()
canvas_context.fillRect(50, 50, 11, 11)
let pix2 = canvas_context.getImageData(0, 0, canvas.width / 3, canvas.width / 3)
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }
    return [(h * 360) % 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        function hueToRgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}
let pomx = new Image()
pomx.src = "rcpomaon6.png"
let tick = 0

canvas_context.imageSmoothingEnabled = false

class Grain {
    constructor(t, k) {
        this.tapped = 0
        this.t = t
        this.k = k
        this.p = ((t) * 4) + (Math.floor(k * (canvas.width / 3)) * 4)
        this.r = 128
        this.g = 128
        this.b = 128
        this.zr = 100
        this.zg = 100
        this.zb = 100
        this.m = 1
        this.impact = 0
        if (k >= (canvas.width / 5) - 2) {
            this.impact = 1
        }
        this.nin = 0
        // //console.log(this.p)
    }
    draw() {
        if (this.first != 1) {

            this.n = sand.neighbors(this)
            this.first = 1
        }

        if (this.redflag == 1) {
            this.r = 255
            this.g = Math.random() * 64
            this.b = 128 - (Math.random() * 64)
            this.redflag = 0
        }

        if (this.blueflag == 1) {
            this.r = Math.random() * 64
            this.g = 128 - (Math.random() * 64)
            this.b = 255
            this.blueflag = 0
        }

        if (this.greenflag == 1) {
            this.r = 128 - (Math.random() * 64)
            this.g = 255
            this.b = Math.random() * 64
            this.greenflag = 0
        }
        if (this.flag == 1) {
            if (this.r + this.g + this.b > 65) {

                sand.score++
            }
            this.flag = 0
            this.r = 255 - this.r
            this.g = 255 - this.g
            this.b = 255 - this.b
            this.r = 0
            this.g = 0
            this.b = 0
        } else if (keysPressed['400'] && this.r > 5 && this.g > 5 && this.b > 5) {
            this.w = sand.hueneighbors(this)
            let rf = this.r
            let gf = this.g
            let bf = this.b
            for (let t = 0; t < this.w.length; t++) {
                rf += this.w[t].r
                gf += this.w[t].g
                bf += this.w[t].b
            }
            rf /= this.w.length + 1
            gf /= this.w.length + 1
            bf /= this.w.length + 1

            this.r = rf
            this.g = gf
            this.b = bf

            for (let t = 0; t < this.w.length; t++) {
                this.w[t].r = rf
                this.w[t].g = gf
                this.w[t].b = bf
            }
        } else if (keysPressed['e']) {
            this.n = sand.trueneighbors(this)
        }
        pix2.data[this.p] = this.r + (this.impact * 255)
        pix2.data[this.p + 1] = this.g + (this.impact * 255)
        pix2.data[this.p + 2] = this.b + (this.impact * 255)
        pix2.data[this.p + 3] = 255
        if (this.impact == 0) {
            if ((this.n[this.nin].black == 1)) {
                // if (this.r != 0) {
                this.zr = this.r
                // }
                // if (this.g != 0) {
                this.zg = this.g
                // }
                // if (this.b != 0) {
                this.zb = this.b
                // }
                this.r = 0
                this.g = 0
                this.b = 0
                this.black = 1
            } else if (this.n[this.nin].impact == 0) {
                // if (this.r != 0) {

                this.zr = this.r
                // }
                // if (this.g != 0) {
                this.zg = this.g
                // }
                // if (this.b != 0) {
                this.zb = this.b
                // }/
                this.r = 0
                this.g = 0
                this.b = 0
                this.black = 1
            } else {

                this.black = 0
            }
        }
        this.tapped = 0
    }
}

class Sandmap {
    constructor() {
        this.show = "#88ff00"
        this.blocks = []
        for (let t = 0; t < (canvas.width / 5); t++) {
            this.blocks.push([])
            for (let k = 0; k < (canvas.width / 5); k++) {
                this.blocks[t].push(new Grain(t, k))
            }
        }
        this.score = 0

        canvas_context.fillStyle = "black"
        canvas_context.fillRect(0, 0, canvas.width, canvas.width)
        canvas_context.fillStyle = "white"
        // canvas_context.fillRect(50, 50, 11, 11)
        pix = canvas_context.getImageData(0, 0, canvas.width / 5, canvas.width / 5)
        for (let t = 0; t < pix.data.length; t += 4) {
            let x = thash[t].x
            let y = thash[t].y
            this.blocks[x][y].r = pix.data[t]
            this.blocks[x][y].g = pix.data[t + 1]
            this.blocks[x][y].b = pix.data[t + 2]

        }
        this.done = 0
        this.tick = 0
        this.first = 0
        this.donecheck = 0
    }
    redcheck(point) {

        let x = Math.floor(point.x)
        let y = Math.floor(point.y)
        // let er = this.blocks[x][y]
        // if (!(er.r + er.g + er.b < 65)) {
        //     return
        // }
        // let n = this.hueneighbors(er)
        // n.push(er)
        // let f = [...n]
        // for (let q = 0; q < 6; q++) {

        //     let sick = f.length
        //     for (let d = 0; d < n.length; d++) {
        //         let r = this.hueneighbors(n[d])
        //         for (let e = 0; e < r.length; e++) {
        //             if (f.includes(r[e])) {

        //             } else {
        //                 // if(r[e].r+r[e].g+r[e].b < 128){
        //                 f.push(r[e])
        //                 // }
        //             }
        //         }
        //     }
        //     n = [...f]
        //     if (sick == n.length) {
        //         break
        //     }
        // }
        // let n = []
        for (let t = -7; t < 8; t++) {
            for (let k = -7; k < 8; k++) {
                this.blocks[Math.abs((t + x) % (canvas.width / 5))][Math.abs((k + y) % (canvas.width / 5))].redflag = 1
            }
        }
        // let node = this.blocks[x][y]  
        // for (let d = 0; d < n.length; d++) {
        //     // let f = n[d]
        //     // let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
        //     // ////console.log(f.zr,f.zg,f.zb)


        //     //  if (hue < (129*129)) {
        //     // if (n[d].r + n[d].g + n[d].b < 65) {

        //         n[d].redflag = 1
        //     // }
        //     // }
        // }
    }
    greencheck(point) {

        let x = Math.floor(point.x)
        let y = Math.floor(point.y)
        // let er = this.blocks[x][y]
        // if (!(er.r + er.g + er.b < 65)) {
        //     return
        // }
        // let n = this.hueneighbors(er)
        // n.push(er)
        // let f = [...n]
        // for (let q = 0; q < 6; q++) {

        //     let sick = f.length
        //     for (let d = 0; d < n.length; d++) {
        //         let r = this.hueneighbors(n[d])
        //         for (let e = 0; e < r.length; e++) {
        //             if (f.includes(r[e])) {

        //             } else {
        //                 // if(r[e].r+r[e].g+r[e].b < 128){
        //                 f.push(r[e])
        //                 // }
        //             }
        //         }
        //     }
        //     n = [...f]
        //     if (sick == n.length) {
        //         break
        //     }
        // }
        // // let n = []
        // // for(let t = -2;t<3;t++){
        // //     for(let k = 2;k<3;k++){
        // //         n.push(this.blocks[Math.abs((t+x)%(canvas.width/3))][Math.abs((k+y)%(canvas.width/3))])
        // //     }
        // // }
        // // let node = this.blocks[x][y]  
        // for (let d = 0; d < n.length; d++) {
        //     // let f = n[d]
        //     // let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
        //     // ////console.log(f.zr,f.zg,f.zb)


        //     //  if (hue < (129*129)) {
        //     // if (n[d].r + n[d].g + n[d].b < 65) {

        //         n[d].greenflag = 1
        //     // }
        //     // }
        // }

        for (let t = -7; t < 8; t++) {
            for (let k = -7; k < 8; k++) {
                this.blocks[Math.abs((t + x) % (canvas.width / 5))][Math.abs((k + y) % (canvas.width / 5))].greenflag = 1
            }
        }
    }
    bluecheck(point) {

        let x = Math.floor(point.x)
        let y = Math.floor(point.y)
        // let er = this.blocks[x][y]
        // if (!(er.r + er.g + er.b < 65)) {
        //     return
        // }
        // let n = this.hueneighbors(er)
        // n.push(er)
        // let f = [...n]
        // for (let q = 0; q < 6; q++) {

        //     let sick = f.length
        //     for (let d = 0; d < n.length; d++) {
        //         let r = this.hueneighbors(n[d])
        //         for (let e = 0; e < r.length; e++) {
        //             if (f.includes(r[e])) {

        //             } else {
        //                 // if(r[e].r+r[e].g+r[e].b < 128){
        //                 f.push(r[e])
        //                 // }
        //             }
        //         }
        //     }
        //     n = [...f]
        //     if (sick == n.length) {
        //         break
        //     }
        // }
        // // let n = []
        // // for(let t = -2;t<3;t++){
        // //     for(let k = 2;k<3;k++){
        // //         n.push(this.blocks[Math.abs((t+x)%(canvas.width/3))][Math.abs((k+y)%(canvas.width/3))])
        // //     }
        // // }
        // // let node = this.blocks[x][y]  
        // for (let d = 0; d < n.length; d++) {
        //     // let f = n[d]
        //     // let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
        //     // ////console.log(f.zr,f.zg,f.zb)


        //     //  if (hue < (129*129)) {
        //     // if (n[d].r + n[d].g + n[d].b < 65) {

        //         n[d].blueflag = 1
        //     // }
        //     // }
        // }


        for (let t = -7; t < 8; t++) {
            for (let k = -7; k < 8; k++) {
                // //console.log(t+x, k+y, this.blocks)
                this.blocks[Math.abs((t + x) % (canvas.width / 5))][Math.abs((k + y) % (canvas.width / 5))].blueflag = 1
            }
        }


    }
    check(point) {
        let x = Math.floor(point.x)
        let y = Math.floor(point.y)
        let er = this.blocks[x][y]
        if (er.r + er.g + er.b < 128) {
            return
        }
        let n = this.hueneighbors(er)
        n.push(er)
        let f = [...n]
        for (let q = 0; q < 240; q++) {

            let sick = f.length
            for (let d = 0; d < n.length; d++) {
                let r = []
                if (n[d].r + n[d].g + n[d].b < 65) {
                } else {

                    r = this.hueneighbors(n[d])
                }
                for (let e = 0; e < r.length; e++) {
                    if (f.includes(r[e])) {

                    } else {
                        if (r[e].r + r[e].g + r[e].b > 65) {
                            f.push(r[e])
                        }
                    }
                }
            }
            n = [...f]
            if (sick == n.length) {
                break
            }
        }

        for (let d = 0; d < n.length; d++) {
            if (n[d].r + n[d].g + n[d].b > 65) {
                n[d].flag = 1
            }
        }
    }
    checkkill(point, target) {
        let x = 0
        let y = Math.floor(point.y)
        let er = this.blocks[x][y]
        if (er.zr + er.zg + er.zb < 128) {
            return
        }
        if (target.zr + target.zg + target.zb < 128) {
            return
        }
        let n = this.hueneighbors(er) //gets smae color neighbors
        n.push(er)
        let f = [...n]
        for (let q = 0; q < ((canvas.width / 5) + 120); q++) { //loops for thw apparent width AND 120 more layers (this is bad)

            let sick = f.length
            for (let d = 0; d < n.length; d++) {
                let r = []// new layer
                if (n[d].zr + n[d].zg + n[d].zb < 65) {//exclude black
                } else {

                    r = this.hueneighbors(n[d]) //gets smae color neighbors
                }
                for (let e = 0; e < r.length; e++) {
                    if (r[e].sortflag == 1) { //filter to add to set

                    } else {
                        if (r[e].zr + r[e].zg + r[e].zb > 65) { //exclude black
                            r[e].sortflag = 1
                            f.push(r[e]) //add to set
                        }
                    }
                }
            }
            n = [...f]
            if (sick == n.length) { //found whole set early
                break
            }
        }
        let strip = [] // width tester

            for (let d = 0; d < n.length; d++) {
                n[d].sortflag = 0
                if(strip.includes(n[d].t)){

                }else{
                    strip.push(n[d].t) // add up the unique x columbs
                }
            }
        if (strip.length > 135) { //close enough to the width, doesn't miss much
            for (let d = 0; d < n.length; d++) {
                if (n[d].zr + n[d].zg + n[d].zb > 65) {
                  
                    n[d].flag = 1
                }
            }
        }
    }
    ucheck(point) {
        let x = Math.floor(point.x)
        let y = Math.floor(point.y)
        let er = this.blocks[x][y]
        if (!(er.r + er.g + er.b < 65)) {
            return
        }
        let n = this.hueneighbors(er)
        n.push(er)
        let f = [...n]
        for (let q = 0; q < 6; q++) {

            let sick = f.length
            for (let d = 0; d < n.length; d++) {
                let r = this.hueneighbors(n[d])
                for (let e = 0; e < r.length; e++) {
                    if (f.includes(r[e])) {

                    } else {
                        // if(r[e].r+r[e].g+r[e].b < 128){
                        f.push(r[e])
                        // }
                    }
                }
            }
            n = [...f]
            if (sick == n.length) {
                break
            }
        }
        // let n = []
        // for(let t = -2;t<3;t++){
        //     for(let k = 2;k<3;k++){
        //         n.push(this.blocks[Math.abs((t+x)%(canvas.width/3))][Math.abs((k+y)%(canvas.width/3))])
        //     }
        // }
        // let node = this.blocks[x][y]  
        for (let d = 0; d < n.length; d++) {
            // let f = n[d]
            // let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
            // ////console.log(f.zr,f.zg,f.zb)


            //  if (hue < (129*129)) {
            if (n[d].r + n[d].g + n[d].b < 65) {

                n[d].flag = 1
            }
            // }
        }
    }
    draw() {
        // this.tick++
        this.donecheck++
        if (this.first < -10) {
            canvas_context.drawImage(pomx, 0, 0, pomx.width, pomx.height, 0, 0, canvas.width / 5, canvas.width / 5)
            this.first++
        } else {

            canvas_context.drawImage(canvas, 0, 0, canvas.width / 1, canvas.width / 1, 0, 0, canvas.width / 5, canvas.width / 5)
        }

        pix = canvas_context.getImageData(0, 0, canvas.width / 5, canvas.width / 5)
        canvas_context2.clearRect(0, 0, canvas.width, canvas.width)
        // if (this.ucheckFlag == 1) {
        if (keysPressed[' ']) {

            let link = new LineOP(new Point(canvas.width, canvas.width), new Point(TIP_engine.x * 3, TIP_engine.y * 3), "cyan", 3)
            let link2 = new LineOP(new Point(canvas.width, canvas.width), new Point(TIP_engine.x * 3, TIP_engine.y * 3), "white", 2)

            link.draw()
            link2.draw()
            canvas_context.drawImage(canvas2, 0, 0, canvas.width * 5, canvas.width * 5, 0, 0, canvas.width, canvas.width)
            for (let t = 0; t < 5; t++) {
                let spark = new Rectangle((TIP_engine.x * 5) + ((Math.random() - .5) * 25), (TIP_engine.y * 5) + ((Math.random() - .5) * 25), 4, 4, "white")
                let spark2 = new Rectangle((TIP_engine.x * 5) + ((Math.random() - .5) * 15), (TIP_engine.y * 5) + ((Math.random() - .5) * 15), 2, 2, "cyan")
                spark.draw()
                spark2.draw()
            }
        }

        canvas_context2.fillStyle = "white"
        canvas_context2.font = "22px arial"
        canvas_context2.fillText(this.score, 13, 23)
        if (this.done > 0) {


            canvas_context2.fillStyle = "white"
            canvas_context2.font = "32px arial"
            canvas_context2.fillRect(((TIP_engine.x) * 5) - 8, ((TIP_engine.y) * 5) - 8, 16, 16)
            canvas_context2.fillText("Stuck After "+frames+" frames!", 230,340)
            frames--
        }
        if(this.wasd != 1){

            canvas_context2.fillText("A/D keys to play!!", 230,240)
            if(keysPressed['a']){
                this.wasd =1
            }
            if(keysPressed['d']){
                this.wasd =1
            }
        }
        // if(sandtick%120 < 40){

        canvas_context2.fillStyle = this.show
        // }else     if(sandtick%120  < 80){

        //     canvas_context2.fillStyle = "#88ff00"
        // }else {
        //     canvas_context2.fillStyle  ="#ff8800"

        // }
        canvas_context2.fillRect(((TIP_engine.x) * 5) - 5, ((TIP_engine.y) * 5) - 5, 10, 10)

        if (this.tick % 2 == 0) {

            for (let t = pix.data.length - 4; t >= 0; t -= 4) {
                let x = ((t / 4)) % (canvas.width / 5)
                let y = Math.floor(((t / 4)) / (canvas.width / 5))
                if (y >= canvas.width / 5) {
                    continue
                }
                let n = this.neighbors(this.blocks[x][y])
                let nin = Math.floor(Math.random() * n.length)

                this.blocks[x][y].nin = nin
                if (Math.random() < .33 || stop2 <= 5) {
                    nin = 0
                    this.blocks[x][y].nin = nin

                }


                if (keysPressed['e']) {
                    n = this.trueneighbors(this.blocks[x][y])
                    let max = 9999999999
                    let i = -1
                    for (let g = 0; g < n.length; g++) {
                        if (Math.abs(n[g].t - TIP_engine.x) + Math.abs(n[g].k - TIP_engine.y) < max && n[g].r + n[g].b + n[g].g < 128 && n[nin].tapped != 1) {
                            max = Math.abs(n[g].t - TIP_engine.x) + Math.abs(n[g].k - TIP_engine.y)
                            i = g
                        }
                    }
                    if (i > -1) {

                        nin = i
                        if (Math.random() < .3) {
                            nin = Math.floor(Math.random() * n.length)
                        }
                        this.blocks[x][y].nin = nin
                    } else {
                        nin = Math.floor(Math.random() * n.length)
                        this.blocks[x][y].nin = nin

                    }
                }

                this.blocks[x][y].nin = nin

                if (n.length > 0) {


                    if (this.blocks[x][y].m >= 1 && this.blocks[x][y].impact != 1) {

                        if (n[nin].r + n[nin].g + n[nin].b < 1 && pix.data[t] + pix.data[t + 1] + pix.data[t + 2] > 65 && n[nin].tapped != 1) {
                            n[nin].r = pix.data[t]
                            n[nin].g = pix.data[t + 1]
                            n[nin].b = pix.data[t + 2]
                            this.blocks[x][y].nin = nin
                            n[nin].tapped = 1
                            n[nin].change = 1
                            this.blocks[x][y].change = 1
                        } else {
                            this.blocks[x][y].r = pix.data[t]
                            this.blocks[x][y].g = pix.data[t + 1]
                            this.blocks[x][y].b = pix.data[t + 2]
                            this.blocks[x][y].nin = nin
                            this.blocks[x][y].change = 1
                        }
                    }


                } else {

                    this.blocks[x][y].r = pix.data[t]
                    this.blocks[x][y].g = pix.data[t + 1]
                    this.blocks[x][y].b = pix.data[t + 2]
                    this.blocks[x][y].nin = nin
                    this.blocks[x][y].change = 1
                }
            }
        } else {

        }

        if (this.checkFlag == 1) {
            this.check(TIP_engine)
            this.checkFlag = 0
        }
        if (this.redFlag == 1) {
            this.redcheck(TIP_engine)
            this.redFlag = 0
        }
        if (this.blueFlag == 1) {
            this.bluecheck(TIP_engine)
            this.blueFlag = 0
        }
        if (this.greenFlag == 1) {
            this.greencheck(TIP_engine)
            this.greenFlag = 0
        }
        let link = new LineOP(new Point(canvas.width, canvas.width), new Point(TIP_engine.x * 5, TIP_engine.y * 5), "cyan", 3)
        let link2 = new LineOP(new Point(canvas.width, canvas.width), new Point(TIP_engine.x * 5, TIP_engine.y * 5), "white", 2)
        // if (this.ucheckFlag == 1) {
        if (keysPressed[' ']) {
            this.ucheck(TIP_engine)
            this.ucheckFlag = 0
        }
        // }



        if(this.donecheck%1 == 0 && this.donecheck > 10){
            let wet = 0
            let count = 0
            for(let t = 0;t<this.blocks.length;t++){
                for(let k = 0;k<this.blocks.length;k++){
                    if(this.blocks[t][k].r+this.blocks[t][k].g+this.blocks[t][k].b > 300){
                        count++
                    }else{}
                }
            }
            count/=((canvas.width/5)*(canvas.width/5))
            if(count > .9){
                this.done = 1
            }
        }




        for (let t = pix.data.length - 4; t >= 0; t -= 4) {
            let x = thash[t].x
            let y = thash[t].y
            if (this.blocks[x][y].change == 1) {
                this.blocks[x][y].draw()
            }
        }
        for (let t = pix.data.length - 4; t >= 0; t -= 4) {
            let x = thash[t].x
            let y = thash[t].y
            this.blocks[x][y].change = 0
        }
        canvas_context.clearRect(0, 0, canvas.width, canvas.height)
        canvas_context.putImageData(pix2, 0, 0)
        canvas_context.drawImage(canvas, 0, 0, canvas.width / 5, canvas.width / 5, 0, 0, canvas.width, canvas.width)


    }
    neighbors(node) {
        var ret = [];
        var x = node.t;
        var y = node.k;
        var grid = this.blocks;
        this.diagonal = false //true
        // West


        // if (grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)] && grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y]) {
        //     // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].type == node.type || (node.type2 == -1 && grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].type2 == -1)) {
        //     // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].marked == 1) {
        //     ret.push(grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y]);
        //     // }
        //     // }
        // }
        // // East
        // if (grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0] && grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y]) {
        //     // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].type == node.type || (node.type2 == -1 && grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].type2 == -1)) {
        //     // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].marked == 1) {
        //     ret.push(grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y]);
        //     // }
        //     // }
        // }
        // // South
        // if (grid[x] && grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
        //     // if (grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].type == node.type || (node.type2 == -1 && grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].type2 == -1)) {
        //     // if (grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
        //     ret.push(grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
        //     // }
        //     // }
        // }
        // North
        if (grid[x] && grid[x][y + 1]) {
            // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
            // if (grid[x][y + 1].marked == 1) {
            // if (grid[x][y + 1].r < 1) {

            ret.push(grid[x][y + 1]);
            // }
            // }
            // }
        }
        // if (this.diagonal) {
        //     // Southwest
        //     if (grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)] && grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
        //         // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
        //         ret.push(grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
        //         // }
        //     }
        //     // Southeast
        //     if (grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0] && grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
        //         // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
        //         ret.push(grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
        //         // }
        //     }
        // Northwest
        if (grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)] && grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y + 1]) {
            // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y + 1].marked == 1) {
            ret.push(grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y + 1]);
            // }
        }
        // Northeast
        if (grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0] && grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y + 1]) {
            // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y + 1].marked == 1) {
            ret.push(grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y + 1]);
            // }
        }
        // }

        return ret;
    }
    hueneighbors(node) {
        var ret = [];
        var x = node.t;
        var y = node.k;
        var grid = this.blocks;
        this.diagonal = true //true
        if (node.impact == 1) {
            return []
        }
        // West
        // //console.log(node.r, node.g, node.b, this.blocks)
        // if(node.r ==0 && node.g == 0 && node.b ==0 ){
        //     return []
        // }

        if (grid[x - 1] && grid[x - 1][y]) {
            // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].type == node.type || (node.type2 == -1 && grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].type2 == -1)) {
            // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].marked == 1) {

            let f = grid[x - 1][y]

            let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
            // //console.log(f)

            if (f.impact == 1) {
            } else if (hue < (65 * 65)) {
                ret.push(grid[x - 1][y]);
            }
            // }
            // }
        }
        // East
        if (grid[(x + 1)] && grid[(x + 1)][y]) {
            // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].type == node.type || (node.type2 == -1 && grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].type2 == -1)) {
            // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].marked == 1) {

            let f = grid[(x + 1)][y]

            let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
            ////console.log(f.zr,f.zg,f.zb)


            if (f.impact == 1) {
            } else if (hue < (65 * 65)) {
                ret.push(grid[(x + 1)][y]);
            }
            // }
            // }
        }
        // South
        if (grid[x] && grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
            // if (grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].type == node.type || (node.type2 == -1 && grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].type2 == -1)) {
            // if (grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {

            let f = grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]

            let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
            ////console.log(f.zr,f.zg,f.zb)



            if (f.impact == 1) {
            } else if (hue < (65 * 65)) {
                ret.push(grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
            }
            // }
            // }
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
            // if (grid[x][y + 1].marked == 1) {
            let f = grid[x][y + 1]

            let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
            ////console.log(f.zr,f.zg,f.zb)



            if (f.impact == 1) {
            } else if (hue < (65 * 65)) {
                ret.push(grid[x][y + 1]);
            }
            // }
            // }
        }
        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][(y - 1)]) {
                // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
                let f = grid[x - 1][(y - 1)]

                let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
                ////console.log(f.zr,f.zg,f.zb)



                if (f.impact == 1) {
                } else if (hue < (65 * 65)) {
                    ret.push(grid[x - 1][(y - 1)]);
                }
                // }
            }
            // Southeast
            if (grid[(x + 1)] && grid[(x + 1)][(y - 1)]) {
                // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
                let f = grid[(x + 1)][(y - 1)]

                let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
                ////console.log(f.zr,f.zg,f.zb)



                if (f.impact == 1) {
                } else if (hue < (65 * 65)) {
                    ret.push(grid[(x + 1)][(y - 1)]);
                }
            }
            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y + 1].marked == 1) {
                let f = grid[x - 1][y + 1]

                let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))

                
                ////console.log(f.zr,f.zg,f.zb)



                if (f.impact == 1) {
                } else if (hue < (65 * 65)) {
                    ret.push(grid[x - 1][y + 1]);
                }
            }
            // Northeast
            if (grid[(x + 1)] && grid[(x + 1)][y + 1]) {
                // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y + 1].marked == 1) {\
                let f = grid[(x + 1)][y + 1]

                let hue = Math.abs(((f.zr - node.zr) * (f.zr - node.zr)) + ((f.zg - node.zg) * (f.zg - node.zg)) + ((f.zb - node.zb) * (f.zb - node.zb)))
                ////console.log(f.zr,f.zg,f.zb)



                if (f.impact == 1) {
                } else if (hue < (65 * 65)) {
                    ret.push(grid[(x + 1)][y + 1]);
                }
                // }
            }
        }
        // //console.log(ret, node)
        for (let t = ret.length - 1; t > 0; t--) {
            if (Math.abs(node.t - ret[t].t) > 2) {
                ret.splice(t, 1)
            }
        }
        return ret;
    }
    trueneighbors(node) {
        var ret = [];
        var x = node.t;
        var y = node.k;
        var grid = this.blocks;
        this.diagonal = true //true
        // West


        if (grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)] && grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y]) {
            // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].type == node.type || (node.type2 == -1 && grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].type2 == -1)) {
            // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y].marked == 1) {
            ret.push(grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y]);
            // }
            // }
        }
        // East
        if (grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0] && grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y]) {
            // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].type == node.type || (node.type2 == -1 && grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].type2 == -1)) {
            // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y].marked == 1) {
            ret.push(grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y]);
            // }
            // }
        }
        // South
        if (grid[x] && grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
            // if (grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].type == node.type || (node.type2 == -1 && grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].type2 == -1)) {
            // if (grid[x][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
            ret.push(grid[x][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
            // }
            // }
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
            // if (grid[x][y + 1].marked == 1) {

            ret.push(grid[x][y + 1]);
            // }
            // }
        }
        if (this.diagonal) {
            // Southwest
            if (grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)] && grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
                // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
                ret.push(grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
                // }
            }
            // Southeast
            if (grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0] && grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]) {
                // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][(y - 1 >= 0 ? (y - 1):grid.length-1)].marked == 1) {
                ret.push(grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][(y - 1 >= 0 ? (y - 1) : grid.length - 1)]);
                // }
            }
            // Northwest
            if (grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)] && grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y + 1]) {
                // if (grid[(x - 1 >= 0 ? (x - 1):grid.length-1)][y + 1].marked == 1) {
                ret.push(grid[(x - 1 >= 0 ? (x - 1) : grid.length - 1)][y + 1]);
                // }
            }
            // Northeast
            if (grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0] && grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y + 1]) {
                // if (grid[(x + 1 <= grid.length-1) ? (x + 1):0][y + 1].marked == 1) {
                ret.push(grid[(x + 1 <= grid.length - 1) ? (x + 1) : 0][y + 1]);
                // }
            }
        }

        return ret;
    }
}

let sand = new Sandmap()

let sandtick = 0

let audio = new Audio()
audio.src = "song78.mp3"
audio.volume = .1
function main() {
    // refreshes the image
    // tick++
    audio.play()
    sand.draw()

    // TIP_engine.x = (Math.random()*240)
    if (keysPressed['a']) {
        TIP_engine.x -= 5
    }
    if (keysPressed['d']) {
        TIP_engine.x += 5
    }
    if (TIP_engine.x < 0) {
        TIP_engine.x = (canvas.width / 5) - 5
    }
    if (TIP_engine.x > canvas.width / 5) {
        TIP_engine.x = 5
    }
    TIP_engine.y = 10
    if(sand.wasd ==1){
        sandtick++
    }else{
        sandtick = 1
    }
    if (sandtick % 40 === 0) {
        // if(sandtick%40 === 0){
        let p = new Point(0, 0)
        let color = { r: 0, g: 0, b: 0 }
        for (let t = 0; t < (canvas.width / 5) - 3; t++) {
            if ((color.r).between(sand.blocks[p.x][p.y].zr+33, sand.blocks[p.x][p.y].zr-33) && (color.g).between(sand.blocks[p.x][p.y].zg+33, sand.blocks[p.x][p.y].zg-33) && (color.b).between(sand.blocks[p.x][p.y].zb+33, sand.blocks[p.x][p.y].zb-33)) {
                p.y++
                continue
            }
            sand.checkkill(p, sand.blocks[(canvas.width / 5) - 1][t])
            color.r = sand.blocks[p.x][p.y].zr
            color.g = sand.blocks[p.x][p.y].zg
            color.b = sand.blocks[p.x][p.y].zb
            p.y++
        }
        // }
        if (sand.show == "#ff8800") {

            sand.redFlag = 1
        }
        if (sand.show == "#0088ff") {

            sand.blueFlag = 1
        }
        if (sand.show == "#88ff00") {

            sand.greenFlag = 1
        }
        // if(sandtick%120 == 0){
        if (Math.random() < .333) {
            sand.show = "#ff8800"
        } else if (Math.random() < .5) {

            sand.show = "#0088ff"
        } else {

            sand.show = "#88ff00"
        }

    }



    // for (let t = 0; t < pix.data.length; t += 4) {
    //     let hue = rgbToHsl(Math.abs(pix.data[t]), Math.abs(pix.data[t + 1]), Math.abs(pix.data[t + 2]))
    //     // //console.log(hue)
    //     hue[0] += 2
    //     let color = hslToRgb(hue[0], 100, hue[2])
    //     pix.data[t] = color[0]
    //     pix.data[t + 1] = color[1]
    //     pix.data[t + 2] = color[2]
    //     pix.data[t + 3] = 255
    //     // if(t == ((240*4*120) + (120*4))){
    //     //     //console.log(hue,color, pix.data[t])
    //     // }
    // }


    // // pix2 = canvas_context.getImageData(0, 0, canvas.width, canvas.width)

    // let dirs =  [4, -4, (-4*canvas.width), (4*canvas.width)]
    // for(let t= 0;t<pix.data.length;t+=4){

    //     if(pix.data[t] == 255 && pix.data[t+1] == 255 && pix.data[t+2] == 255){
    //         continue
    //     }

    //     // let x = ((t / 4)) % canvas.width
    //     // let y = Math.floor(((t / 4)) / canvas.width)
    //     for(let k = 0;k<dirs.length;k++){
    //         if((t + dirs[k]).between(0, pix.data.length)){

    //             if(Math.random() < 0){
    //                 continue
    //                 }
    //             if(pix.data[t + dirs[k]] !== 255 || pix.data[t + dirs[k]+1] !== 255 || pix.data[t + dirs[k]+2] !== 255){

    //             if(Math.random() < .50){
    //                 continue
    //                 }
    //             // if(tick%3==0){
    //                 // continue
    //             //     }
    //             }
    //             let hue = rgbToHsl(pix.data[t], pix.data[t+1],pix.data[t+2])
    //             // //console.log(hue)
    //             hue[0] += 3
    //             let color = hslToRgb(hue[0],hue[1], hue[2])
    //             pix2.data[t+dirs[k]] = color[0]
    //             pix2.data[t+1+dirs[k]] = color[1]
    //             pix2.data[t+2+dirs[k]] =  color[2]

    //             // let j = 0
    //             // while(j < 1000){
    //             //     j++
    //             //     if(pix2.data[t+dirs[k]] < 255){
    //             //         pix2.data[t+dirs[k]] *= 1.02
    //             //     }else{
    //             //         break
    //             //     }
    //             //     if(pix2.data[t+dirs[k]+1] < 255){
    //             //         pix2.data[t+dirs[k]+1] *= 1.02
    //             //     }else{
    //             //         break
    //             //     }
    //             //     if(pix2.data[t+dirs[k]+2] < 255){
    //             //         pix2.data[t+dirs[k]+2] *= 1.02
    //             //     }else{
    //             //         break
    //             //     }
    //             // }


    //         }
    //     }

    //     pix2.data[t+3] = 255

    // }
    // canvas_context.putImageData(pix2, 0, 0)
    // // gamepadAPI.update() //checks for button presses/stick movement on the connected controller)
    // // game code goes here
    // // angle += 1.61803399
    // // z+= ((Math.PI*2)/1.61803399)/10
    // // z%=100
    // //top of mpaint
    // // baskets = []
    // // starts = []

    // calculateBaskets()
    // calculateStarts()
    // // //console.log(baskets)
    // // //console.log(starts)

    // let link = new LineOP({}, {})
    // let pointer = 0
    // let zpointer = 0
    // for (let t = 0; t < starts.length; t++) {
    //     if (starts[t] != -1) {
    //         pointer = starts[t]
    //     } else {
    //         continue
    //     }
    //     let counter = 0

    //     let pre = baskets[pointer].basket
    //     for (let m = pointer; m < baskets.length; m++) {
    //         if (baskets[m].basket == pre) {
    //             counter++
    //         } else {
    //             m = starts.length + 1
    //         }

    //     }
    //     let basktrue = []
    //     for (let k = pointer; k < counter + pointer; k++) {
    //         basktrue.push(baskets[k].t)
    //     }


    //     let n = neighbors(baskets[pointer])


    //     // //console.log(n)
    //     for (let f = 0; f < n.length; f++) {
    //         let po = -1
    //         let wet = 0
    //         for (let e = 0; e < starts.length; e++) {
    //             if (starts[e] != -1) {
    //                 if (baskets[starts[e]].basket == n[f].basket && wet == 0) {
    //                     po = starts[e]
    //                     wet = 1
    //                 }
    //             }
    //         }

    //         let mcounter = 0

    //         for (let m = po; m < baskets.length; m++) {
    //             if (baskets[m].basket == n[f].basket) {
    //                 mcounter++
    //             } else {
    //                 m = starts.length + 1
    //             }
    //         }

    //         for (let k = po; k < mcounter + po; k++) {
    //             basktrue.push(baskets[k].t)
    //         }
    //     }





    //     // //console.log(basktrue)
    //     for (let k = 0; k < basktrue.length; k++) {
    //         for (let b = 0; b < basktrue.length; b++) {
    //             if (k != b) {
    //                 link.object = drops[basktrue[k]]
    //                 link.target = drops[basktrue[b]]

    //                 let l = link.hypotenuse()
    //                 if (l < 20) {
    //                     let a = link.angle()
    //                     drops[basktrue[b]].xmom -= ((Math.cos(a) / (l + 4)) * CDP(basktrue.length))/10
    //                     drops[basktrue[b]].ymom -= ((Math.sin(a) / (l + 4)) * CDP(basktrue.length))/10
    //                     drops[basktrue[k]].xmom +=( (Math.cos(a) / (l + 4)) * CDP(basktrue.length))/10
    //                     drops[basktrue[k]].ymom +=( (Math.sin(a) / (l + 4)) * CDP(basktrue.length))/10
    //                 }
    //             }
    //         }
    //     }

    // }



    // for (let k = 0; k < drops.length; k++) {
    //     // drops[k].draw()
    //     drops[k].move()
    // }

    // for (let t = 0; t < pix.data.length; t += 4) {
    //     let x = ((t / 4)) % canvas.width
    //     let y = Math.floor(((t / 4)) / canvas.width)
    //     // let pixkey =  (((Math.floor(x) * prime1) + (Math.floor(y) * prime2))) % ((canvas.width*canvas.width))
    //     let r = 0
    //     let g = 0
    //     let b = 0
    //     for (let k = 0; k < pixbaskets[Math.floor(t / 4)].length; k++) {
    //         r = 128-(pixbaskets[Math.floor(t / 4)][k].xmom) * 1000
    //         g = 128-(pixbaskets[Math.floor(t / 4)][k].ymom) * 1000
    //         b += 1000
    //     }
    //     pix.data[t] = (r + (pix.data[t] * 3)) / 4
    //     pix.data[t + 1] = (g + (pix.data[t + 1] * 3)) / 4
    //     pix.data[t + 2] = (b + (pix.data[t + 2] * 3)) / 4
    //     pix.data[t + 3] = 255
    // }
    // canvas_context.putImageData(pix, 0, 0)
    // //end of paint

    // if(keysPressed['z']){
    //     if(pointCircleMax != 120){
    //         canvas_context.drawImage(pom, 0,0,pom.width, pom.height, 50,50,140,140)
    //         pix = canvas_context.getImageData(0,0,canvas.width,canvas.width)
    //         circs = []
    //         for(let t = 0;t<pix.data.length;t+=4){
    //             if(pix.data[t+3] >= 1){
    //                 let x = ((t/4))%canvas.width
    //                 let y = Math.floor(((t/4))/canvas.width)
    //                 let circ = new PointCircle(x,y,1)
    //                 circs.push(circ)
    //                 circ.color =   `rgba(${pix.data[t]}, ${pix.data[t+1]}, ${pix.data[t+2]},.5)`
    //             }
    //         }
    //     }
    //     pointCircleMax = 120

    // }
    // wrangle+= .11
    // angle += .32*Math.cos(wrangle)
    // sangle += .23*Math.sin(wrangle)
    // let circ = new PointCircle(360+Math.cos(angle)*(100*Math.sin(sangle)), 360+Math.sin(angle)*(100*Math.cos(sangle)), 20)
    // for (let t = 0; t < circs.length; t++) {
    //     circs[t].shiftBy(circ)
    // }
    // circs.push(circ)
    // if(keysPressed['-'] && recording == 0){
    //     recording = 1
    //     video_recorder.record()
    // }
    // if(keysPressed['='] && recording == 1){
    //     recording = 0
    //     video_recorder.stop()
    //     video_recorder.download('File Name As A String.webm')
    // }

    // let x = (Math.cos(angle)*z)+450
    // let y = (Math.sin(angle)*z)+450
    // let circ = new PointCircle(90+Math.floor(Math.random()*60)+.0, 90+Math.floor(Math.random()*60)+.0, 3)
    // let circ = new PointCircle(x,y, 22)
    // if(keysPressed[' ']){

    //     let circ = new PointCircle(TIP_engine.x,TIP_engine.y, 50)
    //     let c = ((circs.length*10)%220)+35
    //     circ.color = `rgb(${c},${c*3},${c})`
    //     for (let t = 0; t < circs.length; t++) {
    //         circs[t].shiftBy(circ)
    //     }
    //     circs.push(circ)
    // }
    // for (let t = 0; t < circs.length; t++) {
    //     circs[t].draw()
    // }

    // if(keysPressed['-'] && recording == 0){
    //     recording = 1
    //     video_recorder.record()
    // }
    // if(keysPressed['='] && recording == 1){
    //     recording = 0
    //     video_recorder.stop()
    //     video_recorder.download('sloym.webm')
    // }
}

// })
