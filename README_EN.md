# 🎯 CSOP - Client-Side Orchestration Protocol

**Version:** v0.1.0  
**Status:** Alpha - Early Preview  
**License:** MIT  
**Author:** DAOUDA Abdoul Anzize - CEO, Nexus Studio  
**Contact:** nexusstudio100@gmail.com

---

## 🌟 What is CSOP?

CSOP (Client-Side Orchestration Protocol) is a revolutionary protocol that transforms the browser into an intelligent orchestrator capable of managing:

- **Storage**: Local data (IndexedDB) and cloud (Turso)
- **Compute**: Parallelized heavy computations (Web Workers)
- **Sync**: Real-time multi-user synchronization (Supabase)

**All without a backend server.**

---

## ⚡ Ultra-Fast Installation

### Option 1: CDN (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
        
        const csop = new CSOP();
        await csop.init();
        
        // You're ready! 🚀
        console.log('CSOP Ready');
    </script>
</head>
<body>
    <h1>CSOP v0.1.0 Works!</h1>
</body>
</html>
```

### Option 2: Direct Download

```bash
# Clone the repo
git clone https://github.com/Nexus-Studio-CEO/csop.git
cd csop

# Include in your project
<script type="module" src="./csop/src/csop.js"></script>
```

---

## 🎯 Quick Start - 3 Examples

### 1️⃣ Save Data

```javascript
import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';

const csop = new CSOP();
await csop.init();

// Save automatically (IndexedDB or Turso based on size)
const result = await csop.dispatch('storage.save', {
    key: 'user_profile',
    data: { name: 'Anzize', role: 'Architect' }
});

console.log('Saved:', result);
// → { status: 'ok', data: { key: 'user_profile', location: 'indexeddb' } }
```

### 2️⃣ Heavy Computations Parallelized

```javascript
// Calculate Fibonacci 1000 in parallel
const result = await csop.dispatch('compute.execute', {
    task: 'fibonacci',
    data: { n: 1000 }
});

console.log('Result:', result);
```

### 3️⃣ Real-Time Multi-User Sync

```javascript
// Broadcast an event
await csop.dispatch('sync.broadcast', {
    event: 'user_joined',
    data: { userId: 'anzize', timestamp: Date.now() }
});

// Listen to events
await csop.dispatch('sync.subscribe', {
    channel: 'workspace',
    callback: (event) => {
        console.log('Event received:', event);
    }
});
```

---

## 📚 Complete API

### STORAGE (Data Management)

```javascript
// SAVE - Intelligent save
await csop.dispatch('storage.save', {
    key: 'document_1',
    data: { title: 'My doc', content: '...' }
});

// GET - Retrieval
const data = await csop.dispatch('storage.get', {
    key: 'document_1'
});

// DELETE - Deletion
await csop.dispatch('storage.delete', {
    key: 'document_1'
});

// LIST - List keys
const keys = await csop.dispatch('storage.list', {
    prefix: 'document_'
});
```

### COMPUTE (Computations)

```javascript
// EXECUTE - Single task
await csop.dispatch('compute.execute', {
    task: 'fibonacci',
    data: { n: 100 }
});

// BATCH - Multiple tasks in parallel
await csop.dispatch('compute.batch', {
    tasks: [
        { task: 'fibonacci', data: { n: 100 } },
        { task: 'factorial', data: { n: 50 } },
        { task: 'hash_sha256', data: { message: 'hello' } }
    ]
});
```

### SYNC (Synchronization)

```javascript
// BROADCAST - Send to everyone
await csop.dispatch('sync.broadcast', {
    event: 'message_sent',
    data: { text: 'Hello world' }
});

// SUBSCRIBE - Listen
await csop.dispatch('sync.subscribe', {
    channel: 'chat',
    callback: (msg) => console.log(msg)
});

// PRESENCE - Who's online?
const online = await csop.dispatch('sync.presence', {
    channel: 'workspace'
});
```

---

## ⚙️ Advanced Configuration

### Automatic Retry

```javascript
await csop.dispatch('storage.save', {
    key: 'important_data',
    data: {...}
}, {
    retry: 3,           // 3 attempts
    timeout: 10000      // 10 seconds max
});
```

### Cloud Fallback (Turso)

```javascript
// Configure Turso for large files
const storage = csop.getCapability('storage');
storage.configureTurso({
    url: 'libsql://your-db.turso.io',
    authToken: 'your_token'
});
```

### Supabase Sync

```javascript
// Configure Supabase Realtime
const sync = csop.getCapability('sync');
sync.configureSupabase({
    url: 'https://your-project.supabase.co',
    anonKey: 'your_anon_key'
});
```

---

## 🏗️ Architecture

```
CSOP Core (csop.js)
    ↓
├── Storage Capability
│   ├── IndexedDB (< 5MB)
│   └── Turso (> 5MB, optional)
│
├── Compute Capability
│   ├── Web Workers Pool
│   └── Parallel Task Scheduler
│
└── Sync Capability
    ├── Supabase Realtime
    └── Presence Tracking
```

---

## 📊 Advantages vs Traditional Architecture

| Feature | Traditional Architecture | CSOP v0.1.0 |
|---------|----------------------|-------------|
| **Backend required** | Node.js/Python/Go | ❌ None |
| **Infra cost** | $50-500/month | ✅ $0/month |
| **Scalability** | Limited by server | ✅ Infinite |
| **Latency** | 50-200ms | ✅ 0ms (local) |
| **Offline-first** | No | ✅ Yes |
| **Complexity** | High | ✅ Low |

---

## 🚧 v0.1.0 Limitations (Alpha)

- ⚠️ **No streaming**: Files > 100MB may block
- ⚠️ **No versioning**: No modification history
- ⚠️ **Basic sync**: No advanced conflict resolution
- ⚠️ **No TypeScript**: Types coming in v0.2.0

---

## 🗺️ Roadmap

### v0.2.0 (Q2 2025)
- ✅ Streaming for large files
- ✅ TypeScript definitions
- ✅ Intelligent cache
- ✅ Metrics/Logging

### v0.3.0 (Q3 2025)
- ✅ Conflict resolution (CRDT)
- ✅ Multi-leader sync
- ✅ Progressive Web App support
- ✅ Developer Tools (debugger)

### v1.0.0 (Q4 2025)
- ✅ Production-ready
- ✅ Enterprise features
- ✅ Security audit
- ✅ Performance optimization

---

## 🤝 Contributing

CSOP is open-source and welcomes contributions!

```bash
# Fork the repo
git clone https://github.com/Nexus-Studio-CEO/csop.git

# Create a branch
git checkout -b feature/my-feature

# Commit
git commit -m "Add: my awesome feature"

# Push and Pull Request
git push origin feature/my-feature
```

---

## 📄 License

MIT License - Free use, commercial or non-commercial.

---

## 🙏 Credits

**Created by DAOUDA Abdoul Anzize**  
**CEO, Nexus Studio**

Architecture inspired by Anthropic's Model Context Protocol (MCP)

**Philosophy**: Client-Side Orchestration > Server-Side Complexity

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Nexus-Studio-CEO/csop/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nexus-Studio-CEO/csop/discussions)
- **Email**: nexusstudio100@gmail.com

---

## 🌍 Languages

- [🇫🇷 Français](./README.md)
- [🇬🇧 English](./README_EN.md) (current)

---

**CSOP v0.1.0** - The Future of Client-Side Architecture 🚀

Built with ❤️ by Nexus Studio