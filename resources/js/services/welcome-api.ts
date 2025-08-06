/**
 * API service for welcome page data
 */

interface WelcomeStats {
    label: string;
    value: number;
    suffix?: string;
    icon: string;
    trend?: string;
    description?: string;
}

interface WelcomeStatsResponse {
    stats: WelcomeStats[];
    last_updated: string;
}

interface SystemHealthResponse {
    status: string;
    uptime: number;
    active_users: number;
    total_equipment: number;
    timestamp: string;
}

export class WelcomeApiService {
    private static baseUrl = '/api/welcome';

    /**
     * Fetch real-time statistics
     */
    static async getStats(): Promise<WelcomeStatsResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/stats`);
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching welcome stats:', error);
            throw error;
        }
    }

    /**
     * Fetch system health status
     */
    static async getHealth(): Promise<SystemHealthResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (!response.ok) {
                throw new Error('Failed to fetch system health');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching system health:', error);
            throw error;
        }
    }

    /**
     * Set up real-time updates for stats
     * @param callback Function to call when stats are updated
     * @param interval Update interval in milliseconds (default: 30 seconds)
     */
    static setupRealTimeUpdates(callback: (stats: WelcomeStats[]) => void, interval: number = 30000): () => void {
        const intervalId = setInterval(async () => {
            try {
                const response = await this.getStats();
                callback(response.stats);
            } catch (error) {
                console.error('Failed to update real-time stats:', error);
            }
        }, interval);

        // Return cleanup function
        return () => clearInterval(intervalId);
    }
}

export type { SystemHealthResponse, WelcomeStats, WelcomeStatsResponse };
