const canvas =  document.getElementById("canPong");
const ctx = canvas.getContext("2d");

//create user paddle.
const user = {
  x : 0,
  y :canvas.height/2 - 50,
  width : 10,
  height : 100,
  color : "WHITE",
  score : 0
}
//create com paddle
const com = {
  x : canvas.width-10,
  y :canvas.height/2 - 50,
  width : 10,
  height : 100,
  color : "WHITE",
  score : 0
}
//create ball
const ball ={
  x: canvas.width/2,
  y: canvas.height/2,
  radius: 10,
  speed: 10,
  velocityX: 10,
  velocityY: 10
}
// create net
const net = {
  x:canvas.width/2 - 1,
  y:0,
  width:2,
  height:10,
  color:"WHITE"
}

// draw rect function
function drawRec(x,y,w,h,color)
{
  ctx.fillStyle = color;
  ctx.fillRect(x,y,w,h);
}

//draw circle function
function drawCircle(x,y,r,color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2,false); // if we write 360 , that will work but that is not appropriate to use,but if we use PI it will give hal
  // circle, but if we write 90 or 180 straight firward then it will give full circle.
  ctx.closePath();
  ctx.fill();
}

// draw text function.
function drawText(text,x,y,color)
{
  ctx.fillStyle = color;
  ctx.font = "45px fantasy";
  ctx.fillText(text,x,y);
}

// draw net function
function drawNet()
{
  for(let i = 0; i<=canvas.height; i+=15)
  {
    drawRec(net.x,net.y+i,net.width,net.height,net.color);
}
}



function render()
{
  // clear cnavas
  drawRec(0,0,canvas.width,canvas.height,"BLACK");

  // draw the net
  drawNet();

  // draw score
  drawText(user.score,canvas.width/4,canvas.height/5,"WHITE");
  drawText(com.score,3*canvas.width/4,canvas.height/5,"WHITE");

  //draw user paddle
  drawRec(user.x,user.y,user.width,user.height,"WHITE");

  // draw computer paddle
  drawRec(com.x,com.y,com.width,com.height,"WHITE");

  // draw the ball
  drawCircle(ball.x,ball.y,ball.radius,"WHITE");

}





// game function
function game()
{
  render();
  update(); // for score, collision detection , movement
}

const framePerSecond = 100;
setInterval(game, 1000/framePerSecond);

// collision detection
function collision(b,p)
{
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right  = p.x + p.width;

  return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom ;
}

// control the user paddle.
canvas.addEventListener("mousemove",movePaddle);

function movePaddle(evt){
  let rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height/2;
  // we cant control the rectangel(user paddle ) from outside the canvas.

}

// resetting the Ball
function resetBall(){
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speed = 10;
  ball.velocityX = -ball.velocityX;
}

function update()
{
    ball.x +=ball.velocityX;
    ball.y += ball.velocityY;

    // simple computer ai
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    // when the ball hits top or bottom of canvas.
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius <0){
      ball.velocityY = - ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com ;
    if(collision(ball,player))
    {
      // where the ball hit the player
      let collidePoint = ball.y - (player.y + player.height/2);
      // normalization
      collidePoint = collidePoint/(player.height/2);
      // claculate angle in radian
      let angleRad = collidePoint * Math.PI/4;
      // X direction of the ball when it hits
      let direction = (ball.x < canvas.width/2) ? 1 : -1;
      // change vel X and Y
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      // every time ball hits the paddle we increase the speed.
      ball.speed += 0.1;
}
      // update score
      if((ball.x - ball.radius) <0)
      {
        // com won
        com.score++;
        resetBall();
      }
      else if((ball.x + ball.radius) > canvas.width)
      {
        // user won
        user.score++;
        resetBall();
      }
}
