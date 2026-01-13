import { useState, useEffect } from 'react';
import api from '../api';
import { Activity, Server, UploadCloud, ArrowUpRight, Cpu, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [stats, setStats] = useState({ total_devices: 0, online_devices: 0, active_deployments: 0 });

    useEffect(() => {
        api.get('/stats').then(res => setStats(res.data)).catch(console.error);
    }, []);

    const Card = ({ title, value, subtext, trend }) => (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-gray-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-xl hover:bg-gray-900/60 transition-all duration-300 group"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{title}</h3>
                {trend && <span className="flex items-center text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">+{trend}% <ArrowUpRight className="w-3 h-3 ml-1" /></span>}
            </div>
            <div className="text-3xl font-semibold text-white tracking-tight font-sans">{value}</div>
            {subtext && <div className="mt-2 text-xs text-gray-500">{subtext}</div>}
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">System Overview</h2>
                <p className="text-gray-500 text-sm mt-1">Real-time telemetry from fleet clusters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    title="Total Devices"
                    value={stats.total_devices}
                    subtext="Across 3 regions"
                    trend="12"
                />
                <Card
                    title="Online Connectivity"
                    value={stats.online_devices}
                    subtext={`${((stats.online_devices / (stats.total_devices || 1)) * 100).toFixed(1)}% availability`}
                    trend="4.2"
                />
                <Card
                    title="Active Rollouts"
                    value={stats.active_deployments}
                    subtext="Targeting Canary groups"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-64">
                <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-6 relative overflow-hidden">
                    <h3 className="text-sm font-medium text-gray-400 mb-6">Network Traffic</h3>
                    {/* Mock Chart Visualization */}
                    <div className="flex items-end space-x-2 h-32 w-full px-2">
                        {[40, 65, 55, 80, 70, 90, 85, 95, 75, 60, 50, 65, 85, 70, 90].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t-sm transition-colors relative group"
                            >
                                <div className="absolute top-0 w-full h-0.5 bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Cluster Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><Server className="w-4 h-4 text-emerald-400" /></div>
                                <div className="text-sm text-gray-300">US-East</div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><Server className="w-4 h-4 text-emerald-400" /></div>
                                <div className="text-sm text-gray-300">EU-West</div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg"><Wifi className="w-4 h-4 text-amber-400" /></div>
                                <div className="text-sm text-gray-300">Asia-Pac</div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
