import SockJS from "sockjs-client";
import { over } from "@stomp/stompjs";

export const sendSignalToUser = (userId, data) => {
  if (!stompClient || !stompClient.connected) return;
  stompClient.send(`/app/signal/user/${userId}`, {}, JSON.stringify(data));
};

export const sendCallInvite = (stompClient, targetUserId, roomId, fromUser) => {
  sendSignalToUser(targetUserId, {
    type: "call_invite",
    fromUser,
    roomId,
  });
};

export const sendOffer = (
  stompClient,
  targetUserId,
  offer,
  roomId,
  fromUser
) => {
  sendSignalToUser(targetUserId, {
    type: "offer",
    offer,
    roomId,
    fromUser,
  });
};

export const sendAnswer = (
  stompClient,
  targetUserId,
  answer,
  roomId,
  fromUser
) => {
  sendSignalToUser(targetUserId, {
    type: "answer",
    answer,
    roomId,
    fromUser,
  });
};

export const sendCandidate = (
  stompClient,
  targetUserId,
  candidate,
  roomId,
  fromUser
) => {
  sendSignalToUser(targetUserId, {
    type: "candidate",
    candidate,
    roomId,
    fromUser,
  });
};

export const disconnectSocket = (stompClient) => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log("🔌 WebSocket disconnected");
    });
  }
};
