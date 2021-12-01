import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,

   urlSuperGo: '',                        
  

  logLevel: NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.OFF,
  disableConsoleLogging: false,

  tiempoCierreSession: 900000,
  tiempoInactividad: 840000,




};
