

(function(){

   // var MRDError = function(type, message){
   //    var self = this;

   //    self.type = type;
   //    self.message = message;

   // }
   
   // var MRD = function(){

   //    var self = this;
      
   //    self.signPrescription = function (payload, password, callback, errorCallback) {
   //       self.getKeyFile(password, function(rsaPrivateKey) {
   //          try {
   //             callback(KJUR.jws.JWS.sign('RS256', { "alg": "RS256", "typ": "JWT" }, payload, rsaPrivateKey));
   //          } catch(error) {
   //             console.log(error);
   //             errorCallback(
   //                new MRDError('keydecrypt', 'Unable to sign JWT string.')
   //             );
   //          }
   //       }, errorCallback);
   //    };

   //    self.saveKeyFile = function(string, password, callback){
   //       var encrypted = CryptoJS.AES.encrypt(string, password).toString();
   //       window.localStorage.setItem('com.mirecetadigital.storage.key_file', encrypted);
   //       callback(encrypted);
   //    }

   //    self.getKeyFile = function(password, callback, errorCallback){

   //       var encrypted = window.localStorage.getItem('com.mirecetadigital.storage.key_file');

   //       if(encrypted){
   //          try {
   //             var bytes  = CryptoJS.AES.decrypt(encrypted, password);
   //             var originalText = bytes.toString(CryptoJS.enc.Utf8);
   //          } catch {
   //             errorCallback(
   //                new MRDError('keydecrypt', 'Unable to decrypt keyfile. Verify password')
   //             );
   //          }
   //          callback(originalText);
   //       }
   //       else{
   //          errorCallback(
   //             new MRDError('keyretrieve', 'No private keyfile was found on localstorage.')
   //          );
   //       }
   //    }




   // }

   var MRDError = function(type, message){
      var self = this;

      self.type = type;
      self.message = message;

   }
   
   var MRD = function(){

      var self = this;

      self.getBase64File = function(inputID, callback, errorCallback){

         file = document.getElementById(inputID);

         var file = fileInput.files[0];
                     
         var reader = new FileReader();
         reader.readAsBinaryString(file);
         reader.onload = function (evt) {
            console.log(evt.target.result);
            callback(btoa(reader.result));
         }

         reader.onerror = function (evt) {
            errorCallback(
               new MRDError('fileread', 'Unable to read input file.')
            )
         }
      }

      self.signPrescription = function (payload, password, callback, errorCallback) {
         self.getKeyFile(function(cert) {
            try {
               callback(KJUR.jws.JWS.sign('RS256', { "alg": "RS256", "typ": "JWT" }, payload, cert, password));
            } catch(error) {
               console.log(error);
               errorCallback(
                  new MRDError('keydecrypt', 'Unable to sign JWT string.')
               );
            }
         }, errorCallback);
      };

      self.saveKeyFile = function(derString, callback) {
         // Save the encrypted DER file as an PEM encrypted PKCS8 keyfile
         var prefix = '-----BEGIN ENCRYPTED PRIVATE KEY-----\n';
         var postfix = '-----END ENCRYPTED PRIVATE KEY-----';
         var pemText = prefix + btoa(derString).match(/.{0,64}/g).join('\n') + postfix;

         window.localStorage.setItem('com.mirecetadigital.storage.key_file', pemText);
         callback(derString);
      }

      self.getKeyFile = function(callback, errorCallback) {
         var cert = window.localStorage.getItem('com.mirecetadigital.storage.key_file');

         if(cert) {
            callback(cert);
         }
         else {
            errorCallback(
               new MRDError('keyretrieve', 'No private keyfile was found on localstorage.')
            );
         }
      }
   }

   window.MRD = new MRD();
})();