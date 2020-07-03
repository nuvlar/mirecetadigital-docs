# MiRecetaDigital API


Bienvenido a la documentación del API de MiRecetaDigital. Todas las llamadas al API requieren la presencia de un token de autentificación generado por nosotros. Si deseas implementar los servicios de MiRecetaDigital en tu sitio web puedes contactarnos a `direccion@mirecetadigital.com`.


Cada App que utilice el servicio de MRD recibirá uno o más tokens de autenticación. Cada token podrá tener uno o más de los siguientes permisos:

- **MANAGE_MEDICS**: Permite agregar, modificar y listar médicos.
- **READ_MEDICS**: Permite listar médicos.
- **MANAGE_PATIENTS**: Permite agregar, modificar y listar pacientes.
- **READ_PATIENTS**: Permite listar pacientes.
- **MANAGE_PRESCRIPTIONS**: Permite agregar y listar recetas.
- **READ_PRESCRIPTIONS**: Permite listar recetas.
- **MANAGE_ANALYSIS**: Permite agregar y listar solicitudes de análisis.
- **READ_ANALYSIS**: Permite listar solicitudes de análisis
 
Todas las demás llamadas al API (como listado de medicamentos y análisis) son accesibles por cualquier token sin importar permisos.

Los tokens serán generados por parte de MRD y tendrán que ser enviados a través del parámetro _token dentro de cada petición a la API.


# Índice

