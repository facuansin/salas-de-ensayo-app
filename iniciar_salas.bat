@echo off
title Salas de Ensayo Web
echo Iniciando Salas de Ensayo App...
set Path=%Path%;C:\Program Files\nodejs\
start http://localhost:3000
call npm.cmd run dev
pause
