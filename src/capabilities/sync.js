/**
 * CSOP Sync Capability
 * Handles real-time synchronization (Supabase Realtime or custom WebSocket)
 */

export class SyncCapability {
    constructor() {
        this.supabase = null;
        this.channels = new Map();
        this.callbacks = new Map();
    }

    /**
     * Initialize sync capability
     */
    async init(config = {}) {
        if (config.supabase) {
            await this.configureSupabase(config.supabase);
        } else {
            console.log('🔄 Sync initialized (no backend configured)');
        }
    }

    /**
     * Configure Supabase for realtime sync
     */
    async configureSupabase({ url, anonKey }) {
        if (!url || !anonKey) {
            throw new Error('Supabase url and anonKey are required');
        }

        // Note: In v0.1.0, users need to include Supabase SDK separately
        // <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
        
        if (typeof window.supabase === 'undefined') {
            console.warn('⚠️ Supabase SDK not found. Include: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
            return;
        }

        this.supabase = window.supabase.createClient(url, anonKey);
        console.log('☁️ Supabase Realtime configured');
    }

    /**
     * BROADCAST - Send message to all subscribers
     */
    async broadcast({ event, data, channel = 'default' }) {
        if (!event) {
            throw new Error('Event name is required');
        }

        // Supabase backend
        if (this.supabase) {
            const ch = this._getChannel(channel);
            await ch.send({
                type: 'broadcast',
                event,
                payload: data
            });
            return { sent: true, channel, event };
        }

        // Local fallback (same-page only)
        this._localBroadcast(channel, event, data);
        return { sent: true, channel, event, mode: 'local' };
    }

    /**
     * SUBSCRIBE - Listen to channel events
     */
    async subscribe({ channel = 'default', callback }) {
        if (!callback || typeof callback !== 'function') {
            throw new Error('Callback function is required');
        }

        // Supabase backend
        if (this.supabase) {
            const ch = this._getChannel(channel);
            
            ch.on('broadcast', { event: '*' }, (payload) => {
                callback({
                    event: payload.event,
                    data: payload.payload,
                    timestamp: Date.now()
                });
            });

            await ch.subscribe();
            
            // Store callback for unsubscribe
            if (!this.callbacks.has(channel)) {
                this.callbacks.set(channel, []);
            }
            this.callbacks.get(channel).push(callback);

            return { subscribed: true, channel };
        }

        // Local fallback
        this._localSubscribe(channel, callback);
        return { subscribed: true, channel, mode: 'local' };
    }

    /**
     * PRESENCE - Track who's online
     */
    async presence({ channel = 'default', userId, metadata = {} }) {
        if (!this.supabase) {
            console.warn('⚠️ Presence requires Supabase configuration');
            return { online: 0, users: [] };
        }

        const ch = this._getChannel(channel);
        
        // Track presence
        await ch.track({
            user_id: userId || `user_${Math.random().toString(36).substr(2, 9)}`,
            online_at: new Date().toISOString(),
            ...metadata
        });

        // Get current presence
        const state = ch.presenceState();
        const users = Object.values(state).flat();

        return {
            online: users.length,
            users: users.map(u => ({
                userId: u.user_id,
                onlineAt: u.online_at,
                ...u
            }))
        };
    }

    /**
     * UNSUBSCRIBE - Stop listening to channel
     */
    async unsubscribe({ channel = 'default' }) {
        if (this.supabase && this.channels.has(channel)) {
            const ch = this.channels.get(channel);
            await ch.unsubscribe();
            this.channels.delete(channel);
        }

        this.callbacks.delete(channel);
        return { unsubscribed: true, channel };
    }

    // === PRIVATE METHODS ===

    /**
     * Get or create Supabase channel
     * @private
     */
    _getChannel(name) {
        if (!this.channels.has(name)) {
            const channel = this.supabase.channel(name);
            this.channels.set(name, channel);
        }
        return this.channels.get(name);
    }

    /**
     * Local broadcast (same-page only, fallback)
     * @private
     */
    _localBroadcast(channel, event, data) {
        const callbacks = this.callbacks.get(channel) || [];
        callbacks.forEach(cb => {
            try {
                cb({ event, data, timestamp: Date.now() });
            } catch (err) {
                console.error('Callback error:', err);
            }
        });
    }

    /**
     * Local subscribe (same-page only, fallback)
     * @private
     */
    _localSubscribe(channel, callback) {
        if (!this.callbacks.has(channel)) {
            this.callbacks.set(channel, []);
        }
        this.callbacks.get(channel).push(callback);
    }

    /**
     * Cleanup all channels
     */
    async destroy() {
        for (const [name, channel] of this.channels) {
            await channel.unsubscribe();
        }
        this.channels.clear();
        this.callbacks.clear();
        console.log('🔄 Sync channels closed');
    }
}