* [Conexiones a API](#conexiones-a-api)
* [Estructura de objetos de API](#estructura-de-objetos-de-api)
* [Llamadas a API](#llamadas-a-api)
* [Errores devueltos por el API](#errores-devueltos-por-el-api)
* [Javascript API](#javascript-api)

  
# Conexiones a API

El API de MRD se puede acceder a través del estándar JSON-RPC a través de peticiones POST al siguiente endpoint:

`https://mirecetadigital.com/api/v1/endpoint.php`
  

Cada petición POST tendrá que contener en su payload un objeto JSON con la siguiente estructura:

  
```json
{
   "jsonrpc":"2.0",
   "method":"<modelo>.<accion>",
   "id":"<identificador de peticion (arbitrario, generado por cliente)>",
   "params":{
      "_token":"<token generado por MRD>",
      "foo":"bar"
   }
}
```
  

A cada una de estas peticiones el servidor responde con un objeto JSON como el siguiente (la variable live_mode indica si la petición se realizó a una app en modo producción (1) o en modo pruebas (0).:

  
```json
{
   "jsonrpc": "2.0",
   "id":"<identificador de peticion (arbitrario, generado por cliente)>",
   "result": {
      "live_mode":1,
      "foo":"bar"
   }
}
```

En caso de existir un error, el sistema responde con un objeto json como el siguiente:

```json
{
   "jsonrpc": "2.0",
   "id": "<identificador de peticion (arbitrario, generado por cliente)>",
   "error": {
      "code": 10001,
      "message": "Hubo un error",
      "data": ""
   }
}
```

# Estructura de objetos de API


## MEDIC

```json
{
   "live_mode":1,
   "id":1231,
   "medic_id":1231,
   "user_id":4563,
   "first_name":"Juan",
   "last_name":"Pérez Pérez",
   "email":"juan@mail.com",
   "license":12345678,
   "institution":"Universidad Nacional Autónoma de México",
   "specialty":"Cirugía General",
   "work_place":"Centro Médico Nacional, Calle.....",
   "work_phone":5555555555,
   "public_certificate":"https://mirecetadigital.com/link_a_archivo_pem"
{
```
## PATIENT

```json
{
   "live_mode":1,
   "id":1232,
   "patient_id":1232,
   "user_id":4563,
   "first_name":"Juan",
   "last_name":"Pérez Pérez",
   "email":"juan@mail.com",
   "birthdate":"1991-03-24",
   "weight":83.5,
   "height":186.2
}
```
## PRESCRIPTION

```json
{
   "live_mode":1,
   "medic_id":1231,
   "patient_id":1232,
   "medic":"{object medic}",
   "patient":"{object patient}",
   "timestamp_created":1593701796,
   "timestamp_dispatched":1593701796,
   "timestamp_expiration":1593701796,
   "dispatched":0,
   "qr_hash":"SKHRUEK12372SHA",
   "digital_signature":"{hash de firma digital}",
   "json":"{objeto json firmado con datos de receta}",
   "medicines":[
      {
         "id":123,
         "medicine_id":123,
         "name":"Flanax",
         "group":0,
         "group_name":"NO_CONTROLADO",
         "observations":"Nombre comercial de Bayer para medicamento con naproxeno sódico como ingrediente activo",
         "units":2,
         "dispatched":1,
         "indications":"Tomar una cápsula cada 8 horas los 4 días siguientes al procedimiento",
         "active_ingredients":[
            {
               "id":234,
               "name":"naproxeno sódico"
            }
         ],
         "dispatches":[
            {
               "id":826,
               "timestamp_dispatched":1593701796
            }
         ]
         
      }
   ]
}
```

## ANALYSIS

```json
{
   "id":123,
   "analysis_id":123,
   "name":"Perfil tiroideo T4",
   "description":"Examen sanguíneo utilizado para medir el nivel de a hormonas tiroideas libres y hormonas vinculadas a proteínas portadoras",
   "type":1,
   "type_name":"LABORATORIO"
}
```

## ANALYSIS_REQUEST

```json
{
   "id":123,
   "analyses_request_id":123,
   "medic_id":1231,
   "patient_id":1232,
   "timestamp_created":1593701796,
   "timestamp_dispatched":1593701796,
   "timestamp_expiration":1593701796,
   "qr_hash":"FHEUHFSK23JI423",
   "analysis_url":"https://mirecetadigital.com/link_a_archivo_de_resultado_de_análisis",
   "analyses":[
      {
         "id":123,
         "analysis_id":123,
         "name":"Perfil tiroideo T4",
         "description":"Examen sanguíneo utilizado para medir el nivel de a hormonas tiroideas libres y hormonas vinculadas a proteínas portadoras",
         "type":1,
         "type_name":"LABORATORIO",
         "observations":"Indicaciones a llevarse a cabo por parte del laboratorio",
         "motive":"Paciente presenta síntomas de hipotiroidismo.",
         "indications":"Atender al examen en ayuno."
      }
   ]
}
```
## MEDICINE

```json
{
   "id":123,
   "medicine_id":123,
   "name":"Flanax",
   "group":0,
   "group_name":"NO_CONTROLADO",
   "observations":"Nombre comercial de Bayer para medicamento con naproxeno sódico como ingrediente activo",
   "active_ingredients":[
      {
         "id":234,
         "name":"naproxeno sódico"
      }
   ]
}
```

# Llamadas a API

## medic.create

Utiliza esta llamda para agregar un médico a tu app.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|first_name|string|Sí|Nombre o nombres del médico|
|last_name|string|Sí|Apellidos del médico|
|email|string|Sí|Dirección de email del médico|
|license|string|Sí|Número de cédula profesional del médico|
|institution|string|Sí|Institución que expidió la certificación del médico|
|speciality|string|Sí|Especialidad (si son varias separar por comas)|
|work_place|string|Sí|Nombre y dirección de lugar de trabajo (sin estructura definida, aparecerá en las recetas)|
|work_phone|string|Sí|Teléfono de contacto del médico|
|public_certificate|string|Sí|String codificado en base64 del archivo .cer de la e.firma del médico|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "first_name":"",
   "last_name":"",
   "email":"",
   "license":"",
   "institution":"",
   "speciality":"",
   "work_place":"",
   "work_phone":"",
   "public_certificate":""
}
```
returns => { medic_id: int, medic: MEDIC }

## medic.edit

Llamada utilizada para cambiar los datos del médico.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|Sí|El identificador del médico en MRD|
|first_name|string|No|Nombre o nombres del médico|
|last_name|string|No|Apellidos del médico|
|email|string|No|Dirección de email del médico|
|license|string|No|Número de cédula profesional del médico|
|institution|string|No|Institución que expidió la certificación del médico|
|speciality|string|No|Especialidad (si son varias separar por comas)|
|work_place|string|No|Nombre y dirección de lugar de trabajo (sin estructura definida, aparecerá en las recetas)|
|work_phone|string|No|Teléfono de contacto del médico|
|public_certificate|string|No|String codificado en base64 del archivo .cer de la e.firma del médico|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":1234,
   "first_name":"?",
   "last_name":"?",
   "email":"?",
   "license":"?",
   "institution":"?",
   "speciality":"?",
   "work_place":"?",
   "work_phone":"?",
   "public_certificate":"?"
}
```
returns => { medic: MEDIC }

  
## medic.get

Llamada para traer la información de un médico desde el API.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|Sí|Identificador único del médico en MRD|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123
}
```
returns => { medic: MEDIC }

## medic.list

Lista los médicos en un arreglo.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|search|string|No|Parámetro de búsqueda de doctor (se buscará en nombre y apellidos). Si no se envía se regresarán todos los doctores de la app |
|page|int|No|Parámetro de paginado, comienza en `0`. Si no se envía se enviará la primera página. La candidad de resultados por página es 20|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
    "search": "search string"
}
```
  returns => { medics: MEDIC [ ] }
  

## patient.create

Se crea un paciente en la plataforma.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|first_name|string|Sí|Nombre o nombres del paciente|
|last_name|string|Sí|Apellidos del paciente|
|email|string|Sí|Dirección de email del paciente|
|birthdate|string|No|Fecha de nacimiento del paciente (en formato yyyy-mm-dd)|
|weight|float|No|Peso del paciente en kg|
|height|float|No|Altura del paciente en cm|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "first_name":"Juan",
   "last_name":"Pérez Pérez",
   "email":"juan@mail.com",
   "birthdate":"1991-03-24",
   "weight":83.5,
   "height":186.2
}
```

returns => { patient_id: int, patient: PATIENT }

## patient.edit

Edita un paciente

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|patient_id|int|Sí|Identificador de paceinte en MRD|
|first_name|string|No|Nombre o nombres del paciente|
|last_name|string|No|Apellidos del paciente|
|email|string|No|Dirección de email del paciente|
|birthdate|string|No|Fecha de nacimiento del paciente (en formato yyyy-mm-dd)|
|weight|float|No|Peso del paciente en kg|
|height|float|No|Altura del paciente en cm|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "patient_id":123,
   "first_name":"Juan",
   "last_name":"Pérez Pérez",
   "email":"juan@mail.com",
   "birthdate":"1991-03-24",
   "weight":83.5,
   "height":186.2
}
```
returns => { patient: PATIENT }

## patient.get

Solicita la información de un paciente

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|patient_id|int|Sí|Identificador de paceinte en MRD|

### Ejemplo de llamada:
  
```json
{
   "_token":"<API_TOKEN>",
   "patient_id":123
}
```
returns => { patient: PATIENT }

  
## patient.list

Lista los pacientes de la app

### Parámetros

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|search|string|No|Texto a buscar en nombre y apellido|
|page|int|No|Parámetro de paginado, comienza en `0`. Si no se envía se enviará la primera página. La candidad de resultados por página es 50|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "search": "search string"
}
```
returns => { patients: PATIENT [ ] }

## prescription.keyToPem

Utiliza esta llamada para decodificar el archivo .key de la e.firma del doctor hacia un formato .pem que CryptoJS pueda utilizar. Esta firma nunca se guardará en nuestros servidores.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|key_file|string|Sí|Archivo .key codificado en base64|
|password|string|Sí|Contraseña de la llave privada .key|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "key_file":"",
   "password":""
}
```
returns => { pem: string }

## prescription.createJson

Crea un texto con un objeto JSON y un token de autentificación. El objeto JSON tendrá que ser firmado por la librería de Javascript de MRD para poder crearse la receta.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|Sí|El id de MRD del médico que expide la receta|
|patient_id|int|Sí|El id del paciente que recibe la receta|
|medicines|object array|Sí|Arreglo de objetos con las siguientes características:|
|&nbsp;&nbsp;&nbsp;&nbsp;medicine_id|int|Sí|Id del medicamento que se receta|
|&nbsp;&nbsp;&nbsp;&nbsp;indications|string|Sí|Indicaciones al paciente del medicamento|
|&nbsp;&nbsp;&nbsp;&nbsp;units|int|Sí|Cantidad de unidades del medicamento a surtir|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123,
   "patient_id":456,
   "medicines":[
      {
         "medicine_id":123,
         "indications":"Tomar cada 8 horas por 3 días",
         "units":2
      }
   ]
}
``` 

returns => { prescription_json: string, prescription_token: string }

## prescription.create

Crea una receta a partir del JSON de receta firmado con la librería de Javascript

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|Sí|El id del médico que expide la receta|
|patient_id|int|Sí|El id del paciente que recibe la receta|
|prescription_json|string|Sí|El objeto JSON recibido de la llamada `prescription.createJson`|
|digital_signature|string|Sí|La firma digital arrojada por la librería de Javascript sobre el objeto JSON|
|prescription_token|string|Sí|El token recibido de la llamada `prescription.createJson`|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123,
   "patient_id":456,
   "prescription_json":"JSON string regresado por prescription.createJson",
   "digital_signature":"Firma calculada con la librería de JS y la llave privada del doctor.",
   "prescription_token":"Token regresado por prescription.createJson"
}
```
  
returns => { prescription_id: int, prescription: PRESCRIPTION }

## prescription.get

Solicita los datos de una receta

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|prescription_id|int|Sí|El id de la receta a solicitar|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "prescription_id":123
}
```

returns => { prescription_id: int, prescription: PRESCRIPTION }

## prescription.list

Lista las recetas de la app

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|No|Si se envía este parámetro se regresarán las recetas emitidas por el médico en cuestión|
|patient_id|int|No|Si se envía este parámetro se regresarán las recetas emitidas para el paciente en cuestión|
|page|int|No|Parámetro de paginado, comienza en `0`. Si no se envía se enviará la primera página. La candidad de resultados por página es 20|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123
}
```

