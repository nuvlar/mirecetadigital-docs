

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
   
   var MiRecetaDigital = function(){

      var self = this;

      self.debug = false;

      self.log = function(message){
         if(self.debug){
            console.log(message);
         }
      }

      self.localStorageSupport = (function() {
         try {
            localStorage.setItem('com.mirecetadigital.storage.test', 'test');
            localStorage.removeItem('com.mirecetadigital.storage.test');
            return true;
         } catch (exception) {
            return false;
         }
      }());

      self.getBase64File = function(inputID, callback, errorCallback){

         fileInput = document.getElementById(inputID);

         if(!fileInput){

            self.log('MRD.getBase64File: file input element not found: '+inputID);

            errorCallback(
               new MRDError('fileread', 'Input element not found: '+inputID)
            )
            return;
         }

         self.log('MRD.getBase64File: got input element, extracting data.');

         var file = fileInput.files[0];
                     
         var reader = new FileReader();
         reader.readAsBinaryString(file);
         reader.onload = function (evt) {
            self.log('MRD.getBase64File: File reader loaded.');
            result = btoa(reader.result)
            self.log('MRD.getBase64File: Got base64 string: ');
            self.log(result);
            callback(result);
         }

         reader.onerror = function (evt) {
            self.log('MRD.getBase64File: Cannot read input file.');
            self.log(evt);
            errorCallback(
               new MRDError('fileread', 'Unable to read input file.')
            )
         }
      }

      self.signPrescription = function (payload, password, callback, errorCallback) {
         self.log('MRD.signPrescription: Beginning prescription signature process: ');
         self.getKeyFile(function(cert) {
            self.log('MRD.signPrescription: gotKeyFile:');
            self.log(cert);
            try {
               self.log('MRD.signPrescription: generating JWT');
               callback(KJUR.jws.JWS.sign('RS256', { "alg": "RS256", "typ": "JWT" }, payload, cert, password));
            } catch(error) {
               self.log('MRD.signPrescription: error signing prescription: ');
               console.log(error);
               errorCallback(
                  new MRDError('keydecrypt', 'Unable to sign JWT string.')
               );
            }
         }, errorCallback);
      };

      self.saveKeyFile = function(derString, callback, errorCallback) {
         self.log('MRD.saveKeyFile: saving key file');
         // Save the encrypted DER file as an PEM encrypted PKCS8 keyfile
         self.log('MRD.saveKeyFile: generating PEM string');
         var prefix = '-----BEGIN ENCRYPTED PRIVATE KEY-----\n';
         var postfix = '-----END ENCRYPTED PRIVATE KEY-----';
         var pemText = prefix + derString.match(/.{0,64}/g).join('\n') + postfix;

         self.log('MRD.saveKeyFile: PEM string generated: ');
         self.log(pemText);

         if(self.localStorageSupport){
            window.localStorage.setItem('com.mirecetadigital.storage.key_file', pemText);
            self.log('MRD.saveKeyFile: saved PEM string in local storage.');
            callback(derString);
         }
         else{
            self.log('MRD.saveKeyFile: localstorage support not found, cannot save key file.');
            if(errorCallback){
               errorCallback(new MRDError('keysave', 'Cannot save key file, browser lacks localstorage support.'));
            }
            
         }
         
      }

      self.getKeyFile = function(callback, errorCallback) {

         self.log('MRD.getKeyFile: Retrieving key file from localstorage.');

         if(!self.localStorageSupport){
            self.log('MRD.getKeyFile: Error accessing localstorage.');
            errorCallback(new MRDError('keyretrieve', 'Localstorage not supported in this browser.'))
         }

         var cert = window.localStorage.getItem('com.mirecetadigital.storage.key_file');
         self.log('MRD.getKeyFile: got file from localstorage:');
         self.log(cert);

         if(cert) {
            self.log('MRD.getKeyFile: sending key file to callee.');
            callback(cert);
         }
         else {
            self.log('MRD.getKeyFile: kye file null or not found on localstorage.');
            errorCallback(
               new MRDError('keyretrieve', 'No private keyfile was found on localstorage.')
            );
         }
      }
   }

   window.MRD = new MiRecetaDigital();
})();