# MiniCommerce

MiniCommerce es una aplicación híbrida de comercio electrónico desarrollada con Ionic, Angular y Cordova.

Permite registrar usuarios, iniciar sesión, consultar productos, agregar productos al carrito, realizar compras y publicar reseñas. La aplicación utiliza Firebase para autenticación y persistencia, por lo que el APK puede funcionar sin depender de un backend local.

## Tecnologías utilizadas

- Ionic
- Angular
- TypeScript
- Cordova
- Firebase Authentication
- Cloud Firestore
- Bootstrap
- Android SDK

## Funcionalidades

- Registro de usuarios
- Inicio y cierre de sesión
- Catálogo de productos
- Carrito de compras
- Control de cantidades
- Eliminación de productos del carrito
- Confirmación de compra
- Registro de pedidos
- Reseñas y calificaciones
- Persistencia de datos en Firebase
- Diseño adaptable para escritorio y dispositivos móviles

## Firebase

El proyecto utiliza Firebase Authentication con correo y contraseña y Cloud Firestore para almacenar la información.

Colecciones utilizadas:

```text
users
products
reviews
orders
```

## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm
- Ionic CLI
- Cordova
- JDK 17
- Android Studio
- Android SDK Platform 36
- Gradle 8.14.2

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```bash
cd mini-commerce-ionic-cordova
```

Instalar las dependencias:

```bash
npm install
```

En Windows, si PowerShell bloquea los scripts, se puede usar:

```powershell
npm.cmd install
```

## Ejecutar en navegador

Desde la raíz del proyecto:

```bash
ionic serve
```

En Windows:

```powershell
ionic.cmd serve
```

La aplicación se abrirá normalmente en:

```text
http://localhost:8100
```

## Configuración de Firebase

La configuración se encuentra en:

```text
src/app/core/firebase.config.ts
```

Para utilizar otro proyecto de Firebase se deben reemplazar los datos de configuración por los correspondientes al nuevo proyecto.

También es necesario habilitar:

```text
Firebase Authentication
→ Sign-in method
→ Email/Password
```

Y crear una base de datos en:

```text
Firestore Database
```

## Estructura de Firestore

```text
users
└── userId
    ├── id
    ├── name
    └── email

products
└── productId
    ├── name
    ├── description
    ├── price
    ├── image
    └── isActive

reviews
└── reviewId
    ├── userId
    ├── userName
    ├── rating
    ├── comment
    └── createdAt

orders
└── orderId
    ├── userId
    ├── userName
    ├── userEmail
    ├── items
    ├── total
    ├── status
    └── createdAt
```

## Reglas de Firestore

Para una versión final se recomienda mantener reglas que permitan:

- lectura pública de productos;
- creación de reseñas únicamente para usuarios autenticados;
- creación de pedidos únicamente para usuarios autenticados;
- lectura de pedidos únicamente por su propietario;
- acceso al perfil únicamente por el usuario correspondiente.

No se recomienda dejar Firestore abierto con:

```text
allow read, write: if true;
```

## Generar la aplicación Android

Verificar primero el entorno:

```powershell
cordova.cmd requirements android
```

Compilar Ionic:

```powershell
ionic.cmd build
```

Preparar Android:

```powershell
cordova.cmd prepare android
```

Generar el APK:

```powershell
cordova.cmd build android
```

El APK de desarrollo se genera normalmente en:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Para localizarlo:

```powershell
Get-ChildItem . -Recurse -Filter *.apk | Select-Object FullName
```

## Instalar el APK

El APK puede copiarse directamente a un teléfono Android e instalarse manualmente.

También puede instalarse mediante ADB:

```powershell
adb devices
```

```powershell
adb install -r ".\platforms\android\app\build\outputs\apk\debug\app-debug.apk"
```

## Consideraciones

- El carrito mantiene información temporal mientras el usuario realiza la compra.
- Los pedidos finalizados se almacenan en Firestore.
- La autenticación es gestionada por Firebase Authentication.
- La aplicación necesita conexión a Internet para utilizar Firebase.
- No es necesario mantener un backend local ejecutándose para utilizar el APK.
- Las imágenes de los productos se encuentran dentro de los assets de la aplicación.

## Limpieza de caché

Si se presentan problemas después de modificar dependencias o configuración:

```powershell
Remove-Item -Recurse -Force .\.angular -ErrorAction SilentlyContinue
```

Luego:

```powershell
ionic.cmd serve
```
