import { useState, useEffect } from 'react';
import api from '../api';
import { UploadCloud, Check, GitCommit, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Firmware() {
    const [firmwares, setFirmwares] = useState([]);
    const [version, setVersion] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchFirmwares();
    }, []);

    const fetchFirmwares = () => {
        api.get('/firmwares').then(res => setFirmwares(res.data)).catch(console.error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!version) return;
        try {
            await api.post('/firmwares', {
                version_string: version,
                description: description,
                is_active: true
            });
            setVersion('');
            setDescription('');
            fetchFirmwares();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full">
            <div className="w-full md:w-1/3 space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white tracking-tight">Firmware</h2>
                    <p className="text-gray-500 text-sm mt-1">Upload and manage build artifacts.</p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-white mb-4">New Release</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Version Tag</label>
                            <div className="relative">
                                <GitCommit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                                    placeholder="v2.0.0"
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Changelog</label>
                            <textarea
                                rows="3"
                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                                placeholder="Describe changes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm flex justify-center items-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <UploadCloud className="w-4 h-4 mr-2" />
                            Publish Build
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-medium text-gray-400">Release History</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Stable</span>
                        <span className="w-2 h-2 rounded-full bg-gray-600 ml-2"></span>
                        <span>Deprecated</span>
                    </div>
                </div>

                <div className="space-y-3">
                    {firmwares.map((fw, i) => (
                        <motion.div
                            key={fw.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-900/20 border border-white/5 rounded-lg group hover:bg-white/[0.02] hover:border-white/10 transition-all"
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`p-2 rounded-lg ${fw.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                                    <GitCommit className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-white font-mono font-medium">{fw.version_string}</span>
                                        {fw.is_active && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 tracking-wide uppercase">Active</span>}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-0.5">{fw.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <Calendar className="w-3 h-3 mr-1.5" />
                                    {new Date(fw.release_date).toLocaleDateString()}
                                </div>
                                <button className="text-xs text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">View Artifacts</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