returns => { prescriptions: PRESCRIPTION [ ] }
  
## analysis.list

Lista los tipos de análisis que se pueden utilizar para crear una solicitud de análisis

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|search|string|No|Se filtran los análisis por nombre|
|page|int|No|Parámetro de paginado, comienza en `0`. Si no se envía se enviará la primera página. La candidad de resultados por página es 50|

### Ejemplo de llamada:

Usado para buscar analisis a poner en solicitudes de laboratorio / gabinete

```json
{
   "_token":"<API_TOKEN>",
   "search":"" 
}
```
returns => { analyses: ANALYSIS [ ] }

## analysisRequest.create

Crea una solicitud de análisis, para que un laboratorio o gabinete la realice

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|Sí|El médico que expide la solicitud de análisis|
|patient_id|int|Sí|El paciente al que se solicita el análisis|
|analyses|object array|Sí|Arreglo de objetos con los análisis requeridos. Contiene los siguientes parámetros:|
|&nbsp;&nbsp;&nbsp;&nbsp;id|int|Sí|El id de análisis regresado por `analysis.list`|
|&nbsp;&nbsp;&nbsp;&nbsp;observations|string|No|Observaciones de análisis, para los especialistas del laboratorio|
|&nbsp;&nbsp;&nbsp;&nbsp;motives|string|No|Motivos clínicos para realizar el análisis|
|&nbsp;&nbsp;&nbsp;&nbsp;indications|string|No|Indicaciones para el paciente.|

