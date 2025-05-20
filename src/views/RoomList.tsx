import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { getDeviceId } from "../utils/device";
import { io, Socket } from "socket.io-client";

//estilizado adicional
import "../RoomList.css";

interface RoomInfo {
  pin: string;
  count: number;
  limit: number;
}

interface CreateRoomResponse {
  success: boolean;
  pin?: string;
  message?: string;
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL!;

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [limit, setLimit] = useState<number>(6);
  const navigate = useNavigate();
  const deviceId = getDeviceId();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL, { query: { deviceId } });
    setSocket(newSocket);

    newSocket.emit("get_rooms");
    newSocket.on("rooms_data", (data: RoomInfo[]) => setRooms(data));

    const interval = setInterval(() => {
      newSocket.emit("get_rooms");
    }, 6000);

    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, [deviceId]);

  const createRoom = () => {
    if (!socket) return;

    socket.emit(
      "create_room",
      { nickname: "Anfitrión", limit, deviceId },
      ({ success, pin, message }: CreateRoomResponse) => {
        if (success && pin) {
          navigate(`/chat/${pin}`, { state: { nickname: "Anfitrión" } });
        } else {
          console.error("Error al crear sala:", message);
        }
      }
    );
  };

  const goJoin = () => {
    navigate("/join");
  };

  return (
    <div className="room-list-container">
      <Card
        title={
          <h2 className="text-center" style={{ color: "#2c2c2c" }}>
            Lista de Salas
          </h2>
        }
        className="room-card"
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(255, 245, 240, 0.95)",
          borderRadius: "1rem",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <ul className="list-group mb-3">
          {rooms.map((r) => (
            <li
              key={r.pin}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <strong>{r.pin}</strong> — {r.count}/{r.limit}
            </li>
          ))}
          {rooms.length === 0 && (
            <li className="list-group-item">No hay salas por el momento</li>
          )}
        </ul>

        <div className="mb-3">
          <label
            htmlFor="limitInput"
            className="form-label"
            style={{ color: "black" }}
          >
            Límite de integrantes
          </label>
          <InputNumber
            id="limitInput"
            value={limit}
            onValueChange={(e) => e.value && setLimit(e.value)}
            min={2}
            max={20}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            style={{ width: "100%" }}
          />
        </div>

        <div className="d-flex justify-content-center gap-3">
          <Button
            label="Crear Sala"
            icon="pi pi-plus"
            onClick={createRoom}
            className="p-button-success"
          />
          <Button
            label="Unirse a Sala"
            icon="pi pi-sign-in"
            onClick={goJoin}
            className="p-button-secondary"
          />
        </div>
      </Card>
    </div>
  );
};

export default RoomList;
