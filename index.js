const siUtil = require('./si-util');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
	console.log('Well hello there!');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    emitStaticData();
    emitCpuData();
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3120, function () {
    console.log('listening on *:3120');
});

const emitStaticData = async () => {
    const staticDataResponse = await siUtil.getStaticData();
    console.log('staticData:', staticDataResponse);
    io.emit('soc_static_data', staticDataResponse); // This will emit the event to all connected sockets

};

const emitServicesData = async () => {
    const servicesDataResponse = await siUtil.getServicesData();
    console.log('servicesData:', servicesDataResponse);
    io.emit('soc_services_data', servicesDataResponse); // This will emit the event to all connected sockets

};

const emitCpuData = async () => {
    const cpuDataResponse = await siUtil.getCpuData();
    console.log('cpuData:', cpuDataResponse);
    io.emit('soc_cpu_data', cpuDataResponse); // This will emit the event to all connected sockets
};

const emitMemData = async () => {
    const memDataResponse = await siUtil.getMemData();
    console.log('memData:', memDataResponse);
    io.emit('soc_mem_data', memDataResponse); // This will emit the event to all connected sockets
};

const emitNetData = async () => {
    const netDataResponse = await siUtil.getNetData();
    console.log('netData:', netDataResponse);
    io.emit('soc_net_data', netDataResponse); // This will emit the event to all connected sockets
};

const emitProcessesData = async () => {
    const processesDataResponse = await siUtil.getProcessesData();
    console.log('procData:', processesDataResponse);
    io.emit('soc_processes_data', processesDataResponse); // This will emit the event to all connected sockets
};

// 1 SEC
setInterval(async () => {
    emitCpuData();
    emitNetData();
    emitServicesData();
    
}, 1000)

// 5 SEC
setInterval(async () => {
    emitMemData();
    emitProcessesData();
}, 5000)


// 25 HOURS
setInterval(async () => {
    emitStaticData();
}, 3600000)
