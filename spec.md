# Urban Chaos - GTA-Style Open World Upgrade

## Current State
- Single 3D scene with a BMW-style car drivable on a flat 200x200 plane
- 30 random buildings with night lighting
- Touch controls: gas, brake, left/right steering
- Keyboard controls: WASD / arrow keys
- HUD with speed and gear
- No player character, no NPCs, no menus, no multiplayer

## Requested Changes (Diff)

### Add
- Open world map: larger 600x600 terrain with roads (grid + curved), sidewalks, parks, grass zones, and road markings
- Player character (on foot): simple 3D humanoid capsule that can walk/run with WASD
- Enter/Exit car mechanic: E key + on-screen button to enter nearby car, exit button while in car
- Sit animation: player enters car and sits in driver seat position
- NPC pedestrians: ~20 NPCs walking around sidewalks with simple path AI
- Multiple car models: BMW sedan (existing), muscle car, sports car, pickup truck — all as 3D box-geometry shapes
- GTA 5 style pause menu: ESC key opens fullscreen menu with tabs (Map, Stats, Online, Quit)
- GTA V Gangs menu: in-game interaction menu when near gang territory showing gang name, join option, territory info
- Online multiplayer: ICP backend stores player positions; polling syncs other players as ghost cars/characters on the map
- Minimap HUD: small top-right radar showing player position, roads, and other online players as dots

### Modify
- Camera: third-person follow cam when on foot, behind-car cam when driving
- HUD: add health bar, wanted stars (1-5), cash display, minimap
- Controls hint: update to show Enter/Exit car key
- Map bounds: increase from 98 to 298

### Remove
- Nothing removed

## Implementation Plan
1. Backend: Motoko canister stores player sessions (id, x, z, angle, inCar, carId) with updatePosition and getPlayers calls
2. Frontend - World: expand ground plane to 600x600, add road grid (gray strips), sidewalks, park areas with green color
3. Frontend - Player: PlayerCharacter component (capsule + body box), walk physics when not in car
4. Frontend - Cars: 4 car types (BMW, MuscleCAR, SportsCar, Truck) placed at fixed spawn points; player can enter nearest
5. Frontend - Enter/Exit: proximity check, E key + button; when entered, hide player mesh, show in car; exit spawns player beside car
6. Frontend - NPCs: 20 NPCPedestrian components with simple random-walk AI on sidewalk paths
7. Frontend - GTA5 Menu: ESC overlay with GTAV-style dark panel, tabs: Map / Stats / Online / Options / Quit
8. Frontend - Gangs Menu: gang territory zones on map; when player enters zone, side panel shows gang info + Join button
9. Frontend - Minimap: small circular radar in top-right corner showing nearby map features as dots
10. Frontend - Multiplayer: poll backend every 2s, render other players as colored capsules/car shapes with name tags
