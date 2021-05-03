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
* [Estándar de recetas digitales](estandar.md)
* [Flujo general para crear una receta](#flujo-general-para-crear-una-receta)

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

El API de MRD se puede acceder a través del estándar [JSON-RPC](https://www.jsonrpc.org/specification) a través de peticiones POST al siguiente endpoint:

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
   "qr_fide":"{String a ser convertido en QR de escaneo para surtir la receta en farmacias que hagan uso del estandard FIDE}",
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

Utiliza esta llamada para agregar un médico a tu app.

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
|first_name|string|Sí|Nombre o nombres del paciente. Si se omite el parametro `last_name` se requiere que `first_name` sea de 2 o más palabras.|
|last_name|string|No|Apellidos del paciente. En caso de no ser especificado, se considera como apellido la última palabra enviada en el parametro `first_name`|
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

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "medic_id":123,
   "patient_id":456,
   "medicines":[
      {
         "medicine_id":123,
         "indications":"Tomar cada 8 horas por 3 días"
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

## prescription.validateJWT

Verificar que el JWT de una receta cualquiera en estandard MRD-0.1 o FIDE este correctamente formado y firmado por el médico que se menciona en la receta.

### Parámetros:

|Nombre|Tipo|Requerido|Explicacion
|--|--|--|--|
|_token|string|Sí|El token de acceso de tu app|
|jwt|string|Sí|JWT de una receta creada usando el estandard "MRD-0.1" o "FIDE". (En recetas creadas mediante este API, digital_signature de un objeto PRESCRIPTION)|
|legacy|int|No|Si tiene valor 1, se validara el JWT estandard "MRD-0.1. Defecto: 0 / Validar estandard FIDE más reciente|

### Ejemplo de llamada:

```json
{
   "_token":"<API_TOKEN>",
   "jwt":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9......"
}
```

returns => { valid: boolean, payload: RECETA_STANDARD_MRD-0.X-FIDE, public_certificate_url: string, public_certificate_pem: string }

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
|ignoreActiveIngredients|int|No|Si se envía `0`, se buscaran medicamentos con nombre o ingredientes activos según el parametro 'search'. Si se envía `1`, se buscaran medicamentos en base a su nombre según el parametro 'search'. Default `0`|
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
Diccionario de errores más comunes para llamadas inválidas.


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


-32601 => Error no clasificado

 CLASS_FILE_NOT_FOUND       => Asegurese de especificar correctamente el nombre del modelo a llamar del API
 METHOD_NOT_FOUND           => Asegurese de especificar correctamente el endpoint del modelo a llamar del API
 UNABLE_TO_PROCESS_REQUEST  => Asegurese de haber estructurado correctamente la llamada al API

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

Esta sección ha sido trasladada a [aquí](estandar.md).


# Flujo general para crear una receta

Pasos mínimos para crear una receta:

1.- Crear un paciente usando la llamada __patient.create__ especificando al menos los parámetros requeridos y guardar el **patient_id** que se regresa en la llamada.

2.- Crear un medico usando la llamada __medic.create__ especificando todos los parámetros requeridos y guardar su **medic_id** que se regresa en la llamada.
Entre los parámetros para crear un medico se requiere el archivo .cer de su firma digital (certificado publico) codificado en base64. El proceso se puede hacer por cuenta de la integradora o usar la librería de JS que se adjunta en la pagina de la documentación (usar el  método __MRD.getBase64File__ en un campo html donde el cliente seleccione su archivo .cer)

3.- Determinar que medicamentos se incluirán una receta y buscar sus IDs en la base de datos de medicamentos usando el método __medicine.list__ (mandar nombre del medicamento / ingrediente activo que se busca en el parámetro search. Usar otros parámetros para refinar la búsqueda según se necesite). Una vez se encuentre el medicamento a usar, guardar su **medicine_id**.
Puedes usar los demás datos de cada medicamento para mostrar mas información en tu sitio web de los medicamentos seleccionados al medico, etc...

4.- Una vez guardados los IDs de medicamentos a usar, hacer una llamada a __prescription.createJson__
 donde especifiques el **medic_id**, **patient_id** y un campo medicines que corresponda a un arreglo de objectos con entradas que incluyan los campos **medicine_id** e indications (Ver ejemplo de llamada en docs).
Guardar los datos unsigned_payload y unsigned_payload_token que se devuelven en la llamada.
 
5.- Firmar la cadena unsigned_payload (dentro de 10 minutos de su creación) usando la llave privada del medico que creo la receta usando el estándar de firmado JSON Web Token https://__tools.ietf__.org/html/rfc7519 y usando el algoritmo "RS256". Esta firma se puede hacer a discreción del implementador o puede usar la librería JS que se adjunta en la documentación del API, haciendo uso de los métodos __MRD.getBase64File__ y __MRD.saveKeyFile__ para obtener el archivo .key del medico a partir de un campo input html y __MRD.signPrescription__ para firmar la cadena unsigned_payload y obtener el JSON WebToken que corresponde a la receta firmada. Guardar el JSON Web Token.
Recuerda que la contraseña que el medico usa para firmar es aquella que uso al momento de crear su par de llaves publica .cer y privada .key

6.- Hacer la llamada a __prescription.create__ (dentro de 10 minutos la llamada a __prescription.createJSON__), especificando el JSON Web Token obtenido del paso anterior bajo el parámetro digital_signature; especificar el dato unsigned_payload_token del paso 4 bajo el campo unsigned_payload_token; especificar el **medic_id** y **patient_id** del medico y paciente que creo la receta.
De la respuesta guardar el **prescription_id** para futuras llamadas relacionadas a esta misma receta y opcionalmente la receta en si recibida bajo el parámetro prescription.

7.- Muestra a tus usuarios la receta obtenida a tu discreción.

Para crear nuevas recetas, repita todos los pasos.
Si usara un paciente existente, omita el paso 1 y use el **patient_id** existente.
Si usara el mismo medico, omita el paso 2 y use el **medic_id** existente.
Si usara medicamentos ya consultados anteriormente, puede usar los **medicine_id** obtenidos anteriormente.
Si un medico ya ha firmado al menos una receta usando la librería JS proporcionada en la documentación, su llave privada se guarda en su navegador y permanecerá ahí hasta que limpie cache / localstorage, por lo que en el proceso de firmado, dentro del paso 5 puede omitir los pasos de obtener el archivo .key (usar __MRD.getBase64File__ y __MRD.saveKeyFile__) y puede usar directamente __MRD.signPrescription__ para firmar la receta obtenida en el paso 4.
Puede verificar si la llave privada del medico permanece en localstorage / no es necesario pedir el archivo .key al medico, usando el método __MRD.getKeyFile__. De no encontrarse la llave en memoria, arrojara un error MRDError('keyretrieve', 'No private keyfile was found on localstorage.'), de lo contrario regresara un string. Puede usar esta información para mostrar condicionalmente al medico el input html desde donde usa su archivo .key para realizar el firmado de recetas.
esta información para mostrar condicionalmente al medico el input html desde donde usa su archivo .key para realizar el firmado de recetas.