### Ejemplo de llamada

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123,
   "patient_id":456,
   "analyses":[
      {
         "id":111,
         "observations":"",
         "motives":"",
         "indications":""
      }
   ]
}
```
returns => { analysis_request_id: int, analysis_request: ANALYSIS_REQUEST }

## analysisRequest.get

Solicita la información de una solicitud de análisis

### Parámetros

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|analyses_request_id|int|Sí|El id de la solicitud de análisis|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "analyses_request_id":1234
}
```

returns => { analysis_request: ANALYSIS_REQUEST }

## analysisRequest.list

Lista las solicitudes de análisis de la plataforma

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|No|Si se envía este parámetro se regresarán las solicitudes emitidas por el médico en cuestión|
|patient_id|int|No|Si se envía este parámetro se regresarán las solicitudes emitidas para el paciente en cuestión|
|page|int|No|Parámetro de paginado, comienza en `0`. Si no se envía se enviará la primera página. La candidad de resultados por página es 20|

### Ejemplo de llamada:
  
```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123
}
```
returns => { analyses_request: ANALYSIS_REQUEST [ ] }

## medicine.list

Lista los medicamentos disponibles para ser recetados

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|search|string|No|Se filtran los medicamentos por nombre|
|page|int|No|Parámetro de paginado, comienza en `0`. Si no se envía se enviará la primera página. La candidad de resultados por página es 20|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "search":""
}
```
returns => { medicines: MEDICINE [ ] }

# Errores devueltos por el API

```
DICCIONARIO DE ERRORES

  

