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


function main(){
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
     
    
    //gl.clearColor(0.0,0.0,0.0,1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    
    var vertexBuffer=gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }
    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
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

var vertices = new Float32Array ([
       -0.5,-0.5, 0.0,0.0,1.0,
       0.0, 0.5,  0.0,0.0,1.0,
       0.5,-0.5, 0.0,0.0,1.0,
       0.0,0.0, 0.0,0.0,1.0
    ]);
var g_points=[];
var mousedown=false;
var evX=0,evY=0;
var rect ;
const res=20;
var curve = new Float32Array(5*res+5);



function draw(gl,canvas){
    
    if(mousedown)
    {
        var x=((evX-rect.left)-canvas.width/2.0)/(canvas.width/2.0);
        var y=(canvas.height/2.0-(evY-rect.top))/(canvas.height/2.0);

        var dist1=Math.abs(vertices[0]-x)+Math.abs(vertices[1]-y);
        var dist2=Math.abs(vertices[5]-x)+Math.abs(vertices[6]-y);
        var dist3=Math.abs(vertices[10]-x)+Math.abs(vertices[11]-y);
        if(dist1<0.2){
            vertices[0]=x;
            vertices[1]=y;
        } else if(dist2<0.2)
        {
            vertices[5]=x;
            vertices[6]=y;
        } else if(dist3<0.2)
        {
            vertices[10]=x;
            vertices[11]=y;
        }
        
        //console.log('x: '+x+', y: '+y);  
    }
    
    
    var slider = document.getElementById("myRange");
    var t=slider.value/100.0;
    vertices[15]=vertices[0]*(1-t)*(1-t)+vertices[5]*t*(1-t)*2+vertices[10]*t*t;
    vertices[16]=vertices[1]*(1-t)*(1-t)+vertices[6]*t*(1-t)*2+vertices[11]*t*t;
    
    
    
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,4);
    gl.lineWidth(2);
    gl.drawArrays(gl.LINE_STRIP,0,3);
    
    fill_curve();
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, curve, gl.DYNAMIC_DRAW);
    
    // assign the buffer object to a_Position variable
    gl.lineWidth(1);
    gl.drawArrays(gl.LINE_STRIP,0,res+1);//*/
    
    
}

function fill_curve(){
    for(var i=0;i<=res;i++){
        var t = i/res;
        curve[5*i]=vertices[0]*(1-t)*(1-t)+vertices[5]*t*(1-t)*2+vertices[10]*t*t;
        curve[5*i+1]=vertices[1]*(1-t)*(1-t)+vertices[6]*t*(1-t)*2+vertices[11]*t*t;
        curve[5*i+2]=0.0; curve[5*i+3]=0.0; curve[5*i+4]=1.0;
    }
}