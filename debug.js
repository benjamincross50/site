// gl_line.js

// Vertex Shader Program
var VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'attribute vec4 a_Color;\n' +
        'varying vec4 v_Color;\n' +
        'void main() {\n' +
        ' gl_Position=a_Position;\n' +
        ' gl_PointSize = 10.0;\n' +
        ' v_Color=a_Color;\n' +
        '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + // Precision qualifier (See Chapter 6)
  'varying vec4 v_Color;\n' +    // Receive the data from the vertex shader
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';



var vertices = new Float32Array ([
       -0.5,0.0, 0.0,0.0,1.0,
       0.5, -0.0,  0.0,0.0,1.0,
       0.0,0.0, 0.0,1.0,0.0
    ]);
var g_points=[];
var mousedown=false;
var evX=0,evY=0;
var rect ;
var challengeStatus=0;


function main(){
    var challenge = document.getElementById('challenge');
    challenge.style.display="none";
    
    var canvas = document.getElementById('webgl');
    
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('Failed to get rendering context for WebGL');
        return;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('Failed to initialise shaders.');
        return;
    }
    
    var vertexBuffer=gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }
    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    //canvas.onmousedown=function (ev) { click(ev,gl,canvas) };
    canvas.onmousedown=function (ev) { mousedown=true; evX=ev.clientX; evY=ev.clientY; rect= ev.target.getBoundingClientRect();};
    canvas.onmousemove=function (ev) { if(mousedown===true) { evX=ev.clientX; evY=ev.clientY; rect= ev.target.getBoundingClientRect();}};
    canvas.onmouseup=function (ev) { mousedown=false; };
    canvas.addEventListener("touchstart", function (ev) { ev.preventDefault(); mousedown=true; evX=ev.touches[0].clientX; evY=ev.touches[0].clientY; rect= ev.target.getBoundingClientRect(); });
    canvas.addEventListener("touchmove", function (ev) { ev.preventDefault(); if(mousedown===true) { evX=ev.touches[0].clientX; evY=ev.touches[0].clientY; rect= ev.target.getBoundingClientRect();}});
    canvas.addEventListener("touchend", function (ev) {  ev.preventDefault(); mousedown=false; });
    
    
    var tick = function(){
        draw(gl,canvas);
        requestAnimationFrame(tick);
    };
    tick();
    
    draw(gl,canvas);
    
    
    
}


function draw(gl,canvas){
    
    if(mousedown)
    {
        var x=((evX-rect.left)-canvas.width/2.0)/(canvas.width/2.0);
        var y=(canvas.height/2.0-(evY-rect.top))/(canvas.height/2.0);

        var dist1=Math.abs(vertices[0]-x)+Math.abs(vertices[1]-y);
        var dist2=Math.abs(vertices[5]-x)+Math.abs(vertices[6]-y);
        if(dist1<0.2){
            vertices[0]=x;
            vertices[1]=y;
        } else if(dist2<0.2)
        {
            vertices[5]=x;
            vertices[6]=y;
        }
        
        //console.log('x: '+x+', y: '+y);  
    }
    
    
    var slider = document.getElementById("myRange");
    var t=slider.value/100.0;
    vertices[10]=vertices[0]*(1-t)+vertices[5]*t;
    vertices[11]=vertices[1]*(1-t)+vertices[6]*t;
    
    
    
    //mousedown=false;
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    var FSIZE=vertices.BYTES_PER_ELEMENT;
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0){
        console.log('Failed to find a_Position');
        return;
    }
    // assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    gl.enableVertexAttribArray(a_Position);
    
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color<0){
        console.log('Failed to find a_Color');
        return;
    }
    // assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);
    gl.enableVertexAttribArray(a_Color);
    
    gl.clearColor(1.0,1.0,1.0,1.0);
    if(challengeStatus==1){ gl.clearColor(1.0,0.5,0.5,1.0); }
    if(challengeStatus==2){ gl.clearColor(0.5,1.0,0.5,1.0); }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,3);
    gl.lineWidth(2.0);
    //draw_line(vertices,0,gl);
    if(challengeStatus===0){ draw_line(vertices,2,gl); }
    
    if(challengeStatus){
        var left_line = new Float32Array ([ -1.0,-1.0, 0.0,0.0,0.0, -0.5, -0.5, 0.0,0.0,0.0 ]);
        var line = new Float32Array ([ -0.5,-0.5, 0.0,0.0,0.0, 0.5, 0.5, 0.0,0.0,0.0 ]);
        var right_line = new Float32Array ([ 0.5,0.5, 0.0,0.0,0.0, 1.0, 1.0, 0.0,0.0,0.0 ]);
        draw_line(line, 2, gl);
        draw_road_segment(left_line,gl);
        draw_road_segment(right_line,gl);
        draw_road_segment(vertices,gl);
        var dist1=Math.abs(vertices[0]+0.5)+Math.abs(vertices[1]+0.5);
        var dist2=Math.abs(vertices[5]-0.5)+Math.abs(vertices[6]-0.5);
        var dist3=Math.abs(vertices[0]-0.5)+Math.abs(vertices[1]-0.5);
        var dist4=Math.abs(vertices[5]+0.5)+Math.abs(vertices[6]+0.5);
        if(dist1+dist2<0.05 || dist3+dist4<0.05){challengeStatus=2;}
        else {challengeStatus=1;}
        
    }
    
}
function draw_line(line, n ,gl){
    
    if (n==0){n=line.length/5;}
    gl.bufferData(gl.ARRAY_BUFFER, line, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.LINES,0,n);
}
function draw_road_segment(segment, gl){
    var line = new Float32Array([segment[0], segment[1], segment[5], segment[6]]);
    var theta = Math.atan2(line[3]-line[1],line[2]-line[0]);
    var width=0.1;
    var offset = new Float32Array([Math.sin(theta)*width, -Math.cos(theta)*width]);
    var rectangle = new Float32Array([
        line[0]+offset[0], line[1]+offset[1],
        line[2]+offset[0], line[3]+offset[1],
        line[0]-offset[0], line[1]-offset[1],
        line[2]-offset[0], line[3]-offset[1]
                ]);
    var rect_data = new Float32Array([
    rectangle[0],rectangle[1], 0.5,0.5,0.5,
    rectangle[2],rectangle[3], 0.5,0.5,0.5,  
    rectangle[4],rectangle[5], 0.5,0.5,0.5,
    rectangle[6],rectangle[7], 0.5,0.5,0.5,   
    line[0],line[1], 0.9,0.9,0.9,
    line[2],line[3], 0.9,0.9,0.9    
    ]);
    //console.log(rect_data);
    gl.bufferData(gl.ARRAY_BUFFER, rect_data, gl.DYNAMIC_DRAW);
    //gl.drawArrays(gl.LINES,0,4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
    gl.drawArrays(gl.LINES,4,2);
    for(var i=0;i<5;i++){
        for(var j=0;j<3;j++){
            rect_data[5*i+2+j]=0.1;
        }
    }    
    gl.bufferData(gl.ARRAY_BUFFER, rect_data, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.LINES,0,4);
}

function activateChallenge(){
    var challenge = document.getElementById('challenge');
    challenge.style.display="block";
    challengeStatus=1;
}