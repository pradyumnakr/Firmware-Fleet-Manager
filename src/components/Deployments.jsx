import { useState, useEffect } from 'react';
import api from '../api';
import { Rocket, Box, Radio, Check, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Deployments() {
    const [firmwares, setFirmwares] = useState([]);
    const [targetGroup, setTargetGroup] = useState('canary');
    const [selectedFirmware, setSelectedFirmware] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        api.get('/firmwares').then(res => {
            setFirmwares(res.data);
            if (res.data.length > 0) setSelectedFirmware(res.data[0].id);
        }).catch(console.error);
    }, []);

    const handleDeploy = async () => {
        setStatus('deploying');
        if (!selectedFirmware) return;

        try {
            await api.post('/deploy', {
                firmware_id: selectedFirmware,
                target_group: targetGroup
            });

            setTimeout(() => {
                setStatus('success');
                setTimeout(() => setStatus(null), 3000);
            }, 1500);

        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white tracking-tight">Deployment Console</h2>
                <p className="text-gray-500 mt-2">Orchestrate firmware rollouts across fleet segments.</p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-1 overflow-hidden relative shadow-2xl">
                {/* Progress line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    {status === 'deploying' && <motion.div layoutId="progress" className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} />}
                </div>

                <div className="p-8 space-y-10">
                    {/* Step 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-indigo-400 font-mono text-xs uppercase tracking-widest">
                            <span className="w-6 h-6 rounded-full border border-indigo-500/50 flex items-center justify-center">01</span>
                            <span>Select Build</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {firmwares.slice(0, 3).map(fw => (
                                <div
                                    key={fw.id}
                                    onClick={() => setSelectedFirmware(fw.id)}
                                    className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedFirmware == fw.id
                                            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                            : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <Box className={`w-5 h-5 ${selectedFirmware == fw.id ? 'text-indigo-400' : 'text-gray-600'}`} />
                                        {selectedFirmware == fw.id && <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                    </div>
                                    <div className="mt-3">
                                        <div className="text-sm font-medium text-white font-mono">{fw.version_string}</div>
                                        <div className="text-xs text-gray-500 mt-1 truncate">{fw.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-purple-400 font-mono text-xs uppercase tracking-widest">
                            <span className="w-6 h-6 rounded-full border border-purple-500/50 flex items-center justify-center">02</span>
                            <span>Target Segment</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {['canary', 'stable'].map(group => (
                                <button
                                    key={group}
                                    onClick={() => setTargetGroup(group)}
                                    className={`flex-1 p-4 rounded-xl border flex items-center space-x-4 transition-all ${targetGroup === group
                                            ? 'bg-purple-500/10 border-purple-500/50'
                                            : 'bg-black/20 border-white/5 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${targetGroup === group ? 'border-purple-500' : 'border-gray-600'}`}>
                                        {targetGroup === group && <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-white capitalize">{group} Fleet</div>
                                        <div className="text-xs text-gray-500">{group === 'canary' ? 'High tolerance for instability.' : 'Production validation required.'}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-black/20 text-right">
                    <button
                        onClick={handleDeploy}
                        disabled={!selectedFirmware || status === 'deploying'}
                        className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${status === 'success' ? 'bg-emerald-500 text-white' :
                                status === 'deploying' ? 'bg-gray-800 text-gray-400' :
                                    'bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95'
                            }`}
                    >
                        {status === 'deploying' ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing</>
                        ) : status === 'success' ? (
                            <><Check className="w-5 h-5 mr-2" /> Deployed</>
                        ) : (
                            <><Play className="w-4 h-4 mr-2 fill-current" /> Initialize Sequence</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
