/**
 * CSOP Compute Capability
 * Handles heavy computations using Web Workers
 */

export class ComputeCapability {
    constructor() {
        this.workers = [];
        this.queue = [];
        this.numWorkers = navigator.hardwareConcurrency || 4;
        this.workerScript = null;
    }

    /**
     * Initialize worker pool
     */
    async init(config = {}) {
        this.numWorkers = config.numWorkers || this.numWorkers;
        
        // Create worker script blob
        this.workerScript = this._createWorkerScript();
        
        // Initialize workers
        for (let i = 0; i < this.numWorkers; i++) {
            this.workers.push({
                id: i,
                worker: new Worker(this.workerScript),
                busy: false
            });
        }

        console.log(`⚡ Compute initialized with ${this.numWorkers} workers`);
    }

    /**
     * EXECUTE - Run a single task
     */
    async execute({ task, data, options = {} }) {
        if (!task) {
            throw new Error('Task name is required');
        }

        return new Promise((resolve, reject) => {
            const taskId = crypto.randomUUID();
            
            this.queue.push({
                id: taskId,
                task,
                data,
                options,
                resolve,
                reject
            });

            this._processQueue();
        });
    }

    /**
     * BATCH - Run multiple tasks in parallel
     */
    async batch({ tasks, options = {} }) {
        if (!Array.isArray(tasks) || tasks.length === 0) {
            throw new Error('Tasks array is required');
        }

        const promises = tasks.map(t => 
            this.execute({ 
                task: t.task, 
                data: t.data, 
                options 
            }).then(result => ({
                status: 'fulfilled',
                task: t.task,
                result
            })).catch(error => ({
                status: 'rejected',
                task: t.task,
                error: error.message
            }))
        );

        const results = await Promise.all(promises);

        return {
            total: tasks.length,
            completed: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'rejected').length,
            results
        };
    }

    /**
     * Process task queue
     * @private
     */
    _processQueue() {
        if (this.queue.length === 0) return;

        // Find free worker
        const freeWorker = this.workers.find(w => !w.busy);
        if (!freeWorker) return;

        // Get next task
        const task = this.queue.shift();
        freeWorker.busy = true;

        // Setup timeout
        const timeout = setTimeout(() => {
            freeWorker.worker.terminate();
            freeWorker.worker = new Worker(this.workerScript);
            freeWorker.busy = false;
            task.reject(new Error('Task timeout'));
            this._processQueue();
        }, task.options.timeout || 30000);

        // Handle result
        const handleMessage = (e) => {
            clearTimeout(timeout);
            freeWorker.worker.removeEventListener('message', handleMessage);
            freeWorker.busy = false;

            if (e.data.success) {
                task.resolve(e.data.result);
            } else {
                task.reject(new Error(e.data.error));
            }

            this._processQueue();
        };

        freeWorker.worker.addEventListener('message', handleMessage);
        freeWorker.worker.postMessage({
            id: task.id,
            task: task.task,
            data: task.data
        });
    }

    /**
     * Create worker script
     * @private
     */
    _createWorkerScript() {
        const script = `
        self.onmessage = function(e) {
            const { id, task, data } = e.data;
            
            try {
                let result;
                
                switch(task) {
                    case 'fibonacci':
                        result = fibonacci(data.n || 10);
                        break;
                    
                    case 'factorial':
                        result = factorial(data.n || 10);
                        break;
                    
                    case 'isPrime':
                        result = isPrime(data.n || 2);
                        break;
                    
                    case 'hash_sha256':
                        result = hashSHA256(data.message || '');
                        break;
                    
                    case 'sum':
                        result = (data.numbers || []).reduce((a, b) => a + b, 0);
                        break;
                    
                    case 'custom':
                        // Execute custom function if provided
                        if (data.fn) {
                            const fn = new Function('data', data.fn);
                            result = fn(data.args);
                        } else {
                            throw new Error('Custom task requires fn parameter');
                        }
                        break;
                    
                    default:
                        throw new Error('Unknown task: ' + task);
                }
                
                self.postMessage({ id, success: true, result });
                
            } catch (error) {
                self.postMessage({ id, success: false, error: error.message });
            }
        };
        
        // Fibonacci (iterative, safe)
        function fibonacci(n) {
            if (n <= 1) return n;
            let a = 0, b = 1;
            for (let i = 2; i <= n; i++) {
                let temp = a + b;
                a = b;
                b = temp;
            }
            return b;
        }
        
        // Factorial (iterative)
        function factorial(n) {
            if (n < 0) return -1;
            if (n === 0) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }
        
        // Prime check (optimized)
        function isPrime(n) {
            if (n <= 1) return false;
            if (n <= 3) return true;
            if (n % 2 === 0 || n % 3 === 0) return false;
            for (let i = 5; i * i <= n; i += 6) {
                if (n % i === 0 || n % (i + 2) === 0) return false;
            }
            return true;
        }
        
        // Simple hash (for demo, use crypto API for real hashing)
        function hashSHA256(message) {
            // Note: This is a placeholder
            // In production, use crypto.subtle.digest
            let hash = 0;
            for (let i = 0; i < message.length; i++) {
                const char = message.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        }
        `;

        const blob = new Blob([script], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    /**
     * Terminate all workers
     */
    destroy() {
        this.workers.forEach(w => w.worker.terminate());
        this.workers = [];
        console.log('⚡ Compute workers terminated');
    }
}