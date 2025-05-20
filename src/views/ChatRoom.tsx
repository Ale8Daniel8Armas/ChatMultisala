import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { getDeviceId } from "../utils/device";
import "../ChatRoom.css";

interface Message {
  autor: string;
  message: string;
}

interface HostInfo {
  ip: string;
  hostname: string;
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL!;

const ChatRoom: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const initialNick = (location.state as any)?.nickname as string | undefined;
  const [nickname] = useState<string>(initialNick || "");
  const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const deviceId = getDeviceId();

  useEffect(() => {
    if (!initialNick) navigate("/join");
  }, [initialNick, navigate]);

  useEffect(() => {
    if (!nickname) return;

    const socket = io(SERVER_URL, { query: { deviceId } });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit(
        "join_room",
        { pin, nickname },
        (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            alert(response.message || "Error al entrar a la sala");
            socket.disconnect();
            navigate("/join");
          }
        }
      );
    });

    socket.on("host_info", (data) => setHostInfo(data));
    socket.on("receive_message", (m) => setMessages((prev) => [...prev, m]));
    socket.on("room_data", ({ users, limit }) => {
      setUsersCount(users.length);
      setLimit(limit);
    });
    socket.on("room_deleted", () => {
      alert("La sala fue eliminada por el anfitrión.");
      navigate("/");
    });

    return () => {
      socket.disconnect();
    };
  }, [pin, nickname, deviceId, navigate]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current?.emit("send_message", { pin, autor: nickname, message });
    setMessage("");
  };

  return (
    <div className="chatroom-container">
      <Card
        title={
          <div className="text-center">{`Sala #${pin} — ${usersCount}/${limit}`}</div>
        }
        className="chatroom-card"
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="host-info text-sm text-light">
            Conectado a <strong>{hostInfo?.hostname}</strong> ({hostInfo?.ip})
          </div>
          <Button
            icon="pi pi-sign-out"
            className="p-button-rounded p-button-danger p-button-sm"
            onClick={() => navigate("/")}
            tooltip="Salir"
            tooltipOptions={{ position: "left" }}
          />
        </div>

        <div className="msg-container mb-3">
          {messages.map((m, i) => (
            <p
              key={i}
              className={`chat-msg ${m.autor === nickname ? "own" : "other"}`}
            >
              <strong>{m.autor}:</strong> {m.message}
            </p>
          ))}
        </div>

        <div className="input-area">
          <InputTextarea
            rows={2}
            cols={50}
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Escribe un mensaje..."
            className="chat-input"
          />
          <Button
            label="Enviar"
            icon="pi pi-send"
            onClick={sendMessage}
            className="chat-send-btn"
          />
        </div>
      </Card>
    </div>
  );
};
export default ChatRoom;
