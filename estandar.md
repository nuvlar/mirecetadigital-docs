
# Estándar de recetas digitales FIDE

*Aviso: La versión 0.2 de este estándar continúa en desarrollo activo, para una versión estable del estándar favor de referir a la versión [0.1](estandar-0-1.md)*

El estándar FIDE de recetas digitales es un estándar desarrollado de manera conjunta con distintas empresas y organizadores del sector médico diseñado para crear una receta autocontenida y sin necesidad de un servidor centralizado de validación. 

Las recetas de FIDE se firman por medio del estándar JSON Web Token ([RFC 7519](https://tools.ietf.org/html/rfc7519)) con el algoritmo de firmado RS256 del estándar JSON Web Signature ([RFC 7515](https://tools.ietf.org/html/rfc7515)). La llave privada utilizada para firmar la receta digital tiene que ser una llave expedida por el Servicio de Administración Tributaria de México (SAT) bajo el estándar [e.firma](https://www.gob.mx/efirma).

Las recetas con el estándar FIDE están diseñadas para poder ser contenidas en un código QR o en una URL de navegador web. Ya que el estándar JWT es compatible con el estándar URL, no hay necesidad de codificar antes de insertar una receta en una dirección web.

La estructura de recetas utilizada es un estándar abierto agnóstico a plataformas creado por MiRecetaDigital. Cualquier entidad puede expedir recetas que se ajusten a este estándar.

## Estructura de payload JSON Web Token de recetas (Ver. 0.2)

El payload de las recetas deben de tener la siguiente estructura

|Campo|Tipo|Requerido|Explicación|
|--|--|--|--|
|prv|string|Sí|Identifica la versión de estándar bajo la cual se emitió la receta (Actual: "FIDE-0.2")|
|jti|string|Sí|El identificador único de la receta. Debe de contener la suficiente información para que las posibilidades de duplicarse (incluso entre plataformas expedidoras) sea mínima|
|iss|string|No|El identificador de la entidad (empresa o sistema) que generó la receta.|
|exp|int (unixtime)|No|El momento en el tiempo a partir del cual la receta será inválida|
|nbf|int (unixtime)|No|El momento en el tiempo a partir del cual la receta será válida|
|dtc|int (unixtime)|No|El timestamp de la fecha y hora de consulta|
|ind|string (unixtime)|No|Indicaciones generales de la receta|
|env|string|Sí|El ambiente en el que se emite la receta (puede ser "dist" para distribución o "dev" para pruebas). Las farmacias sólamente aceptarán las recetas emitidas en ambiente "dist"|
|cru|string|Sí, en recetas firmadas por servidor, y no por médico|URL HTTP del certificado público de la llave utilizada para firmar la receta, en caso de no utilizar la llave privada del médico. Solamente válida cuando no haya medicamentos controlados.|
|med|object|Sí|Los datos del médico que emite la receta|
|med.uid|string|No|El identificador interno del médico (en la plataforma emisora de la receta).|
|med.ttl|string|No|El título del médico (Dr., Dra., FT, etc.)|
|med.nom|string|Sí|El nombre del médico que emite la receta|
|med.crs|string|Sí, en recetas de medicamentos controlados|El número serial en hexadecimal del certificado público del médico (archivo .cer emitido por el SAT)|
|med.cdp|int|Sí|Número de cédula profesional del médico emitida por la SEP|
|med.cde|int|Sí|Número de cédula de especialidad del médico emitida por la SEP|
|med.esp|string|Sí|Especialidad del médico|
|med.inc|string|Sí|Institución certificadora del médico (escuela que emite el título)|
|med.pai|string|No|País del médico|
|med.edo|string|No|Estado del médico|
|med.ltr|string|Sí|Lugar y dirección del consultorio|
|med.tel|string|Sí|Número telefónico del médico|
|med.rfc|string|No|Número de Registro Federal de Contribuyentes (RFC) del médico|
|med.cur|string|No|Clave Única del Registro de la Población (CURP) del médico|
|pac|object|Sí|Los datos del paciente al cual es dirigida la receta|
|pac.uid|string|No|El identificador interno del paciente (en la plataforma emisora de la receta).|
|pac.nom|string|Sí|Nombre del paciente al cual es dirigida la receta|
|pac.pes|float|No|Peso(en kg) del paciente|
|pac.alt|float|No|Altura (en cm) del paciente|
|pac.edd|int|No|Edad (en años) del paciente|
|pac.dia|string|No|Diagnóstico del paciente|
|pac.par|string|No|Presión arterial del paciente (mmHg)|
|pac.tmp|float|No|Temperatura (en centígrados) del paciente|
|med.pai|string|No|País del paciente|
|med.edo|string|No|Estado del paciente|
|med.rfc|string|No|Número de Registro Federal de Contribuyentes (RFC) del paciente|
|med.cur|string|No|Clave Única del Registro de la Población (CURP) del paciente|
|trt|object array|Sí|El tratamiento (medicamentos) que el paciente necesita|
|trt[].uid|string|No|El identificador interno del medicamento (en la plataforma emisora de la receta).|
|trt[].nom|string|Sí|Nombre, ingredientes y presentación del medicamento|
|trt[].ind|string|Sí (si no se incluye parámetro frd)|Indicaciones del tratamiento|
|trt[].for|string|No|Forma farmacéutica del medicamento (según diccionario de formas farmacéuticas FIDE-FOR-1)|
|trt[].via|string|No|Vía de administración (según diccionario de vías de administración FIDE-VIA-1)|
|trt[].frd|string|Sí (si no se incluye parámetro ind)|Frecuencia de tratamiento (codificado según FIDE-FRD-1)|
|trt[].uni|int|No|Cantidad de unidades del medicamento que se recetan|
|trt[].sku|string|No|Número interno de almacén del medicamento|
|trt[].upc|string|No|Número identificador universal del medicamento (GS1)|
|trt[].ing|object array|No|Ingredientes activos del medicamento|
|trt\[\].ing\[\].act|string|Sí|Nombre del ingrediente activo|
|trt\[\].ing\[\].med|string|No|Medida por unidad (por tableta, gota, etc) (según diccionario de medida de ingredientes FIDE-MED-1)|
|trt\[\].ing\[\].can|float|No|Cantidad del compuesto (ejemplo: 500 para indicar 500mg)|

## Estructura de QR

Los QR de recetas digitales FIDE son autocontenidos, y toda la receta puede incluirse en un solo código QR. EL código QR debe de comenzar con las letras `FIDE:` seguidas de la cadena JWT de la receta para poder ser interpretado por los lectores de QR de las farmacias.

```
FIDE:eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0ZWwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs
```

Es posible que, por limitaciones de impresión o resolución de pantalla, la receta entera no quepa en un solo código QR. En este caso se puede utilizar la técnica de "chunking". Esto se puede lograr "cortando" el JWT de la receta (en los pedazos que sean necesarios, a discreción del sistema emisor.) e insertándolos en un qr que comience con las letras `CFIDE:X-Y:` seguidas del JWT de la receta; donde X representa el índice del código QR actual (comenzando en cero `0`) y Y representa la cantidad totales de códigos QR de la receta. 

```
CFIDE:0-2:eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcnYiOiJNUkQtMC4xIiwianRpIjoiNTQtMTg3MS0xNTk0OTM2NjEwIiwiaWF0IjoxNTk0OTM2NjEwLCJpc3MiOiJNUkQiLCJtZWQiOnsidWlkIjo1NCwiY3JzIjoiMzAzMDMwMzAzODMxMzAzMDMwMzAzMDM0MzAzNjM0MzQzOTMyMzYzMyIsIm5vbSI6Ikp1YW4gVXJpYmUgU8OhbmNoZXoiLCJjZHAiOiIxMjMxMjMxMiIsImVzcCI6IkNpcnVnw61hIEdlbmVyYWwiLCJpbmMiOiJVTkFNIiwibHRyIjoiQ2VudHJvIE3DqWRpY28gTmFjaW9uYWwgU2lnbG8gWFhJIEF2LiBDdWF1aHTDqW1vYyAzMzAsIERvY3RvcmVzLCBDdWF1aHTDqW1vYywgMDY3MjAgQ2l1ZGFkIGRlIE3DqXhpY28sIENETVgiLCJ0Z

CFIDE:1-2:WwiOiI0NDIyNzEyMTYxIn0sInBhYyI6eyJ1aWQiOjE4NzEsIm5vbSI6Ik1pZ3VlbCBHb256w6FsZXogRmVybsOhbmRleiJ9LCJ0cnQiOlt7InVpZCI6MzU3Nywibm9tIjoiQU5BTEdFTiAyMjBNRyBUQUIgQy8yMCIsImluZCI6IlRvbWFyIHVuYSB0YWJsZXRhIGNhZGEgOCBob3JhcyIsInVuaSI6MSwidXBjIjoiMTIzMTIzMTIzMTIzIn1dLCJlbnYiOiJkZXYifQ.FCuGkg6CM5Yk7YpA0aqgml85hQWcoxYK637jtXX1MwymSAMQNXVTvCs1_iUMV-IPfXQw22hx4oy0zBGJbKnM_-qaVSqL-f7adjPJo46HomqSa8fxp9eun73lxNAqa4VxNPxInV8DQv4R-G3FWzx2RFNNTDG5ch7p3QFbdyZl-zs
```

## Ejemplo de una receta digital con el estándar FIDE-0.2

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

Las recetas emitidas con el estándar de FIDE no requieren una relación de confianza entre las farmacias y MiRecetaDigital. Cada receta digital contiene dentro de sí misma los métodos para verificar su veracidad y validez.

Los pasos para validar una receta con el estándar FIDE-0.2 son los siguientes:


1. Extraer información del payload del JWT. Esto se logra decodificando el payload (la sección del JWT comprendida entre dos puntos (.)) mediante el estándar [Base64URL](https://base64.guru/standards/base64url) y después interpretándolo como una cadena en formato JSON.
2. Obtener el número de serie del certificado digital del médico (el campo `med.crs`).
3. Solicitar al API del SAT el certificado del médico (en la url `https://apisnet.col.gob.mx/wsSignGob/apiV1/Obtener/Certificado?serial=<elnumeroserialdelmedico>`).
4. Verificar que los datos del certificado coincidan con los datos del médico (su cédula profesional se encuentra en el campo `med.cdp`).
5. Validar el JWT de la receta mediante el estándar JWT y el algoritmo RS256.
6. Validar que el campo `env` de la receta sea igual a "dist".

Una vez que estos pasos están completados puedes proceder a surtir la receta. Si la receta no contiene medicamentos controlados puedes solamente utilizar el paso 1 y surtir la receta.


## Diccionarios de valores y metodologías de datos

### FIDE-FOR-1 Diccionario de formas farmacéuticas

Este diccionario se utiliza en cualquier lugar en el que se requiera definir una forma farmacéutica de un medicamento:

|Valor|Explicación|
|--|--|
|aer|Aerosol|
|cap|Cápsulas|
|clp|Cápsulas de liberación prolongada|
|com|Comprimidos|
|crm|Crema|
|gel|Gel|
|jar|Jarabe|
|ovu|Óvulo|
|par|Parches|
|pst|Pasta|
|plv|Polvo|
|shm|Shampoo|
|sld|Sólido|
|sol|Solución|
|sin|Solución inyectable|
|spr|Spray|
|spn|Suspensión|
|tab|Tabletas|
|tlp|Tabletas de liberación prolongada|
|tds|Tabletas dispersables|
|tef|Tabletas efervescentes|
|ung|Ungüento|
|otr|Otro|


### FIDE-VIA-1 Diccionario de vías de administración


|Valor|Explicación|
|--|--|
|buc|Bucal|
|bcf|Bucofaríngea|
|ctn|Cutánea|
|ext|Externa|
|inh|Inhalatoria|
|ino|Intraocular|
|inv|Intravenosa|
|iny|Inyectable|
|nsl|Nasal|
|oft|Oftálmica|
|orl|Oral|
|opt|Óptica|
|rct|Rectal|
|sbl|Sublingual|
|tpc|Tópica|
|vag|Vaginal|
|ung|Ungeal|
|noa|N/A|
|orv|Oral/Vaginal|
|otr|Otra|


### FIDE-FRD-1 Frecuencias de tratamiento

Las frecuencias de tratamiento se indican con la siguiente estructura:

```
AxB[xC]
```
Donde 

* A es la cantidad de unidades del medicamento que hay que tomarse (las unidades de manejan según FIDE-FOR-1)
* B es la cantidad de horas que hay que dejar pasar entre cada dosis.
* C es la cantidad de días que se tiene que mantener el tratamiento. 
* Los signos `[]` indican que lo que se encuentra entre ellos es opcional.
* Los signos `x` son literales y no son modificables, se utilizan como separación.

Si se necesitan indicaciones más complejas que lo que este algoritmo permite se puede utilizar el parámetro trt[].ind y describir el tratamiento textualmente.


## Propuesta para evitar doble gasto:

AVISO: esto es una propuesta y no se encuentra aún implementado, se está trabajando en una prueba de concepto que se añadirá a este repositorio próximamente.

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