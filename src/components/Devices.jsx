import { useState, useEffect } from 'react';
import api from '../api';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Devices() {
    const [devices, setDevices] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = () => {
        api.get('/devices').then(res => setDevices(res.data)).catch(console.error);
    };

    const filteredDevices = devices.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.group_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-white tracking-tight">Fleet Inventory</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage physical devices and their configurations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID or Group..."
                            className="pl-10 pr-4 py-2 bg-gray-900/40 border border-white/5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 w-64 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-white/5 bg-gray-900/40 rounded-lg text-gray-400 hover:text-white hover:border-white/10 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="border border-white/5 rounded-xl overflow-hidden bg-gray-900/20 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                                <div className="flex items-center cursor-pointer hover:text-gray-300">ID <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" /></div>
                            </th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 tracking-wider">Device Name</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 tracking-wider">Group</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 tracking-wider">Version</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 tracking-wider">Status</th>
                            <th className="py-3 px-6 text-xs font-semibold uppercase text-gray-500 tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredDevices.map((device, i) => (
                            <motion.tr
                                key={device.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="py-4 px-6 text-sm text-gray-500 font-mono">#{device.id}</td>
                                <td className="py-4 px-6 text-sm text-white font-medium">{device.name}</td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${device.group_name === 'canary'
                                            ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                                            : 'bg-gray-800 text-gray-300 border-gray-700'
                                        }`}>
                                        {device.group_name}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-400 font-mono">{device.current_version || '—'}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${device.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-600'}`}></div>
                                        <span className={`text-sm ${device.status === 'online' ? 'text-gray-200' : 'text-gray-500'}`}>{device.status}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Manage
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
