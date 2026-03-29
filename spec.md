# Urban Chaos

## Current State
Single-player 3D open-world GTA-style game built with React Three Fiber. Player can walk, drive various cars (BMW, muscle car, sports car, truck), interact with NPCs, explore gang territories, and use GTA-style menus. Backend is empty (actor {}).

## Requested Changes (Diff)

### Add
- Real online multiplayer: players can join game sessions and see each other moving in the same world in real time
- Player registration: enter a username before joining the game
- Session/room system: players join a shared game world
- Friend invite: shareable room code so friends can join the same session
- Backend canister APIs: register player, update position, get all players in session, create/join room
- Polling-based sync (every ~500ms) to update other players' positions/rotations in the game world
- Other online players rendered as distinct humanoid characters in the 3D world
- Online players list HUD showing who is currently in the same session

### Modify
- App startup flow: show a "Join Game" lobby screen before entering the 3D world where user sets their username and optionally enters a room code
- Existing player position updates should also push to backend

### Remove
- Simulated/fake online friends panel (replaced with real data from backend)

## Implementation Plan
1. Motoko backend: store Player records (id, name, x, y, z, rotation, lastSeen), Room records; expose registerPlayer, updatePosition, getPlayersInRoom, createRoom, joinRoom, leaveRoom
2. Frontend lobby screen: username input, create room or join with code, then enter game
3. Polling hook: every 500ms call getPlayersInRoom, render other players as 3D humanoids
4. HUD overlay: show list of online players in current room
5. Remove simulated friends, wire up real player list
