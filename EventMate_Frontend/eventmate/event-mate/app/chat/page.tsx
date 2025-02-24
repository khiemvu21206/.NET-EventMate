"use client";
import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr";
const ChatComponent = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{a: string, b: string}[]>([]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5244/chathub') // URL của SignalR Hub
      .build();

    setConnection(newConnection);

    newConnection.on('ReceiveMessage', (msg, m2) => {
      console.log("msg", msg, m2);
      setMessages((msgs,) => [...msgs, msg]);
    });
 
    newConnection.start().catch((error) => console.error(error.toString()));

    return () => {
      newConnection.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection && user && message) {
      await connection.invoke('SendMessage', user, message);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat Room</h1>
      <div
        style={{
          width: '300px',
          height: '400px',
          border: '1px solid black',
          overflowY: 'scroll',
          padding: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="user" style={{ fontWeight: 'bold' }}>
              {msg.a}:  {msg.b}
            </span>
          
            <br />
          
          </div>
        ))}
      </div>
      <br />
      <input
        type="text"
        placeholder="Your Name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        style={{ width: '250px' }}
      />
      <br />
      <input
        type="text"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '250px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
  
export default ChatComponent;
