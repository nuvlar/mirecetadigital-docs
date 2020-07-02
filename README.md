# MiRecetaDigital API


Bienvenido a la documentación del API de MiRecetaDigital. Todas las llamadas al API requieren la presencia de un token de autentificación generado por nosotros. Si deseas implementar los servicios de MiRecetaDigital en tu sitio web puedes contactarnos a `direccion@mirecetadigital.com`.


Cada App que utilice el servicio de MRD recibirá uno o más tokens de autenticación. Cada token podrá tener uno o más de los siguientes permisos:

```
"MANAGE_MEDICS"
"READ_MEDICS"
"MANAGE_PATIENTS"
"READ_PATIENTS"
"MANAGE_PRESCRIPTIONS"
"READ_PRESCRIPTIONS"
"MANAGE_ANALYSIS"
"READ_ANALYSIS"
```
 
Los tokens serán generados por parte de MRD y tendrán que ser enviados a través del parámetro _token dentro de cada petición a la API.

  
## CONEXIONES A API

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
  

A cada una de estas peticiones el servidor responde con un objeto JSON como el siguiente:

  
```json
{
	"jsonrpc": "2.0",
	"id":"<identificador de peticion (arbitrario, generado por cliente)>",
	"result": {
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

```json
{
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

```json
{
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

```json
{
	"medic_id":123
}
```
returns => { medic: MEDIC }

## medic.list

```json
{
    "search": "search string"
}
```
  returns => { medics: MEDIC [ ] }
  

## patient.create

```json
{
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

```json
{
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
  
```json
{
	"patient_id":123
}
```
returns => { patient: PATIENT }

  
## patient.list
```json
{
	"search": "search string"
}
```
returns => { patients: PATIENT [ ] }

## prescription.keyToPem
```json
{
	"key_file":"",
	"password":
}
```
returns => { pem: string }

## prescription.createJson

```json
{
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

```json
{
	"medic_id":123,
	"patient_id":456,
	"prescription_json":"JSON string regresado por prescription.createJson",
	"digital_signature":"Firma calculada con la librería de JS y la llave privada del doctor.",
	"prescription_token":"Token regresado por prescription.createJson"
}
```
  
returns => { prescription_id: int, prescription: PRESCRIPTION }

## prescription.get

```json
{
	"prescription_id":123
}
```

returns => { prescription_id: int, prescription: PRESCRIPTION }

## prescription.list

```json
{
	"medic_id":123
}
```

returns => { prescriptions: PRESCRIPTION [ ] }

  
## analysis.list

Usado para buscar analisis a poner en solicitudes de laboratorio / gabinete

```json
{
	"search":"" 
}
```
returns => { analyses: ANALYSIS [ ] }

## analysisRequest.create

```json
{
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

```json
{
	"analyses_request_id":1234
}
```

returns => { analysis_request: ANALYSIS_REQUEST }

## analysisRequest.list
  
```json
{
	"medic_id":123
}
```
returns => { analyses_request: ANALYSIS_REQUEST [ ] }

## medicine.list

```json
{
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

Importa la librería y usar el objeto MRD para firmar las recetas según los siguientes pasos.

Se requiere que el navegador soporte localstorage para el firmado de recetas.

1.  Use una llamada JSONRPC al API prescription.keyToPem para transformar la llave privada (.key) de un médico a formato PEM para poder firmar la receta en su frontend
2.  Guarde de manera encriptada y segura la llave transformada del médico en localstorage haciendo uso del método MRD.saveKeyFile, estableciendo una contraseña a usar cuando se requiera obtener la llave privada más adelante para firmar una receta. Se recomienda que la contraseña a usar sea especificada por el médico para que el mismo tenga que especificarla de nuevo al firmar una receta.
3.  Use una llamada JSONRPC al API prescription.createJson con los datos de la receta a crear para obtener un json (prescription_json) y token (prescription_token) de receta estructurado y autorizado.
4.  Firme el dato prescription_json obtenido del paso anterior usando el método MRD.signPrescription (usando la contraseña establecida en el paso 2) y envíe prescription_json, la firma generada (digital_signature), y prescription_token al API prescription.create según la documentación del API para crear la receta.
    

  

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



