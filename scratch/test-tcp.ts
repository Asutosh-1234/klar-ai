import * as net from 'net';

const host = 'ep-red-sun-aqfj08i6-pooler.c-8.us-east-1.aws.neon.tech';
const port = 5432;

console.log(`Connecting to ${host}:${port} with family: 4...`);

const socket = net.connect({ host, port, family: 4 }, () => {
    console.log('SUCCESS: TCP connection established with family: 4!');
    socket.destroy();
});

socket.on('error', (err: any) => {
    console.error('ERROR:', err);
});
