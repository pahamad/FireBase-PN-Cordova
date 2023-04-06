import "./App.css";
import React, { useState, useEffect } from "react";
import { fetchToken, onMessageListener } from "./firebase";
import { Button, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [token, setToken] = useState(null);
  const [isTokenFound, setTokenFound] = useState(false);
  fetchToken(setTokenFound, setToken);

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      setShow(true);
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  const onShowNotificationClicked = () => {
    setNotification({
      title: "Notification",
      body: "This is a test notification",
    });
    setShow(true);
  };

  /**** Parwej PN cordova code  */
  function addToLog(log) {
    console.log("log: " + log);
    //setLogs([log]);
  }

  function trySomeTimes(asyncFunc, onSuccess, onFailure, customTries) {
    var tries = typeof customTries === "undefined" ? 100 : customTries;
    var interval = setTimeout(function () {
      if (typeof asyncFunc !== "function") {
        onSuccess("Unavailable");
        return;
      }
      asyncFunc()
        .then(function (result) {
          if ((result !== null && result !== "") || tries < 0) {
            onSuccess(result);
          } else {
            trySomeTimes(asyncFunc, onSuccess, onFailure, tries - 1);
          }
        })
        .catch(function (e) {
          clearInterval(interval);
          onFailure(e);
        });
    }, 100);
  }

  function setupOnTokenRefresh() {
    FCM.eventTarget.addEventListener(
      "tokenRefresh",
      function (data) {
        addToLog("Token refreshed:" + data.detail);
        setToken(data.detail);
      },
      false
    );
  }

  function setupOnNotification() {
    FCM.eventTarget.addEventListener(
      "notification",
      function (payload) {
        //alert("OnNot");
        setNotification({
          title: payload.detail.title,
          body: payload.detail.body,
        });
        setShow(true);
        //setNotification(JSON.stringify(payload.detail, null, 2));
        addToLog(JSON.stringify(payload.detail, null, 2));
      },
      false
    );
    FCM.getInitialPushPayload()

      .then((payload) => {
        addToLog("Initial Payload: " + JSON.stringify(payload, null, 2));
      })
      .catch((error) => {
        addToLog("Initial Payload Error: " + JSON.stringify(error, null, 2));
      });
  }

  function logFCMToken() {
    trySomeTimes(
      FCM.getToken,
      function (token) {
        addToLog("Toke: " + token);
        setToken(token);
      },
      function (error) {
        addToLog("Error on listening for FCM token: " + error + "");
      }
    );
  }

  // function logAPNSToken() {
  //   if (cordova.platformId !== "ios") {
  //     return;
  //   }
  //   FCM.getAPNSToken(
  //     function (token) {
  //       addToLog("APNS as: " + token);
  //       setToken(token);
  //     },
  //     function (error) {
  //       addToLog("Error on listening for APNS token: " + error);
  //     }
  //   );
  // }

  // function setupClearAllNotificationsButton() {
  //   setLogs(["Cleared"]);
  //   FCM.clearAllNotifications();
  // }

  // function setupClearAllNotificationsButton() {
  //   FCM.deleteInstanceId().catch(function (error) {
  //     alert(error);
  //   });
  // }

  function waitForPermission(callback) {
    FCM.requestPushPermission()
      .then(function (didIt) {
        if (didIt) {
          callback();
        } else {
          addToLog("Push permission was not given to this application");
        }
      })
      .catch(function (error) {
        addToLog("Error on checking permission: " + error);
      });
  }

  function logHasPermissionOnStart() {
    FCM.hasPermission().then(function (hasIt) {
      addToLog("Started with permission: " + JSON.stringify(hasIt));
    });
  }

  function setupListeners() {
    logHasPermissionOnStart();
    waitForPermission(function () {
      FCM.createNotificationChannel({
        id: "sound_alert6",
        name: "Sound Alert6",
        // description: "Useless",
        importance: "high",
        // visibility: "public",
        sound: "elet_mp3",
        // lights: false,
        // vibration: false,
      });
      logFCMToken();
      //logAPNSToken();
      setupOnTokenRefresh();
      setupOnNotification();
      //setupClearAllNotificationsButton();
    });
  }

  useEffect(() => {
    setupListeners();
  }, []);

  return (
    <div className="App">
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
        animation
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          minWidth: 200,
        }}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">{notification.title}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
      <header className="App-header">
        {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
        {!isTokenFound && <h1> Need notification permission ❗️ </h1>}

        {/*
          <Button onClick={() => onShowNotificationClicked()}>Show Toast</Button>
        */}

        <br />
        {token ? (
          <CopyToClipboard text={token}>
            <button>Copy my FCM token</button>
          </CopyToClipboard>
        ) : null}
      </header>
    </div>
  );
}

export default App;
