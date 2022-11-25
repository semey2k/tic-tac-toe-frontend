import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import gameContext from '../../gameContext';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import styles from './JoinRoom.module.scss';

interface IJoinRoomProps {}

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const Title = styled.h4`
  color: rgb(146, 106, 163);
`;

const JoinButton = styled.button`
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  font-size: 1rem;
  color: rgb(146, 106, 163);
  font-weight: 700;
  text-transform: uppercase;
  font-family: inherit;
  padding: 1.5em 2em;
  border: 2px solid rgb(146, 106, 163);
  border-radius: 1em;
  background: rgb(243, 205, 255);
  transform-style: preserve-3d;
  transition: all 175ms cubic-bezier(0, 0, 1, 1);
  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(146, 106, 163);
    border-radius: inherit;
    box-shadow: 0 0 0 2px rgb(146, 106, 163);
    transform: translate3d(0, 0.75em, -1em);
    transition: all 175ms cubic-bezier(0, 0, 1, 1);
  }

  &:hover {
    background: rgb(225, 187, 232);
    transform: translate(0, 0.375em);

    &::before {
      transform: translate3d(0, 0.75em, -1em);
    }
  }

  &:active {
    transform: translate(0em, 0.75em);
    &::before {
      transform: translate3d(0, 0, -1em);
      box-shadow: 0 0 0 2px rgb(175, 121, 186), 0 0.25em 0 0 rgb(175, 121, 186);
    }
  }
`;

const Span = styled.span`
  position: relative;
  display: inline-block;
  margin: 30px 10px;
`;

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState('');
  const [isJoin, setJoin] = useState(false);

  const { setInRoom } = useContext(gameContext);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!roomName || roomName.trim() === '' || !socket) return;

    setJoin(true);

    const joined = await gameService.joinGame(socket, roomName).catch((err) => {
      alert(err);
    });

    if (joined) {
      setInRoom(true);
    }

    setJoin(false);
  };

  return (
    <form onSubmit={joinRoom}>
      <JoinRoomContainer>
        <Title>Enter Room ID to Create or Enter the Game</Title>
        <div>
          <Span>
            <input
              placeholder="Room ID"
              id="artist"
              value={roomName}
              onChange={handleRoomNameChange}
              autoComplete="off"
              className={styles.input}
            />
            <label>Room ID</label>
          </Span>
        </div>
        <JoinButton type="submit" disabled={isJoin}>
          {isJoin ? 'Joining...' : 'Join'}
        </JoinButton>
      </JoinRoomContainer>
    </form>
  );
}
