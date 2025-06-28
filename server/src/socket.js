import io from "./server.js"

export const matrix = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,9,9,0,0,0,0,0,0,0,0,0,0,0,9,9,1,],
    [1,9,2,0,2,0,2,0,2,0,2,0,2,0,2,9,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,1,],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
    [1,9,2,0,2,0,2,0,2,0,2,0,2,0,2,9,1,],
    [1,9,9,0,0,0,0,0,0,0,0,0,0,0,9,9,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]
] 

const getField=()=>{
    let index = 0;

    let indexList = new Array()
    let newMatrix = matrix

    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 0) {
                indexList.push(index);
            }
            index++;
        }
    }
    
    for (let i = 0; i < 100; i++) {
        const randomIndex = Math.floor(Math.random() * indexList.length);
        let x = Math.floor(indexList[randomIndex] / 17)
        let y = (indexList[randomIndex] % 17)
        newMatrix = updateField(newMatrix, x, y)
        indexList.splice(randomIndex, 1);
    }

    return newMatrix.map(row =>
      row.map(valor => (valor === 9 ? 0 : valor))
    );
}

const updateField = (newMatrix, x, y) => {
  return newMatrix.map((row, i) =>
    i === x
      ? row.map((value, j) => (j === y ? 3 : value))
      : row
  )
}

io.on('connection', (socket) => {
  console.log('a user connected | id: '+socket.id);

  socket.on('joinMainLobby', (value) => {
    socket.join("geral")
  })

  socket.on('leaveMainLobby', (value) => {
    socket.leave("geral")
  })

  socket.on('joinGameLobby', (value) => {
    socket.join(value.room)
    io.to("geral").emit("getGames")
    io.to(value.room).emit("getGame")
  })

  socket.on('leaveGameLobby', (value) => {
    socket.leave(value.room)
    io.to("geral").emit("getGames")
    io.to(value.room).emit("getGame")
  })

  socket.on('gameStart', (value) => {
    io.to(value.room).emit("gameStart", {matrix: getField()})
  })
  
  socket.on('sendMessage', (value) => {
    if(value.message.trim() !== '') io.to("geral").emit("chat", {username: value.username, message: value.message})
  })

  socket.on('leaveRooms', () => {
    socket.rooms.forEach((r)=>{
      socket.leave(r)
    })
  })

  socket.on('disconnect', () => {
    let room = [...socket.rooms].find(room => room.includes("game"));
    io.to("geral").emit("getGames")
  })

  // socket.on('disconnect', () => {
  //   io.to(player.lobbyId).emit("getPlayersInLobby", players)
  // })
  
});