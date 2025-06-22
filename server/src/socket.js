import io from "./server.js"

io.on('connection', (socket) => {
  console.log('a user connected | id: '+socket.id);

  socket.on('joinMainLobby', (value) => {
    socket.join(value.join)
  })
  
  socket.on('sendMessage', (value) => {
    if(value.message.trim() !== '') io.to("geral").emit("chat", {username: value.username, message: value.message})
  })

  // socket.on('disconnect', () => {
  //   io.to(player.lobbyId).emit("getPlayersInLobby", players)
  // })
  
});