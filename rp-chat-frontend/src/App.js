import { useState, useRef, useEffect } from "react";
import EventSource from "react-native-sse";
import "./App.css";
import logo from './assets/logo.png';

// const sse = new EventSource(process.env.BACKEND_CONSUMER_URL);
const sse = new EventSource("http://backend.cariherb.id/messages");

const App = () => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const textArea = useRef();
  
  useEffect(() => {
    const area = textArea.current;
    area.scrollTop = area.scrollHeight;
  });

  sse.removeAllEventListeners();

  sse.addEventListener("open", (event) => {
    console.log("Open SSE connection.");
  });

  sse.addEventListener("message", (event) => {
    console.log("New message event:", event.data);
    const parsedData = JSON.parse(event.data.replaceAll("'", '"'));
    setData((data) => [...data, parsedData]);
  });

  sse.addEventListener("error", (event) => {
    if (event.type === "error") {
      console.error("Connection error:", event.message);
    } else if (event.type === "exception") {
      console.error("Error:", event.message, event.error);
    }
  });

  sse.addEventListener("close", (event) => {
    console.log("Close SSE connection.");
  });

  const enableCommentButton = () => {
    return text ? false : true;
  };
  const changeCommentButtonStyle = () => {
    return text ? "comments-button-enabled" : "comments-button-disabled";
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  const submit = async (event) => {
    try {
      // let res = await fetch(process.env.BACKEND_PRODUCER_URL, {
      let res = await fetch("http://backend.cariherb.id/message", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: username,
          text: text,
          timestamp: Date.now(),
        }),
      });
      
      if (res.status === 200) {
        setText("");
      } else {
        console.log("Response code:" + res.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div class="main-div" style={{marginTop: "20px"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src={logo} style={{maxWidth: "100px"}}/>
        <h3>&nbsp;Chat</h3>
      </div>
      <br/>
      <textarea className="text-area" ref={textArea} readOnly={true} rows="20" cols="70" value=
      {data.map((message) => (
        message.username + ": " + message.text
      )).join("\r\n")}/>

        <div className="info-box">
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            placeholder="Enter a nickname"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="comments-box">
          <input
            value={text}
            id="text"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Send a message..."
          />
          <button
            onClick={submit}
            className="comments-button"
            id={changeCommentButtonStyle()}
            disabled={enableCommentButton()}
          >
            Post
          </button>
        </div>
    </div>
  );
};

export default App;
