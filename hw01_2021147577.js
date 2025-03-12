const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if(!gl){
    console.error('Webgl2 is not sopported by your browser');
}

canvas.width = 500;
canvas.height = 500;

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
render();

rerender();

function rerender(){
    halfWidth = canvas.width / 2;
    halfHeight = canvas.height / 2;

    gl.enable(gl.SCISSOR_TEST);

    gl.scissor(0, 0, halfWidth, halfHeight);
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    render();
    
    gl.scissor(halfWidth, 0, halfWidth, halfHeight);
    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    render();
    
    gl.scissor(0, halfHeight, halfWidth, halfHeight);
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    render();
    
    gl.scissor(halfWidth, halfHeight, halfWidth, halfHeight);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    render();
    
    gl.disable(gl.SCISSOR_TEST);
}

function render() {gl.clear(gl.COLOR_BUFFER_BIT);}

window.addEventListener('resize', () => {
    min_size = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;

    canvas.width = min_size;
    canvas.height = min_size;
    rerender();
})