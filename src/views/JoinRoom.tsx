import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getDeviceId } from "../utils/device";
import { io, Socket } from "socket.io-client";
import "../JoinRoom.css";

interface JoinResponse {
  success: boolean;
  message?: string;
  redirect?: boolean;
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL!;

const JoinRoom: React.FC = () => {
  const [pin, setPin] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();
  const deviceId = getDeviceId();

  // Verificar conexión existente al cargar el componente
  useEffect(() => {
    if (!pin.trim()) return;

    const checkSocket = io(SERVER_URL, {
      query: { deviceId },
      autoConnect: false,
    });

    checkSocket.connect();
    setSocket(checkSocket);

    return () => {
      checkSocket.disconnect();
    };
  }, [pin, deviceId]);

  const checkExistingConnection = async () => {
    if (!socket || !pin.trim()) return false;

    try {
      const response = await new Promise<{ isConnected: boolean }>(
        (resolve) => {
          socket.emit(
            "check_active_connection",
            {
              pin: pin.trim(),
              deviceId,
            },
            resolve
          );
        }
      );

      return response.isConnected;
    } catch (err) {
      console.error("Error al verificar conexión:", err);
      return false;
    }
  };

  const join = async () => {
    setError(null);
    const trimmedPin = pin.trim();
    const trimmedNick = nickname.trim();

    if (!trimmedPin) {
      setError("Tienes que ingresar el PIN de esta sala!");
      return;
    }
    if (!trimmedNick) {
      setError("Falta tu nombre de usuario!");
      return;
    }

    // Verificar si ya está conectado
    const isAlreadyConnected = await checkExistingConnection();
    if (isAlreadyConnected) {
      navigate(`/chat/${trimmedPin}`, {
        state: { nickname: trimmedNick },
        replace: true,
      });
      return;
    }

    // Conexión normal
    const connectionSocket = io(SERVER_URL, { query: { deviceId } });

    connectionSocket.emit(
      "join_room",
      { pin: trimmedPin, nickname: trimmedNick },
      ({ success, message, redirect }: JoinResponse) => {
        if (success) {
          navigate(`/chat/${trimmedPin}`, {
            state: { nickname: trimmedNick },
          });
        } else if (redirect) {
          // Redirigir si ya está en la sala
          navigate(`/chat/${trimmedPin}`, {
            state: { nickname: trimmedNick },
            replace: true,
          });
        } else {
          setError(message || "Error de conexión con la sala.");
        }
        connectionSocket.disconnect();
      }
    );
  };

  return (
    <div className="joinroom-container">
      <Card
        title={<div className="text-center text-white">Unirse a Sala</div>}
        className="room-card"
      >
        <div className="d-flex justify-content-end mb-2">
          <Button
            icon="pi pi-arrow-left"
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={() => navigate("/")}
            tooltip="Volver"
            tooltipOptions={{ position: "left" }}
          />
        </div>

        {error && (
          <div className="p-error mb-3 text-sm text-red-300">{error}</div>
        )}

        <div className="mb-3">
          <label htmlFor="pinInput" className="form-label text-white">
            PIN de la sala
          </label>
          <InputText
            id="pinInput"
            value={pin}
            onChange={(e) => setPin(e.currentTarget.value)}
            placeholder="Ej: 394892"
            className="w-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.2)",
              color: "white",
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nickInput" className="form-label text-white">
            Tu nombre de usuario
          </label>
          <InputText
            id="nickInput"
            value={nickname}
            onChange={(e) => setNickname(e.currentTarget.value)}
            placeholder="Ej: anonimo93"
            className="w-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.2)",
              color: "white",
            }}
          />
        </div>

        <Button
          label="Unirse a la sala"
          icon="pi pi-sign-in"
          onClick={join}
          className="w-full p-button-success"
          style={{ background: "#4CAF50", border: "none" }}
        />
      </Card>
    </div>
  );
};

export default JoinRoom;
