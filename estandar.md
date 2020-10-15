
# Estándar de recetas electrónicas FIDE

*Aviso: La versión 0.2 de este estándar continúa en desarrollo activo, para una versión estable del estándar favor de referir a la versión [0.1](estandar-0-1.md)*

El estándar FIDE de recetas electrónicas es un estándar desarrollado de manera conjunta con distintas empresas y organizadores del sector médico diseñado para crear una receta autocontenida y sin necesidad de un servidor centralizado de validación. 

Este estándar está diseñado para ser compatible con los lineamientos de HL7 FIHR, permitiendo una implementación sencilla en sistemas que ya utilicen este estándar, así como en sistemas que no lo hagan.

Las recetas de FIDE se firman por medio del estándar JSON Web Token ([RFC 7519](https://tools.ietf.org/html/rfc7519)) con el algoritmo de firmado RS256 del estándar JSON Web Signature ([RFC 7515](https://tools.ietf.org/html/rfc7515)). La llave privada utilizada para firmar la receta electrónica tiene que ser una llave expedida por el Servicio de Administración Tributaria de México (SAT) bajo el estándar [e.firma](https://www.gob.mx/efirma).

Las recetas con el estándar FIDE están diseñadas para poder ser contenidas en un código QR o en una URL de navegador web. Ya que el estándar JWT es compatible con el estándar URL, no hay necesidad de codificar antes de insertar una receta en una dirección web.

## Estructura de payload JSON Web Token de recetas (Ver. 0.2)

El payload de las recetas deben de tener la siguiente estructura

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|version|string|Sí|Identifica la versión de estándar bajo la cual se emitió la receta (Actual: "FIDE-0.2")|
|jti|string|Sí|El identificador único de la receta. Debe de contener la suficiente información para que las posibilidades de duplicarse (incluso entre plataformas expedidoras) sea mínima|
|iss|string|No|El identificador de la entidad (empresa o sistema) que generó la receta.|
|exp|int (unixtime)|No|El momento en el tiempo a partir del cual la receta será inválida|
|nbf|int (unixtime)|No|El momento en el tiempo a partir del cual la receta será válida|
|dtc|int (unixtime)|No|El timestamp de la fecha y hora de consulta|
|generalInstructions|string|No|Indicaciones generales de la receta|
|environment|string|Sí|El ambiente en el que se emite la receta (puede ser "dist" para distribución o "dev" para pruebas). Las farmacias sólamente aceptarán las recetas emitidas en ambiente "dist"|
|certificateURL|string|Sí, en recetas firmadas por servidor, y no por médico|URL HTTP del certificado público de la llave utilizada para firmar la receta, en caso de no utilizar la llave privada del médico. Solamente válida cuando no haya medicamentos controlados.|
|requester|object Requester|Sí|Un objeto Requester con los datos del médico que emite la receta|
|subject|object Subject|Sí|Los datos del paciente|
|medication[]|object array Medication|Sí|El tratamiento (medicamentos) que el paciente necesita|


### Objeto Requester
|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|identifier|string|No|El identificador interno del médico (en la plataforma emisora de la receta).|
|title|string|No|El título del médico (Dr., Dra., FT, etc.)|
|name|string|Sí|El nombre del médico que emite la receta|
|rfc|string|No|Email del médico que emite la receta|
|certSerial|string|Sí, en recetas de medicamentos controlados|El número serial en hexadecimal del certificado público del médico (archivo .cer emitido por el SAT)|
|telephone|string|Sí|Número telefónico del médico (en formato internacional, +525844392754)|
|email|string|No|Dirección de correo electrónico del médico|
|qualification|object|Sí|Objeto conteniendo la formación del médico|
|qualification.name|string|Sí|El nombre de la especialidad (o medicina general en su caso) del médico|
|qualification.identifier|int|Sí|Número de cédula profesional del médico emitida por la SEP|
|qualification.issuer|string|Sí|Institución certificadora del médico (escuela que emite el título)|
|gender|string enum|No|El género del médico: `[male,female,other,unknown]`|
|birthDate|string date|No|La fecha de nacimiento del médico en formato YYYY, YYYY-MM, or YYYY-MM-DD |
|rfc|string|No|Número de Registro Federal de Contribuyentes (RFC) del médico|
|curp|string|No|Clave Única del Registro de la Población (CURP) del médico|
|address|object Address|Sí|Objeto con la dirección del consultorio del médico|

### Objeto Subject

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|subject.name|string|Sí|El nombre completo del paciente|
|subject.identifier|string|No|El identificador interno del paciente en la plataforma|
|subject.rfc|string|No|Número de Registro Federal de Contribuyentes (RFC) del paciente|
|subject.curp|string|No|Clave Única del Registro de la Población (CURP) del paciente|
|subject.telephone|string|Sí|Número telefónico del paciente (en formato internacional, +525844392754)|
|subject.email|string|No|Dirección de correo electrónico del paciente|
|subject.gender|string enum|No|El género del médico: `[male,female,other,unknown]`|
|subject.weight|float|No|Peso(en kg) del paciente|
|subject.height|float|No|Altura (en cm) del paciente|
|subject.birthDate|string date|No|La fecha de nacimiento del paciente en formato YYYY, YYYY-MM, or YYYY-MM-DD |
|subject.diagnosis|string|No|Diagnóstico del paciente|
|subject.bloodPressure|object|No|objeto con presión arterial del paciente (mmHg)|
|subject.bloodPressure.systolic|int|Sí|Presión sistólica del paciente|
|subject.bloodPressure.diastolic|int|Sí|Presión diastólica del paciente|
|subject.temperature|float|No|Temperatura (en centígrados) del paciente|
|subject.address|object Address|No|Objeto con la dirección de vivienda del paciente|


### Objeto Medication

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|dosageInstruction|object Dosage|Sí|Un objeto de tipo Dosage con las instrucciones de |
|identifier|string|Sí|El identificador interno del medicamento (plataforma emisora)|
|code|string|Sí|El identificador universal del medicamento, siguiendo estándares como  RxNorm, SNOMED CT, IDMP, etc. Si no hay un código a utilizar, escribir el nombre del medicamento|
|form|int|No|El identificador de forma farmacéutica siguiento el estándar [SNOMEDCTFormCodes](https://www.hl7.org/fhir/valueset-medication-form-codes.html)|
|fraction|int|Sí|La fracción legislativa del medicamento|
|ingredient\[\]|object array Ingredient|No|Un arreglo de los ingredientes que tiene el medicamento (pueden ser activos o no activos)|


### Objeto Ingredient

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|description|text|Sí|Nombre del ingrediente|
|code|int|No|Código SNOMED del ingrediente (http://snomed.info/sct)|
|category|string|No|Categoría de ingrediente según https://www.hl7.org/fhir/valueset-substance-category.html|
|strength|object|No|El radio de concentración de sustancia|
|strength.numerator|object|No|El numerador del radio de concentración de sustancia|
|strength.denominator|object|No|El denominador del radio de concentración de sustancia|

### Objeto Address

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|address.country|string|No|País|
|address.state|string|No|Estado|
|address.city|string|No|Ciudad|
|address.postalCode|string|No|Código postal|
|address.line|string|Sí|Lugar y dirección|

### Objeto Dosage

El objeto Dosage se compone de los siguientes campos:

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|text|string|No|Explicación en texto sobre cómo tomar el medicamento|
|additionalInstructions|int enum|No|El código de instrucciones adicionales según [SNOMED CT Additional Dosage Instructions](https://www.hl7.org/fhir/valueset-additional-instruction-codes.html)|
|frequency|string FIDE-FREQUENCY-1|No|Describe la frecuencia del tratamiento según la metodología FIDE-FREQUENCY-1|


## Estructura de QR

Los QR de recetas electrónicas FIDE son autocontenidos, y toda la receta puede incluirse en un solo código QR. EL código QR debe de comenzar con las letras `FIDE:` seguidas de la cadena JWT de la receta para poder ser interpretado por los lectores de QR de las farmacias.

```
FIDE:eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0ZWwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs
```

Es posible que, por limitaciones de impresión o resolución de pantalla, la receta entera no quepa en un solo código QR. En este caso se puede utilizar la técnica de "chunking". Esto se puede lograr "cortando" el JWT de la receta (en los pedazos que sean necesarios, a discreción del sistema emisor.) e insertándolos en un qr que comience con las letras `CFIDE:X-Y:` seguidas del JWT de la receta; donde X representa el índice del código QR actual (comenzando en cero `0`) y Y representa la cantidad totales de códigos QR de la receta. 

```
CFIDE:0-2:eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0Z

CFIDE:1-2:WwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs
```

Si se desea, también se puede utilizar un QR apuntador a la receta original:

```
FIDEURL:https://mirecetadigital.com/receta/zU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRy
```

La URL debe de ser una liga directa al texto del JWT de la receta electrónica FIDE. El header de codificación debe de ser `text/plain` y el endpoint debe de responder a una solicitud REST de tipo `GET` por parte del cliente.

## Ejemplo de una receta electrónica con el estándar FIDE-0.2

### Cadena JWT:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0ZWwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs
```

### Payload decodificado:

```json
{
  "prv": "FIDE-0.2",
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

![Receta QR](ejemplo_receta_fide_0-2.png?raw=true "FIDE:eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0ZWwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs")

## Validación de recetas sin relación de confianza

Las recetas emitidas con el estándar de FIDE no requieren una relación de confianza entre las farmacias y el emisor de recetas. Cada receta electrónica contiene dentro de sí misma los métodos para verificar su veracidad y validez.

Los pasos para validar una receta con el estándar FIDE-0.2 son los siguientes:


1. Extraer información del payload del JWT. Esto se logra decodificando el payload (la sección del JWT comprendida entre dos puntos (.)) mediante el estándar [Base64URL](https://base64.guru/standards/base64url) y después interpretándolo como una cadena en formato JSON.
2. Obtener el número de serie del certificado digital del médico (el campo `med.crs`).
3. Solicitar al API del SAT el certificado del médico (en la url `https://apisnet.col.gob.mx/wsSignGob/apiV1/Obtener/Certificado?serial=<elnumeroserialdelmedico>`).
4. Verificar que los datos del certificado coincidan con los datos del médico (su cédula profesional se encuentra en el campo `med.cdp`).
5. Validar el JWT de la receta mediante el estándar JWT y el algoritmo RS256.
6. Validar que el campo `env` de la receta sea igual a "dist".

Una vez que estos pasos están completados puedes proceder a surtir la receta. Si la receta no contiene medicamentos controlados puedes solamente utilizar el paso 1 y surtir la receta.


## Diccionarios de valores y metodologías de datos

### FIDE-FREQUENCY-1 Frecuencias de tratamiento

Las frecuencias de tratamiento se indican con la siguiente estructura:

```
A[B]xC[xD]
```
Donde 

* A es la cantidad de unidades del medicamento que hay que tomarse (las unidades de manejan según FIDE-FOR-1).
* B es un modificador de A, el cual indica la unidad de medida que se requiere tomar del medicamento, según FIDE-MED-1.
* C es la cantidad de horas que hay que dejar pasar entre cada dosis.
* D es la cantidad de días que se tiene que mantener el tratamiento. 
* Los signos `[]` indican que lo que se encuentra entre ellos es opcional.
* Los signos `x` son literales y no son modificables, se utilizan como separación.

Si se necesitan indicaciones más complejas que lo que este algoritmo permite se puede utilizar el parámetro trt[].ind y describir el tratamiento textualmente.


## Propuesta para evitar doble gasto:

AVISO: esto es una propuesta y no se encuentra aún implementado, se está trabajando en una prueba de concepto que se añadirá a este repositorio próximamente.

Uno de los problemas de las recetas electrónicas es es hecho de requerir que no se pueda realizar un "doble gasto" de ésta; es decir, que un paciente no pueda surtir la misma receta dos veces.

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