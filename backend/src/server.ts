import {Server} from 'http';
import app from "./app";
import config from './config';
import { Transporter } from './helpers/Transporter';

async function bootstrap(){
    const server:Server = app.listen(config.port, () =>{
        console.log(`Server running on port ${config.port}`);
    });

    const exitHandler = () =>{
        if(server){
            server.close(() =>{
                console.log('Server Close')
            })
        }
    };

    // Verify mail transporter but don't exit on failure
    try {
        Transporter.verify().then(() => {
            console.log('Mail transporter verified');
        }).catch((err) => {
            console.warn('Mail transporter verification failed:', err && err.message ? err.message : err);
        });
    } catch (err) {
        console.warn('Mail transporter verify error:', err);
    }

    const unexpectedHandler = () =>{
        console.log('Handler Error');
        exitHandler();
    }
    process.on('uncaughtException', unexpectedHandler);
    process.on('unhandledRejection', unexpectedHandler);

    process.on('SIGTERM', () =>{
        console.log('Sigterm Recieved');
        if(server){
            server.close();
        }
    })
}

bootstrap();