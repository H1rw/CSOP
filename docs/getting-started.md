# 🚀 Getting Started with CSOP v0.1.0

Welcome to the Client-Side Orchestration Protocol! This guide will get you up and running in 5 minutes.

---

## ⚡ Quick Start (30 seconds)

Create `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First CSOP App</title>
</head>
<body>
    <h1>CSOP Test</h1>
    <button onclick="test()">Click Me</button>

    <script type="module">
        import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
        
        const csop = new CSOP();
        await csop.init();
        
        window.test = async function() {
            await csop.dispatch('storage.save', {
                key: 'hello',
                data: { message: 'Hello CSOP!' }
            });
            
            const result = await csop.dispatch('storage.get', {
                key: 'hello'
            });
            
            alert(result.data.message);
        }
    </script>
</body>
</html>
```

Open in browser → Click button → It works! 🎉

---

## 📦 Installation Methods

### Method 1: CDN (Recommended)

No installation needed, just import:

```javascript
import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
```

**Advantages:**
- ✅ Zero configuration
- ✅ Always up-to-date
- ✅ No build tools needed

### Method 2: Download

```bash
git clone https://github.com/Nexus-Studio-CEO/csop.git
cd csop
```

Then in your HTML:

```html
<script type="module">
    import { CSOP } from './csop/src/csop.js';
</script>
```

### Method 3: NPM (Coming in v0.2.0)

```bash
npm install @nexusstudio/csop
```

---

## 🎯 Core Concepts

### 1. Initialization

Always initialize CSOP before use:

```javascript
import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';

const csop = new CSOP();
await csop.init();  // Important!

console.log('CSOP Ready:', csop.info());
```

### 2. The Dispatch Pattern

All actions use `dispatch`:

```javascript
const result = await csop.dispatch('domain.operation', payload, options);
```

**Format:**
- `domain` - Capability (storage, compute, sync)
- `operation` - Action (save, get, execute, etc.)
- `payload` - Data for the action
- `options` - Timeout, retry, etc. (optional)

### 3. Response Structure

Every action returns:

```javascript
{
    id: "csop_unique_id",
    status: "ok" | "error",
    data: ...result,        // If success
    error: {...},           // If error
    duration: 123           // Time in ms
}
```

---

## 💾 First Example: Storage

```javascript
// Save data
await csop.dispatch('storage.save', {
    key: 'user_profile',
    data: {
        name: 'Anzize Daouda',
        role: 'CEO',
        company: 'Nexus Studio'
    }
});

// Get data
const profile = await csop.dispatch('storage.get', {
    key: 'user_profile'
});

console.log(profile.data.name); // "Anzize Daouda"

// List all keys
const keys = await csop.dispatch('storage.list', {});
console.log(keys.data); // ["user_profile"]

// Delete
await csop.dispatch('storage.delete', {
    key: 'user_profile'
});
```

---

## ⚡ Second Example: Compute

```javascript
// Single computation
const fib = await csop.dispatch('compute.execute', {
    task: 'fibonacci',
    data: { n: 100 }
});
console.log(`Fibonacci(100) = ${fib.data}`);

// Batch processing (parallel)
const batch = await csop.dispatch('compute.batch', {
    tasks: [
        { task: 'fibonacci', data: { n: 50 } },
        { task: 'factorial', data: { n: 10 } },
        { task: 'isPrime', data: { n: 97 } }
    ]
});

console.log(`Completed: ${batch.data.completed}/${batch.data.total}`);
```

---

## 🔄 Third Example: Real-time Sync

### Tab 1: Sender

```javascript
await csop.dispatch('sync.broadcast', {
    event: 'message',
    data: { text: 'Hello from Tab 1!' }
});
```

### Tab 2: Receiver

```javascript
await csop.dispatch('sync.subscribe', {
    channel: 'default',
    callback: (msg) => {
        console.log('Received:', msg.data.text);
    }
});
```

Open both tabs, send from Tab 1 → Appears in Tab 2! 🎉

---

## 🎨 Full Working Example

