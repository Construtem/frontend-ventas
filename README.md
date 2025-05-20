# Frontend - Ventas

Este repositorio contiene el frontend del módulo de **ventas** para el sistema digital de la ferretería Construtem.

## 🛠️ Tecnologías
- Next.js

## 🚀 Funcionalidades
- Gestión de productos disponibles para la venta.
- Creación de nuevas órdenes de compra.
- Consulta de historial de ventas.
- Interacción con backend-ventas a través de API Gateway.

## 📂 Estructura principal
- Por definir

  ## Instalación (entorno de desarrollo)

1. Clonar el repositorio en el directorio deseado:

*Desde la terminal debe situarse en el directorio que desee clonar repo (ej: "C:\Users\Admin\Desktop") y ejecutar siguiente comando*

<details>

<summary>**¿Cómo situarse en C:\Users\Admin\Desktop?**</summary>

1. Abrir terminal (Ya sea powershell, cmd, git bash, etc)
2. Te encontrarás situado en C:\Users\Admin o algo así
3. Debes ejecutar el comando
```bash
cd .\Desktop\
```
*Cualquier consulta escribirme a wsp +56979828311*
</details>

```bash
git clone https://github.com/Construtem/frontend-ventas
cd frontend-ventas
```
2. Construir imagen desde el directorio creado (ej "C:\Users\Admin\Desktop\frontend-ventas"), debe ejecutar el siguiente comando:

```bash
docker build -t front-ventas .
```
*Esto creará una imagen que contiene todas las dependencias y lo necesario para correr su app en forma local*

3. Correr la imagen creada:

```bash
docker run -p 3000:3000 front-ventas
```
*Luego de ejecutar este comando, su app se encontrará corriendo en el puerto 3000 en "http://localhost:3000"*

## Contribución

1. Crea una rama para tu funcionalidad/tarea:

```bash
git switch -c feature/<nombre-funcionalidad>
```

2. Realiza cambios y haz commit:

```bash
git add <archivos-cambiados>
git commit -m "<descripcion pequeña del cambio>"
```

3. Pushea tus cambios de la rama:

```bash
git push origin feature/<nombre-funcionalidad> 
```

4. Crea un Pull Request (PR) a la rama ´develop´ desde GitHub para que sea revisado por otro desarrollador
