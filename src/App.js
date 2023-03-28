import './App.css';
import {useState} from 'react';
import { fetchToken, onMessageListener } from './firebase';
import {Button, Toast} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';

function App() {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [token, setToken] = useState(null);
  const [isTokenFound, setTokenFound] = useState(false);
  fetchToken(setTokenFound, setToken);

  onMessageListener().then(payload => {
    setNotification({title: payload.notification.title, body: payload.notification.body})
    setShow(true);
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    setNotification({title: "Notification", body: "This is a test notification"})
    setShow(true);
  }

  return (
    <div className="App">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide animation style={{
          position: 'absolute',
          top: 20,
          right: 20,
          minWidth: 200
        }}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
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

        <br/>
        {
          token
          ?
          (
            <CopyToClipboard text={token}>
              <button>Copy my FCM token</button>
            </CopyToClipboard>
          )
          : null
        }
      </header>
    </div>
  );
}

export default App;