Create `todo-app.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CSOP Todo App</title>
    <style>
        body { 
            font-family: system-ui; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #1a1a1a;
            color: white;
        }
        input { 
            padding: 10px; 
            width: 70%; 
            font-size: 16px;
            background: #2a2a2a;
            border: 1px solid #444;
            color: white;
        }
        button { 
            padding: 10px 20px; 
            font-size: 16px;
            background: #3b82f6;
            color: white;
            border: none;
            cursor: pointer;
        }
        .todo { 
            padding: 15px; 
            margin: 10px 0; 
            background: #2a2a2a;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>
    <h1>📝 CSOP Todo App</h1>
    
    <div>
        <input id="input" placeholder="New todo..." />
        <button onclick="addTodo()">Add</button>
    </div>

    <div id="todos"></div>

    <script type="module">
        import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
        
        const csop = new CSOP();
        await csop.init();

        let todos = [];

        // Load existing todos
        try {
            const saved = await csop.dispatch('storage.get', { key: 'todos' });
            todos = saved.data;
            render();
        } catch (e) {
            console.log('No saved todos');
        }

        window.addTodo = async function() {
            const input = document.getElementById('input');
            const text = input.value.trim();
            
            if (!text) return;

            todos.push({ 
                id: Date.now(), 
                text, 
                done: false 
            });

            await csop.dispatch('storage.save', {
                key: 'todos',
                data: todos
            });

            input.value = '';
            render();
        }

        window.deleteTodo = async function(id) {
            todos = todos.filter(t => t.id !== id);
            
            await csop.dispatch('storage.save', {
                key: 'todos',
                data: todos
            });
            
            render();
        }

        function render() {
            const container = document.getElementById('todos');
            container.innerHTML = todos.map(todo => `
                <div class="todo">
                    <span>${todo.text}</span>
                    <button onclick="deleteTodo(${todo.id})">Delete</button>
                </div>
            `).join('');
        }
    </script>
</body>
</html>
```

Open → Add todos → Refresh page → Todos persist! 🎉

---

## 🔧 Advanced Configuration

### Custom Storage Threshold

```javascript
await csop.init({
    storage: {
        maxLocalSize: 10 * 1024 * 1024  // 10MB
    }
});
```

### Custom Worker Count

```javascript
await csop.init({
    compute: {
        numWorkers: 16  // Force 16 workers
    }
});
```

### Supabase Integration

```html
<!-- Include Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script type="module">
    import { CSOP } from 'https://cdn.jsdelivr.net/gh/Nexus-Studio-CEO/csop@v0.1.0/src/csop.js';
    
    const csop = new CSOP();
    await csop.init({
        sync: {
            supabase: {
                url: 'https://your-project.supabase.co',
                anonKey: 'your_anon_key'
            }
        }
    });

    // Now sync works across different devices!
</script>
```

---

## 🚨 Common Mistakes

### ❌ Forgetting to await init()

```javascript
const csop = new CSOP();
csop.init();  // ❌ Missing await
csop.dispatch(...);  // Error!
```

**Fix:**
```javascript
const csop = new CSOP();
await csop.init();  // ✅ Await init
csop.dispatch(...);
```

### ❌ Not handling errors

```javascript
const result = await csop.dispatch('storage.get', { key: 'missing' });
// Throws error if key doesn't exist!
```

**Fix:**
```javascript
try {
    const result = await csop.dispatch('storage.get', { key: 'missing' });
    console.log(result.data);
} catch (error) {
    console.log('Key not found');
}
```

### ❌ Wrong action format

```javascript
await csop.dispatch('save', {...});  // ❌ Missing domain
```

**Fix:**
```javascript
await csop.dispatch('storage.save', {...});  // ✅ domain.operation
```

---

## 🎯 Next Steps

1. **Read the [API Reference](./api.md)** - Complete documentation
2. **Try [Advanced Examples](../examples/advanced.html)** - Real-world patterns
3. **Check [Architecture Guide](./architecture.md)** - Understand how it works
4. **Join GitHub Discussions** - Ask questions, share ideas

---

## 📞 Need Help?

- **GitHub Issues:** https://github.com/Nexus-Studio-CEO/csop/issues
- **Email:** nexusstudio100@gmail.com
- **Examples:** Check `/examples` folder in the repo

---

## 🎉 You're Ready!

You now know:
- ✅ How to install CSOP
- ✅ The dispatch pattern
- ✅ Storage, Compute, and Sync basics
- ✅ How to build a real app

**Start building something amazing!** 🚀

---

**Created by DAOUDA Abdoul Anzize**  
**CEO, Nexus Studio**  
**License:** MIT