# MiRecetaDigital API


Bienvenido a la documentación del API de MiRecetaDigital. Todas las llamadas al API requieren la presencia de un token de autentificación generado por nosotros. Si deseas implementar los servicios de MiRecetaDigital en tu sitio web puedes contactarnos a `direccion@mirecetadigital.com`.

## Introducción a MRD

MiRecetaDigital (MRD) es un sistema cuyo objetivo principal es la creación y validación de documentos médicos (Recetas y solicitudes de análisis) en México. El sistema cumple con las regulaciones nacionales de firma digital para recetas médicas utilizando la e.firma del Servicio de Administración Tributaria (SAT) de México. Las recetas digitales, además de almacenarse en nuestros servidores de manera convencional, son firmadas utilizando la llave privada del médico mediante el estándar JSON Web Token RS256 y pueden ser validadas sin que la parte verificadora necesite confiar en los servidores de MRD. 


# Índice

* [Tokens de API](#tokens-de-api)
* [Conexiones a API](#conexiones-a-api)
* [Estructura de objetos de API](#estructura-de-objetos-de-api)
* [Llamadas a API](#llamadas-a-api)
* [Errores devueltos por el API](#errores-devueltos-por-el-api)
* [Javascript API](#javascript-api)
* [Estándar de recetas digitales](#estándar-de-recetas-digitales)

# Tokens de API

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
   "id":99,
   "prescription_id":99,
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
   "prescription_url" : "{URL para poder ver los detalles de una receta dentro de MRD}",
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
   "live_mode":1,
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

## PHARMACY 

```json
{
	"id": 123,
	"id_pharmacy": 123,
	"name": "My Pharma",
	"logo": "http://example.com/pharmacy_logo.png"
}
```
## PHARMACY_LOCATION_PHYSICAL

```json
{

	"id": 123,
	"id_location": 123,
	"name": "Old Pharma",
	"latitude": 25.0,
	"longitude": -71.0,
	"address": "Street #123, ZIP State, Country"
}
```

## PHARMACY_LOCATION_VIRTUAL

```json
{
	"id": 123,
	"id_location": 123,
	"name": "Virtual Pharma",
	"website": "http://www.example.com"
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

## prescription.keyToPem (Obsoleto)

Utiliza esta llamada para decodificar el archivo .key de la e.firma del doctor hacia un formato .pem que la librería de javascript de mrd pueda utilizar. Esta firma nunca se guardará en nuestros servidores.

 *AVISO: Ya no es necesario que la llave privada del doctor llegue a nuestros servidores nunca.La librería Javascript ya soporta procesar el archivo DER de la llave privada del médico manualmente.*

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

Crea un texto con un payload JSON en base64url compatible con el estándar JSON Web Token y un token de validación para ese payload. El Payload tendrá que ser firmado por la librería de Javascript de MRD (el firmado utiliza el estándar JWT RS256) para poder crearse la receta mediante la llamada `prescription.create`.

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

returns => { unsigned_payload: string, unsigned_payload_token: string }

## prescription.create

Crea una receta a partir del JSON de receta firmado con la librería de Javascript

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|medic_id|int|Sí|El id del médico que expide la receta|
|patient_id|int|Sí|El id del paciente que recibe la receta|
|unsigned_payload_token|string|Sí|El token recibido de la llamada `prescription.createJson`|
|digital_signature|string|Sí|La firma digital (JSON Web Token RS256) arrojada por la librería de Javascript sobre el payload|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123,
   "patient_id":456,
   "unsigned_payload_token":"Token regresado por prescription.createJson",
   "digital_signature":"Firma calculada con la librería de JS y la llave privada del doctor."
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

## pharmacy.list  

Lista las farmacias en las que se pueden surtir medicamentos que requieren receta

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>"
}

```

returns => { pharmacies: PHARMACY [ ] }

## pharmacy.locations

Lista las sucursales virtuales (sitios web) y físicas de una farmacias

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|id_pharmacy|integer|Sí|Mostrar las sucursales de una farmacia|

### Ejemplo de llamada:

```json
{
	"_token":"<API_TOKEN>",
	"id_pharmacy": 123
}

```

returns => { virtual: PHARMACY_LOCATION_PHYSICAL [ ], physical: PHARMACY_LOCATION_PHYSICAL [ ] }

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

1.  Solicita el documento `.key` de los médicos (la llave privada de su e.firma) y lee el archivo como base64 con la llamada `MRD.getBase64File`.
2.  Guarda la llave del médico en LocalStorage haciendo uso del método `MRD.saveKeyFile`.
3.  Usa una llamada JSONRPC al API `prescription.createJson` con los datos de la receta a crear para obtener un json (unsigned_payload) y token (unsigned_payload_token) de receta estructurado y autorizado.
4.  Firma el dato `unsigned_payload` obtenido del paso anterior usando el método `MRD.signPrescription` (usando la contraseña de la llave privada del médico) la firma generada (digital_signature), y unsigned_payload_token al API prescription.create según la documentación del API para crear la receta.

## Métodos del objeto window.MRD:

### MRD.getBase64File(inputElementID, callback, errorCallback)

Codifica los datos de un elemento input en un string base64 para poder utilizarse en el método `MRD.saveKeyFile`.

Parámetros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|inputElementID|string|Sí|Identificador del elemento input desde el cual se extraerá el archivo de llave.|
|callback|function(signedStringData)|Sí|Recibe archivo seleccionado en el input como un string base64|
|errorCallback|function({int type, string message})|Sí|Cuando ocurre un error, se llama recibiendo un objeto error con las propiedades type y message detallando el error ocurrido|

### MRD.saveKeyFile(base64DERFile, callback)

Guarda la llave privada del médico en memoria local.

Parametros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|base64DERFile|string|Sí|String en base64 del archivo DER del médico.|
|callback|function()|Sí|Función invocada una vez que se termina el proceso de guardado. |


### MRD.signPrescription(stringData, password, callback, errorCallback)

Firma stringData usando el archivo guardado usando el método MRD.saveKeyFile.

Parametros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|stringData|string|Sí|String a firmar (Cadena unsigned_payload como se recibió)|
|password|string|Sí|Contraseña de la llave privada del médico|
|callback|function(string JWT)|Sí|Recibe un string con el objeto JWT firmado de la receta|
|errorCallback|function({int type, string message})|Sí|Cuando ocurre un error, se llama recibiendo un objeto error con las propiedades type y message detallando el error ocurrido|

### MRD.getKeyFile(password, callback, errorCallback)

Usando para obtener el PEM (original) guardado usando el método MRD.saveKeyFile. Requiere usar la misma contraseña que se usó al momento de usar MRD.saveKeyFile.

Método para uso interno. No se requiere usar bajo circunstancias normales

Parametros:
|Nombre|Tipo|Requerido|Explicación|
|--|--|--|--|
|password|string|Sí|Contraseña de encriptación usada anteriormente|
|callback|function(decryptedPEM)|Sí|Recibe el PEM original|
|errorCallback|function({int type, string message}|Sí|Cuando ocurre un error, se llama recibiendo un objeto error con las propiedades type y message detallando el error ocurrido|



# Estándar de recetas digitales

Las recetas de MRD se firman por medio del estándar JSON Web Token ([RFC 7519](https://tools.ietf.org/html/rfc7519)) con el algoritmo de firmado RS256 del estándar JSON Web Signature ([RFC 7515](https://tools.ietf.org/html/rfc7515)). La llave privada utilizada para firmar la receta digital tiene que ser una llave expedida por el Servicio de Administración Tributaria de México (SAT) bajo el estándar [e.firma](https://www.gob.mx/efirma).

Las recetas con el estándar MRD están diseñadas para poder ser contenidas en un código QR o en una URL de navegador web. Ya que el estándar JWT es compatible con el estándar URL, no hay necesidad de codificar antes de insertar una receta en una dirección web.

La estructura de recetas utilizada es un estándar abierto agnóstico a plataformas creado por MiRecetaDigital. Cualquier entidad puede expedir recetas que se ajusten a este estándar.

## Estructura de payload JSON Web Token de recetas (Ver. 0.1)

El payload de las recetas deben de tener la siguiente estructura

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|prv|string|Sí|Identifica la versión de estándar bajo la cual se emitió la receta (Actual: "MRD-0.1")|
|jti|string|Sí|El identificador único de la receta. Debe de contener la suficiente información para que las posibilidades de duplicarse (incluso entre plataformas expedidoras) sea mínima|
|iss|string|No|El identificador de la entidad (empresa o sistema) que generó la receta.|
|exp|int (unixtime)|No|El momento en el tiempo a partir del cual la receta será inválida|
|nbf|int (unixtime)|No|El momento en el tiempo a partir del cual la receta será válida|
|env|string|Sí|El ambiente en el que se emite la receta (puede ser "dist" para distribución o "dev" para pruebas). Las farmacias sólamente aceptarán las recetas emitidas en ambiente "dist"|
|med|object|Sí|Los datos del médico que emite la receta|
|&nbsp;&nbsp;&nbsp;&nbsp;uid|string|No|El identificador interno del médico (en la plataforma emisora de la receta).|
|&nbsp;&nbsp;&nbsp;&nbsp;nom|string|Sí|El nombre del médico que emite la receta|
|&nbsp;&nbsp;&nbsp;&nbsp;crs|string|Sí|El número serial en hexadecimal del certificado público del médico (archivo .cer emitido por el SAT)|
|&nbsp;&nbsp;&nbsp;&nbsp;cdp|int|Sí|Número de cédula profesional del médico emitida por la SEP|
|&nbsp;&nbsp;&nbsp;&nbsp;esp|string|Sí|Especialidad del médico|
|&nbsp;&nbsp;&nbsp;&nbsp;inc|string|Sí|Institución certificadora del médico (escuela que emite el título)|
|&nbsp;&nbsp;&nbsp;&nbsp;ltr|string|Sí|Lugar y dirección del consultorio|
|&nbsp;&nbsp;&nbsp;&nbsp;tel|string|Sí|Número telefónico del médico|
|pac|object|Sí|Los datos del paciente al cual es dirigida la receta|
|&nbsp;&nbsp;&nbsp;&nbsp;uid|string|No|El identificador interno del paciente (en la plataforma emisora de la receta).|
|&nbsp;&nbsp;&nbsp;&nbsp;nom|string|Sí|Nombre del paciente al cual es dirigida la receta|
|&nbsp;&nbsp;&nbsp;&nbsp;pes|float|No|Peso(en kg) del paciente|
|&nbsp;&nbsp;&nbsp;&nbsp;alt|float|No|Altura (en cm) del paciente|
|&nbsp;&nbsp;&nbsp;&nbsp;edd|int|No|Edad (en años) del paciente|
|&nbsp;&nbsp;&nbsp;&nbsp;dia|string|No|Diagnóstico del paciente|
|&nbsp;&nbsp;&nbsp;&nbsp;par|string|No|Presión arterial del paciente (mmHg)|
|&nbsp;&nbsp;&nbsp;&nbsp;tmp|float|No|Temperatura (en centígrados) del paciente|
|trt|object array|Sí|El tratamiento (medicamentos) que el paciente necesita|
|&nbsp;&nbsp;&nbsp;&nbsp;uid|string|No|El identificador interno del medicamento (en la plataforma emisora de la receta).|
|&nbsp;&nbsp;&nbsp;&nbsp;nom|string|Sí|Nombre, ingredientes y presentación del medicamento|
|&nbsp;&nbsp;&nbsp;&nbsp;ind|string|Sí|Indicaciones del tratamiento|
|&nbsp;&nbsp;&nbsp;&nbsp;uni|int|No|Cantidad de unidades del medicamento que se recetan|
|&nbsp;&nbsp;&nbsp;&nbsp;sku|string|No|Número interno de almacén del medicamento|
|&nbsp;&nbsp;&nbsp;&nbsp;upc|string|No|Número identificador universal del medicamento (GS1)|

## Ejemplo de una receta digital con el estándar MRD-0.1

### Cadena JWT:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0ZWwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs
```

### Payload decodificado:

```json
{
  "prv": "MRD-0.1",
  "jti": "54-1871-1594936610",
  "iat": 1594936610,
  "iss": "MRD",
  "med": {
    "uid": 54,
    "crs": "3030303038313030303030343036343439323633",
    "nom": "Juan Uribe Sánchez",
    "cdp": "12312312",
    "esp": "Cirugía General",
    "inc": "UNAM",
    "ltr": "Centro Médico Nacional Siglo XXI Av. Cuauhtémoc 330, Doctores, Cuauhtémoc, 06720 Ciudad de México, CDMX",
    "tel": "4422712161"
  },
  "pac": {
    "uid": 1871,
    "nom": "Miguel González Fernández"
  },
  "trt": [
    {
      "uid": 3577,
      "nom": "ANALGEN 220MG TAB C/20",
      "ind": "Tomar una tableta cada 8 horas",
      "uni": 1,
      "upc":"123123123123"
    }
  ],
  "env": "dev"
}
```

### QR de la receta:

![Receta QR](ejemplo_receta.png?raw=true "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0ZWwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs")

## Validación de recetas sin relación de confianza

Las recetas emitidas con el estándar de MRD no requieren una relación de confianza entre las farmacias y MiRecetaDigital. Cada receta digital contiene dentro de sí misma los métodos para verificar su veracidad y validez.

Los pasos para validar una receta con el estándar MRD-0.1 son los siguientes:


1. Extraer información del payload del JWT. Esto se logra decodificando el payload (la sección del JWT comprendida entre dos puntos (.)) mediante el estándar [Base64URL](https://base64.guru/standards/base64url) y después interpretándolo como una cadena en formato JSON.
2. Obtener el número de serie del certificado digital del médico (el campo `med.crs`).
3. Solicitar al API del SAT el certificado del médico (en la url `https://apisnet.col.gob.mx/wsSignGob/apiV1/Obtener/Certificado?serial=<elnumeroserialdelmedico>`).
4. Verificar que los datos del certificado coincidan con los datos del médico (su cédula profesional se encuentra en el campo `med.cdp`).
5. Validar el JWT de la receta mediante el estándar JWT y el algoritmo RS256.
6. Validar que el campo `env` de la receta sea igual a "dist".

Una vez que estos pasos están completados puedes proceder a surtir la receta. Si la receta no contiene medicamentos controlados puedes solamente utilizar el paso 1 y surtir la receta.

## Propuesta para evitar doble gasto:

Uno de los problemas de las recetas digitales es es hecho de requerir que no se pueda realizar un "doble gasto" de ésta; es decir, que un paciente no pueda surtir la misma receta dos veces.

Se propone implementar un sistema basado en la tecnología [IPFS](https://ipfs.io/) y [Orbitdb](https://orbitdb.org/) para manejar una base de datos distribuida sencilla con las recetas surtidas por cada farmacia. De esta manera los actores interesados podrían suscribirse a las bases de datos de cada farmacia y ver un registro de las recetas que se han surtido en cada una de ellas. Estas bases de datos serían públicas y descentralizadas, para aumentar la confiabilidad y requerir en la menor cantidad de un órgano central regulador.

Se propone un sistema de bases de datos con esquema key-value, en el cual se almacenen de manera muy sencilla valores que no expongan datos personales del paciente, doctor y contenidos de la receta. Los valores de las bases de datos podrían tener la siguiente estructura:

1. La llave de la entrada (key) sería una amalgamación de el identificador de la receta (jti) y el hash sha256 del contenido total del JWT, separados por un guión.
2. El valor (value) de la entrada consistiría de un arreglo de entradas estructuradas de la siguiente manera (estos valores estarían unidos con un guión):
   * El índice del medicamento surtido (de acuerdo al arreglo en el parámetro `trt` de la receta).
   * La cantidad de veces que el medicamento fue surtido.

Un ejemplo de una entrada a las bases de datos podría ser esta:

```json
{
   "54-1871-1594936610-b12c031ec4ae2ef38bf14decdc85be9ff9bf4160f88a2bfdbebb4e8ba03d56dd":"0-1,1-2"
}
```
Esta entrada indicaría que a la receta `54-1871-1594936610` se le surtió el primer medicamento en una unidad y el segundo en dos unidades.

Esta manera de compartición de datos asegura los siguientes puntos:

* Ninguna información personal puede deducirse de las entradas de la base de datos pública.
* La única manera de saber qué medicamentos se han surtido de la receta es tener a la receta físicamente para poder correr el algoritmo sha-256 sobre ella y averiguar su llave. 
* El carácter distribuido de la base de datos permite redundancia de datos y resistencia a fallos, al cada parte tener una copia de las bases de datos de las demás partes.
* No se requiere la centralización de datos en una entidad reguladora.

### ¿Por qué no blockchain?

El sistema de archivos IPFS es en sí una tecnología P2P con criptografía de árbol de Merkle, solamente que los datos no se almacenan en bloques, por lo que no hay que esperar a que un bloque se mine para poder insertar los datos. Esto elimina complejidad a la base de datos y permite insertar valores en tiempo real.