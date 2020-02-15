const si = require('systeminformation');

const cpuStats = [
    si.cpu,
    //si.cpuFlags,
    si.cpuCache,
    //si.cpuCurrentspeed,
    si.cpuTemperature,
    si.currentLoad,
    // si.fullLoad
];

const processesStats = [
    si.processes
];

const memStats = [si.mem, si.memLayout];
const sysStats = [
    si.system,
    si.osInfo,
    // si.bios,
    // si.chassis
];
const powerStats = [si.battery];
const netStats = [
    //si.networkInterfaceDefault,
    //si.networkGatewayDefault,
    //si.networkInterfaces,
    si.networkStats,
    //si.networkConnections,
    //si.wifiNetworks
];

const statGroups = {
    cpuStats,
    memStats,
    sysStats,
    processesStats,
    // powerStats,
    netStats
};

const getStatsByGroup = async (key) => {    
    let promises = statGroups[key].map(stat => stat());
    try {
        return await Promise.all(promises);
    } catch (error) {
        console.error(error)
    }
};

const getProcessesData = async () => {
    
    const processesStatsResponse = await getStatsByGroup('processesStats');
    const topProcesses = processesStatsResponse[0].list
        .slice(0, 5)
        .map(process => ({
            name: process.name,
            load: process.pcpu.toFixed(0),
            user: process.user,
            pid: process.pid
        }));
            
    return {
        all: processesStatsResponse[0].all,
        running: processesStatsResponse[0].running,
        sleeping: processesStatsResponse[0].sleeping,
        topProcesses
    }    
}

getProcessesData();

const getCpuData = async () => {
    const cpuStatsResponse = await getStatsByGroup('cpuStats');
    
    return {
            cpus: cpuStatsResponse[3].cpus.map(cpu => ({ load: cpu.load })),
            temp: cpuStatsResponse[2].main
        };
}

const getSysData = async () => {
    const sysStatsResponse = await getStatsByGroup('sysStats');
    return {
            hardware: sysStatsResponse[0],
            os: sysStatsResponse[1]
        };
}

const getMemData = async () => {
    const memStatsResponse = await getStatsByGroup('memStats');
    return {
        total: memStatsResponse[0].total,
        free: memStatsResponse[0].free,
        active: memStatsResponse[0].active,
        available: memStatsResponse[0].available
    }
}

const getNetData = async () => {
    const netStatsResponse = await getStatsByGroup('netStats');
    console.log(netStatsResponse[0][0]);
    
    return {
        interface: netStatsResponse[0][0].iface,
        status: netStatsResponse[0][0].operstate,
        traffic: {
            // download: (Math.round((netStatsResponse[0][0].rx_sec / 1024 / 1024) * 100) / 100).toFixed(1),
            // upload: (Math.round((netStatsResponse[0][0].tx_sec / 1024 / 1024) * 100) / 100).toFixed(1)
            download: (((netStatsResponse[0][0].rx_sec / 1024 / 1024) * 100) / 10).toFixed(1),
            upload: (((netStatsResponse[0][0].tx_sec / 1024 / 1024) * 100) / 10).toFixed(1)
        }
    }
}

const getStaticData = async () => {
    try {
        return await si.getStaticData();        
    } catch (error) {
        console.error(error);
    }
}

const getStatsData = async () => {
    const cpuStatsResponse = await getStatsByGroup('cpuStats');
   // const memStatsResponse = await getStatsByGroup('memStats');
   // const powerStatsResponse = await getStatsByGroup('powerStats');
    const sysStatsResponse = await getStatsByGroup('sysStats');
    // const netStatsResponse = await getStatsByGroup('netStats');

    return {
        cpu: {
            cpus: cpuStatsResponse[3].cpus,
            temp: cpuStatsResponse[2].main
        },
        // mem: memStatsResponse,
        // power: powerStatsResponse,
        sys: sysStatsResponse,
        // net: netStatsResponse
    }
}

module.exports = {
    cpuStats,
    sysStats,
    powerStats,
    netStats,
    memStats,
    getStatsData,
    getCpuData,
    getSysData,
    getMemData,
    getStaticData,
    getNetData,
    getProcessesData
};
