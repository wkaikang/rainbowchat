var associatedConversation = null;
var selectedContact = null;

/* Wait for the page to load */
$(document).ready(function () {
    console.log("[DEMO] :: Rainbow Application started!");


    // Update the variables below with your applicationID and applicationSecret strings
    var applicationID = "94b345a05e9b11ea9a6dcf004cf8c14e",
        applicationSecret = "8ycO5KW52qXJetWvAwnffdb7w4iyKD4q8Rw0iJkvt99WkNmhsOYxWSkmZwcg2KYo";

    /* Bootstrap the SDK */
    angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

    /* Callback for handling the event 'RAINBOW_ONREADY' */
    var onReady = function onReady() {
        console.log("[DEMO] :: On SDK Ready !");
        // do something when the SDK is ready
        var myRainbowLogin = "pungtuckwei@gmail.com";       // Replace by your login
        var myRainbowPassword = "q%X8oJ6ZFz-5"; // Replace by your password


        // The SDK for Web is ready to be used, so you can sign in
        rainbowSDK.connection.signin(myRainbowLogin, myRainbowPassword)
            .then(function (account) {
                // Successfully signed to Rainbow and the SDK is started completely. Rainbow data could be retrieved.
                console.log(account);
            })
            .catch(function (err) {
                // An error occurs (e.g. bad credentials). Application could be informed that sign in has failed
                console.log(err);
            });
    };

    /* Callback for handling the event 'RAINBOW_ONCONNECTIONSTATECHANGED' */
    var onLoaded = function onLoaded() {
        console.log("[DEMO] :: On SDK Loaded !");

        // Activate full SDK log
        rainbowSDK.setVerboseLog(true);

        rainbowSDK
            .initialize(applicationID, applicationSecret)
            .then(function () {
                console.log("[DEMO] :: Rainbow SDK is initialized!");
            })
            .catch(function (err) {
                console.log("[DEMO] :: Something went wrong with the SDK...", err);
            });
    };
    var onSigned = function onSigned(event) {
        let account = event.detail;
        console.log("PSM onSigned")
        // Authentication has been performed successfully. Account information could be retrieved.
    };

    var onStarted = function onStarted(event, account) {
        // Do something once the SDK is ready to call Rainbow services
        var selectedContactId = "3da5e3e965cd4166b65e0b982758aa9b@sandbox-all-in-one-rbx-prod-1.rainbow.sbg";

        rainbowSDK.contacts.searchByJid(selectedContactId)
            .then(function (result) {
                return result
            })
            .then(result => rainbowSDK.conversations.openConversationForContact(result))
            .then(function (conversation) {
                associatedConversation = conversation;
            })
            .then(rainbowSDK.im.getMessagesFromConversation(associatedConversation, 30))
            .then(result => console.log(result))
            .catch(function (err) {
                // An error occurs (e.g. bad credentials). Application could be informed that sign in has failed
                console.log(err);
            });
    };

    /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

    /* Listen to the SDK event RAINBOW_ONLOADED */
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded)


    // Listen when the SDK is signed
    document.addEventListener(rainbowSDK.connection.RAINBOW_ONSIGNED, onSigned)

    // Listen when the SDK is started
    document.addEventListener(rainbowSDK.connection.RAINBOW_ONSTARTED, onStarted)

    /* Load the SDK */
    rainbowSDK.load();

    var currentPage = 0;

    // Get Previous Messages
    rainbowSDK.im.getMessagesFromConversation(associatedConversation, 30).then(function () {
        // The conversation object is updated with the messages retrieved from the server (same reference)

        // Call a function to display the new messages received
        // displayMessages(associatedConversation, currentPage);
        console.log(associatedConversation);
        // Display something if there is possibly more messages on the server
        if (!associatedConversation.historyComplete) {
            // e.g. display a button to get more messages
        }
    })

    // New Message Received
    let onNewMessageReceived = function (event) {
        let message = event.detail.message;
        let conversation = event.detail.conversation

        // Do something with the new message received
        $('.card-body').append(getReceivedMessageHTML(message, selectedContact.avatar.src));
    };

    document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, onNewMessageReceived)

    function getReceivedMessageHTML(message, avatar) {
        return '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="'+avatar+'" class="rounded-circle user_img_msg"></div><div class="msg_container">'+ message + '<span class="msg_time">' + '9:00 AM, Today' + '</span></div></div>'
    }
    function getSendMessageHTML(message, avatar) {
        return '<div class="d-flex justify-content-end mb-4"><div class="msg_container_send">'+message+'<span class="msg_time_send">'+'9:10 AM, Today'+'</span></div><div class="img_cont_msg"><img src="'+avatar+'" class="rounded-circle user_img_msg"></div></div>';
    }

    /*
        UI Interactions
    */
    $('.send_btn').on('click', function () {
        // Send message
        var message = $('#typeBar').val();
        $('.card-body').append(getSendMessageHTML(message, "https://via.placeholder.com/50"));
        $('#typeBar').val("");
        rainbowSDK.im.sendMessageToConversation(associatedConversation, message);
    });


});
