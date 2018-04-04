// gl_line.js

// Vertex Shader Program
var VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'void main() {\n' +
        ' gl_Position=a_Position;\n' +
        ' gl_PointSize = 10.0;\n' +
        '}\n';

// Fragment Shader Program
var FSHADER_SOURCE =
        'void main() {\n' +
        ' gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
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
     
    /*var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0){
        console.log('Failed to find a_Position');
        return;
    }
    
    gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);//*/
    
    //var n = initVertexBuffers(gl);
    //if(n<0){
    //    console.log('Failed to set the positions of the vertices');
    //    return;
    //}
    
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
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

function initVertexBuffers(gl){
    var vertices = new Float32Array ([
       -0.5,0.0, 0.5, -0.0,  
    ]);
    var n=2;
    // Create a buffer object
    var vertexBuffer=gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }
    // Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0){
        console.log('Failed to find a_Position');
        return;
    }
    // assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    return n;
    
}
var vertices = new Float32Array ([
       -0.5,0.0, 0.5, -0.0,  0.0,0.0
    ]);
var g_points=[];
var mousedown=false;
var evX=0,evY=0;
var rect ;

function click(ev,gl,canvas){
    console.log('Click registered');  
    
    
    var x=ev.clientX;
    var y=ev.clientY;
   
    
    x=((x-rect.left)-canvas.width/2.0)/(canvas.width/2.0);
    y=(canvas.height/2.0-(y-rect.top))/(canvas.height/2.0);
    
    vertices[0]=x;
    vertices[1]=y;
    console.log('x: '+x+', y: '+y);  
    
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0){
        console.log('Failed to find a_Position');
        return;
    }
    // assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,2);
    gl.lineWidth(2);
    gl.drawArrays(gl.LINES,0,2);
    
    // is mouse up?
    //canvas.onmouseup
}

function draw(gl,canvas){
    
    if(mousedown)
    {
        var x=((evX-rect.left)-canvas.width/2.0)/(canvas.width/2.0);
        var y=(canvas.height/2.0-(evY-rect.top))/(canvas.height/2.0);

        var dist1=Math.abs(vertices[0]-x)+Math.abs(vertices[1]-y);
        var dist2=Math.abs(vertices[2]-x)+Math.abs(vertices[3]-y);
        if(dist1<0.2){
            vertices[0]=x;
            vertices[1]=y;
        } else if(dist2<0.2)
        {
            vertices[2]=x;
            vertices[3]=y;
        }
        
        console.log('x: '+x+', y: '+y);  
    }
    
    
    var slider = document.getElementById("myRange");
    var t=slider.value/100.0;
    vertices[4]=vertices[0]*(1-t)+vertices[2]*t;
    vertices[5]=vertices[1]*(1-t)+vertices[3]*t;
    
    
    
    //mousedown=false;
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0){
        console.log('Failed to find a_Position');
        return;
    }
    // assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,3);
    gl.lineWidth(2.0);
    gl.drawArrays(gl.LINES,0,2);
    
    
}