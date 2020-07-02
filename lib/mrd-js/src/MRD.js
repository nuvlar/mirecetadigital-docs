

(function(){

   var MRDError = function(type, message){
      var self = this;

      self.type = type;
      self.message = message;

   }
   
   var MRD = function(){

      var self = this;

      self.signPrescription = function (stringData, password, callback, errorCallback) {
         self.getKeyFile(password, function(rsaPrivateKey){
            var sig = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
            sig.init(rsaPrivateKey);
            sig.updateString(stringData);
            callback(sig.sign())
         },errorCallback);
      };

      self.saveKeyFile = function(string, password, callback){
         var encrypted = CryptoJS.AES.encrypt(string, password).toString();
         window.localStorage.setItem('com.mirecetadigital.storage.key_file', encrypted);
         callback(encrypted);
      }

      self.getKeyFile = function(password, callback, errorCallback){

         var encrypted = window.localStorage.getItem('com.mirecetadigital.storage.key_file');

         if(encrypted){
            try {
               var bytes  = CryptoJS.AES.decrypt(encrypted, password);
               var originalText = bytes.toString(CryptoJS.enc.Utf8);
            } catch {
               errorCallback(
                  new MRDError('keydecrypt', 'Unable to decrypt keyfile. Verify password')
               );
            }
            callback(originalText);
         }
         else{
            errorCallback(
               new MRDError('keyretrieve', 'No private keyfile was found on localstorage.')
            );
         }
      }




   }

   window.MRD = new MRD();
})();