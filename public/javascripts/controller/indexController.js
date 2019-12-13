app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) =>{
    
    $scope.messages = [ ];
    $scope.players = { };
    $scope.init = () =>{
        const username = prompt('please Enter username');
        if(username){
            initSocket(username);
        }
        else{
            return false;
        }
    };

    function initSocket(username){
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        }
        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
            .then((socket)=>{
                socket.emit('newUser', {username});


                socket.on('initPlayers', (players)=>{
                    $scope.players = players;
                    $scope.$apply();
                });

                socket.on('newUser', (data)=>{
                    const messageData = {
                        type:{
                            code:0, //System message
                            message:1 //User join
                        },
                        username:data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.players[data.id]= data;
                    $scope.$apply();

                    
                });

                socket.on('disUser', (data)=>{
                    const messageData = {
                        type: {
                            code:0,
                            message:0 //User Leave
                        },
                        username:data.username
                    };
                    $scope.messages.push(messageData);
                    delete $scope.players[data.id];
                    $scope.$apply();
                });


                $scope.onClickPlayer = ($event)=>{
                    console.log($event.offsetX, $event.offsetY);
                    let x =$event.offsetX;
                    let y =$event.offsetY;
                    $('#'+socket.id).stop();
                    $('#'+socket.id).animate({'left': x, 'top': y});
                    socket.emit('animate', {x, y});
                }

                socket.on('animate', (data)=>{
                    $('#'+data.id).stop();
                    $('#'+data.id).animate({'left': data.x, 'top': data.y});
                })

                //TEST
            }).catch((err)=>{
                console.log(err);
            });
    }
    
}]);