10xxx => Authentication

-10001: Token parameter not received

-10002: Token not authorized to perform this request

-10003: Invalid Token

-10004: Token is not authorized to call this endpoint

-10005: Revoked token

  

-10100: Invalid Parameter

  

-11xxx => medic

-11001 => Médico no existe

-11003 => El certificado no pudo ser procesado

-11004 => El certificado público ha expirado

  

-12xxx => patient

-12001 => Paciente no existe

  

-13xxx => prescription

-13001 => Receta no existe

-13002 => Llave y/o contraseña de certificado no recibidos

-13003 => No se pudo procesar certificado privado

-13004 => Json a firmar no concuerda con json generado anteriormente

-13005 => Firma de json no pudo ser comprobada con su certificado público actual

  

-14xxx => analysisRequest

-14001 => Solicitud no existe

  

-15xxx => analysis

-15001 => Análisis no existe

  

-16xxx => medicine

-16001 => Medicina no existe
```

# Javascript API

Importa la librería y usa el objeto MRD para firmar las recetas digitales de tus médicos:

```html
<html>
  <head>
    <script src="/js/mrd/lib/mrd-js/MRD.min.js"></script>
  </head>
</html>
```


Se requiere que el navegador soporte LocalStorage para el firmado de recetas.

1.  Use una llamada JSONRPC al API `prescription.keyToPem` para transformar la llave privada (.key) de un médico a formato PEM para poder firmar la receta en su frontend.
2.  Guarde de manera encriptada y segura la llave transformada del médico en LocalStorage haciendo uso del método `MRD.saveKeyFile`, estableciendo una contraseña a usar cuando se requiera obtener la llave privada más adelante para firmar una receta. Se recomienda que la contraseña a usar sea especificada por el médico para que el mismo tenga que especificarla de nuevo al firmar una receta.
3.  Use una llamada JSONRPC al API `prescription.createJson` con los datos de la receta a crear para obtener un json (prescription_json) y token (prescription_token) de receta estructurado y autorizado.
4.  Firme el dato prescription_json obtenido del paso anterior usando el método `MRD.signPrescription` (usando la contraseña establecida en el paso 2) y envíe prescription_json, la firma generada (digital_signature), y prescription_token al API prescription.create según la documentación del API para crear la receta.

## Métodos del objeto window.MRD:

### MRD.saveKeyFile(pem, password, callback)

Guarda (con encriptación AES) la llave privada transformada de un médico que se obtuvo mediante la llamada a prescription.keyToPem del API.

Parametros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|pem|string|Sí|String de llave privada del doctor.|
|password|string|Sí|Contraseña con la que se encriptará la llave privada en el almacenamiento local.|
|callback|function(encryptedPem)|Sí|Función invocada una vez que se termina el proceso de guardado, recibe el string con el pem encriptado. |


### MRD.signPrescription(stringData, password, callback, errorCallback)

Firma stringData usando el PEM guardado usando el método MRD.saveKeyFile. Requiere usar la misma contraseña que se usó al momento de usar MRD.saveKeyFile.

Parametros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|stringData|string|Sí|String a firmar (json de receta como se recibió)|
|password|string|Sí|Contraseña de encriptación usada anteriormente|
|callback|function(signedStringData)|Sí|Recibe el stringData firmado|
|errorCallback|function({int type, stringmessage})|Sí|Cuando ocurre un error, se llama recibiendo un objeto error con las propiedades type y message detallando el error ocurrido|

### MRD.getKeyFile(password, callback, errorCallback)

Usando para obtener el PEM (original) guardado usando el método MRD.saveKeyFile. Requiere usar la misma contraseña que se usó al momento de usar MRD.saveKeyFile.

Método para uso interno. No se requiere usar bajo circunstancias normales

Parametros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|password|string|Sí|Contraseña de encriptación usada anteriormente|
|callback|function(decryptedPEM)|Sí|Recibe el PEM original|
|errorCallback|function({int type, string message}|Sí|Cuando ocurre un error, se llama recibiendo un objeto error con las propiedades type y message detallando el error ocurrido|



