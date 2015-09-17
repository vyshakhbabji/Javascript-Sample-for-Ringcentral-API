
    
    var callrecording;

    function rcManager(appKeyField,appSecretField,usernameField,extensionField,passwordField) {
        var t=this;
        t.appKeyField    = appKeyField;
        t.appSecretField = appSecretField;
        t.usernameField  = usernameField;
        t.extensionField = extensionField;
        t.passwordField  = passwordField;
        t.serverUrl = 'https://platform.devtest.ringcentral.com';
        t.rcsdk     = '';
        t.rch       = '';
        t.authorizeFields = function() {
            t.authorizeFull(
                    $(t.appKeyField).val(),
                    $(t.appSecretField).val(),
                    $(t.usernameField).val(),
                    $(t.extensionField).val(),
                    $(t.passwordField).val()
            );
        }
        t.authorizeFull = function(appKey,appSecret,username,extension,password) {
            t.loadRcsdk(appKey,appSecret);
            t.authorize(username,extension,password);
        }
        t.loadRcsdk = function(appKey,appSecret) {
            t.rcsdk = new RCSDK({
                server: t.serverUrl,
                appKey: appKey,
                appSecret: appSecret
            });
        }
        t.authorize = function(username,extension,password) {
            p = t.rcsdk.getPlatform();
            p.authorize({
                username:  username, // phone number in full format
                extension: extension, // leave blank if direct number is used
                password:  password
            }).then(function(response) {
                
                alert('success: '+response);
            }).catch(function(e) {
                alert('ERR ' + e.message  || 'Server cannot authorize user');
            });
            t.rch = new rcHelper(p);
        }
    }

    function rcHelper(platform) {
        var t=this;
        // var callrecording;
        t.platform = platform;
        t.send_sms = function(from,to,text) {
            t.platform.post('/account/~/extension/~/sms', {
                body: {
                    from: {phoneNumber:from}, // Your sms-enabled phone number
                    to: [
                        {phoneNumber:to} // Second party's phone number
                    ],
                    text: text
                }
            }).then(function(response) {
                alert('Success: ' + response.data.id);
            }).catch(function(e) {
                alert('Error: ' + e.message);
            });
        }

        t.ring_out = function(from,to) {
            this.platform.post('/account/~/extension/~/ringout', {
                body: {
                    from: {phoneNumber:from}, // Your sms-enabled phone number
                    to: {phoneNumber:to}, // Second party's phone number
                    playPrompt: true
                }
            }).then(function(response) {
                //alert('Success: ' + response.data.id);
            }).catch(function(e) {
                alert('Error: ' + e.message);
            });
        }

        t.call_log = function() {
            t.platform.get('/account/~/extension/~/call-log').then(function(response) {
                alert('Success: ' + response.data.uri.toString());
                var txt=JSON.stringify(response.data, null, 2);
                // alert('txt json')
                callrecording = txt;
                // alert('The JSON array is' + callrecording.toString());
                console.log('The Value of callrecording string is'+callrecording);
                document.getElementById("call-logs-text").innerHTML=txt;
            }).catch(function(e) {
                alert('Error: ' + e.message);
            });
        }

        t.presence = function() {
            t.platform.get('/account/~/extension/~/presence').then(function(response) {
                alert('Success: ' + response.data.uri.toString());
                var txt=JSON.stringify(response.data, null, 2);
                document.getElementById("presence").innerHTML=txt;
            }).catch(function(e) {
                alert('Error: ' + e.message);
            });
        }

        t.get_info = function() {
            t.platform.get('/account/~/').then(function(response) {
                alert('Success: ' + response.data.uri.toString());
                var txt=JSON.stringify(response.data, null, 2);

                document.getElementById("result").innerHTML=txt;
            }).catch(function(e) {
                alert('Error: ' + e.message);
            });
        }

        t.messagestore= function() {
            t.platform.get('/account/~/extension/~/message-store').then(function(response) {
                alert('Success: ' + response.data.uri.toString());
                var txt=JSON.stringify(response.data, null, 2);
                document.getElementById("message-store").innerHTML=txt;
            }).catch(function(e) {
                alert('Error: ' + e.message);
            });
        }

        t.calllogrecording = function() {
            // try{

            //     // var json = JSON.parse(callrecording);
            //     // var len = json.records.length;
            //     var options = options || {};
            //     options.url = '/account/131192004/recording/1216550004/content';
            //     options.method ='GET';

            //     // with the apiCall function
            //     // t.platform.apiCall(options).then(function(response) {
            //     //     alert('Success: ' + response.data);
            //     // }).catch(function(e){
            //     //     alert('Error' + e.message);
            //     // });



                t.platform.get('/account/131192004/recording/1216550004/content').then(function(response){
                    // response.setHeader('Content-Type':'audio/x-wav');
                    alert('Success: ' + response.data);
                    // alert('Response Header' + response.);
                }).catch(function(e){
                    alert('Error' + e.message);
                });

            // }catch(e){
            //     alert('Error: ' + e.message);
            // } 
        }
        
        // Helper function for call log recording
        // t.calllogrecording = function() {
        //    try{


        //           var i;
        //           alert('callrecording: '+callrecording);
        //           var json = JSON.parse(callrecording);
        //           var len = json.records.length;
        //           if( window.localStorage ) {
        //                 var lc = localStorage.getItem("rc-platform");
        //                 var authHeader = JSON.parse(lc);

        //                 alert(authHeader.access_token);
                        
        //             }
        //           for(i=0;i<len;i++) {
        //               // if(callrecording.records[i] && callrecording.records[i].hasOwnProperty('recording')) {
        //               // alert('The recording URI is:'+ callrecording.records[i].recording.contentUri);

        //               if(json.records[i].hasOwnProperty('recording')){
        //                             var uri = json.records[i].recording.contentUri;
        //                             alert('The recording URI is:'+ uri);
        //                             console.log('The Value of URI is'+ uri);

        //                           // return calllogrecording[i].recording.uri
        //                            // window.location = json.records[i].recording.contentUri;
        //                           // t.platform.get('json.records[i].recording.contentUri').then(function(response) {
        //                           //   alert("Recording Successfully downloaded");
        //                             // });
        //                         $.ajax({
        //                             url:uri,
        //                             // headers:{
        //                             //     // 'authorization': JSON.parse(localStorage.getItem("rc-platform")).access_token
        //                             //     'authorization': 'Bearer U0pDMTFQMDFQQVMwMXxBQURZbC00MFA3cmZsZmxUbzRrLXVKMVFaMGxndUJSMFAwbjhVcmlTV3lJLWlqdzgtRWVMZF9ZaU1rQUt4enJuUUk0OEVhRHNxRWdJVUhPV3FzbEwwTUtudjUtOVZPUzNjS0p2cjZSYUdsbW93cTlIekwweVY3N2F8zrQKMSOqgayMTLl0b1Zq21SUf24'
        //                             // },
        //                             beforeSend:function(xhr, settings){xhr.setRequestHeader('authorization','Bearer U0pDMTFQMDFQQVMwMXxBQURZbC00MFA3cmZsZmxUbzRrLXVKMVFaMGxndUJSMFAwbjhVcmlTV3lJLWlqdzgtRWVMZF9ZaU1rQUt4enJuUUk0OEVhRHNxRWdJVUhPV3FzbEwwTUtudjUtOVZPUzNjS0p2cjZSYUdsbW93cTlIekwweVY3N2F8zrQKMSOqgayMTLl0b1Zq21SUf24');}
        //                             type:'GET',
        //                             dataType: 'jsonp',
        //                             success:function(){ alert("successfully downloaded"); },
        //                             error:function(){ alert("Error in Downloading the Recording content");}
        //                         });
        //           }
        //       }
        //   }catch(e){
        //         alert('Error: ' + e.message);
        //       }  
        // }
}

rcm = new rcManager('#appkey','#appSecret','#userid','#extension','#password');

