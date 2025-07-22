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

const maps = []

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
    let m = getField()

    if(!hasThisRoom(value.room)) {
      maps.push({room: value.room, matrix: m})
    }

    io.to(value.room).emit("gameStart", {matrix: m})
  })
  
  socket.on('sendMessage', (value) => {
    if(value.message.trim() !== '') io.to("geral").emit("chat", {username: value.username, message: value.message})
  })

  socket.on('leaveRooms', () => {
    socket.rooms.forEach((r)=>{
      socket.leave(r)
    })
  })

  socket.on('updateGame', (value) => {
    io.to(value.room).emit("updateGame", value)
  })

  socket.on('putRune', (value) => {

    let map = getMapByRoom(value.room)

    if(map !== undefined){
      let newMap = setElementInMatrix(map.matrix, value.x, value.y, 5)
      value.matrix = newMap
      setMap(value.room, newMap)
      io.to(value.room).emit("putRune", value)
    }
  })
  
  socket.on('killPlayer', (value) => {
    io.to(value.room).emit("killPlayer", value)
  })

  socket.on('removeRune', (value) => {
    
    let x = value.x
    let y = value.y
    let power = value.power

    let map = getMapByRoom(value.room)
    

    if(map !== undefined){
      let casasAtingidas = preencherComBloqueio(map.matrix, y, x, power);
      let damageBlocks = []
      casasAtingidas.forEach(c=>{
        let coords = c.split(",")
        damageBlocks.push(coords)
      })

      let auxMap = map.matrix
      damageBlocks.forEach(c=>{
        auxMap = setElementInMatrix(auxMap, Number(c[1]), Number(c[0]), Number(c[2])===0?11:0)
      })
      value.damageBlocks = damageBlocks
      value.matrix = auxMap
      setMap(value.room, auxMap)

      io.to(value.room).emit("removeRune", value)
    }
  })

  socket.on('removeDamageBlocks', (value) => {

    let map = getMapByRoom(value.room)

    if(map !== undefined){
      let auxMap = map.matrix
      value.damageBlocks.forEach(c=>{
        auxMap = setElementInMatrix(auxMap, Number(c[1]), Number(c[0]), 0)
      })
      value.matrix = auxMap
      setMap(value.room, auxMap)

      io.to(value.room).emit("removeDamageBlocks", value)
    }
  })

  //matrix: newMatrix, id: rune.id, x: rune.x, y: rune.y, power: power

  socket.on('disconnect', () => {
    let room = [...socket.rooms].find(room => room.includes("game"));
    io.to("geral").emit("getGames")
  })

  // socket.on('disconnect', () => {
  //   io.to(player.lobbyId).emit("getPlayersInLobby", players)
  // })
  
});

function preencherComBloqueio(matrix, x, y, power, visitado = new Set(), dist = 0) {
    const linhas = matrix.length;
    const colunas = matrix[0].length;

    if (x < 0 || x >= linhas || y < 0 || y >= colunas) return;

    const chave = `${x},${y}`;
    if (visitado.has(chave) || dist > power) return;

    const valor = matrix[x][y];

    if (valor === 1 || valor === 2) return; // parede intransponível

    if (valor === 3) {
        // Transforma em 0, mas NÃO continua — fim da ramificação
        visitado.add(chave+",3");
        return;
    }

    // Se valor é 0, preenche com 2 e continua
    //matrix[x][y] = 0;
    visitado.add(chave+",0");

    // Chamada recursiva nas 4 direções
    preencherComBloqueio(matrix, x + 1, y, power, visitado, dist + 1);
    preencherComBloqueio(matrix, x - 1, y, power, visitado, dist + 1);
    preencherComBloqueio(matrix, x, y + 1, power, visitado, dist + 1);
    preencherComBloqueio(matrix, x, y - 1, power, visitado, dist + 1);
    
    return visitado
}

function hasThisRoom(roomId){
  return maps.some(item => item.room === roomId)
}

function getMapByRoom(roomId){
  return maps.find(item => item.room === roomId) || undefined
}

function setMap(roomId, matrix){
  maps.forEach(m=>{
    if(m.room === roomId){
      m.matrix = matrix
    }
  })
}


export const setElementInMatrix = (matrix, col, row, value) => {
    const novaMatriz = matrix.map((x, i) => 
        i === row
        ? x.map((y, j) => (j === col ? value : y))
        : x
    );

    return novaMatriz;
};
