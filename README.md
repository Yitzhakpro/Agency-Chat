<div align='center'>

# **Agency Chat**

</div>

<div align='center'>

### Open-Source, Self-Hosted, Chat application

</div>

# About the project
Agency chat is a web communication application (socket based).
<br/>
Users can create chat rooms and talk with each other.
<br/>
There are also admin users that can kick/mute/ban other users.

# TODO
- [x] Login / Register
- [x] Rooms
- [x] Roles
- [x] Commands (kick/mute/ban)
- [x] Single session
- [ ] Room Info
- [ ] Protected Rooms (with password)

# Development
**⚠️To fire up the application you will need to have redis & postgres running**

**You can view the env variables that can be used in the backend in: `apps/agency-chat-backend/src/config`**

**You can view the env variables that can be used in the frontend in: `apps/agency-chat-frontend/src/config/config.ts`**

clone the project:
```bash
$ git clone https://github.com/Yitzhakpro/Agency-Chat.git
```

Install the dependencies:
```bash
$ pnpm install
```

Serve the applications (frontend & backend)
```bash
$ pnpm nx run-many --targets=serve
```