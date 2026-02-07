'use client';

import { TimelineEvent } from '@/lib/api';
import {
    Leaf,
    Factory,
    ClipboardCheck,
    Package,
    Truck,
    Store,
    CheckCircle,
    MapPin,
    Clock
} from 'lucide-react';

interface Props {
    timeline: TimelineEvent[];
    currentStatus: string;
}

const statusConfig: Record<string, { icon: typeof Leaf; color: string; bg: string }> = {
    'Created': { icon: Leaf, color: 'text-green-600', bg: 'bg-green-100' },
    'Harvested': { icon: Leaf, color: 'text-green-600', bg: 'bg-green-100' },
    'Processing': { icon: Factory, color: 'text-blue-600', bg: 'bg-blue-100' },
    'Quality Check': { icon: ClipboardCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    'Packaged': { icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
    'In Transit': { icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    'In Distribution': { icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    'Delivered': { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    'Completed': { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-200' },
};

export function SupplyChainTimeline({ timeline, currentStatus }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Supply Chain Journey</h3>

            <div className="space-y-6">
                {timeline.map((event, index) => {
                    const config = statusConfig[event.event] || statusConfig['Created'];
                    const Icon = config.icon;
                    const isLast = index === timeline.length - 1;

                    return (
                        <div key={index} className="relative flex gap-4">
                            {/* Line connector */}
                            {!isLast && (
                                <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200" />
                            )}

                            {/* Icon */}
                            <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{event.event}</h4>
                                        {event.type === 'quality_check' && (
                                            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full mt-1">
                                                Quality Inspection
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDate(event.timestamp)}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mt-2">{event.description}</p>

                                {event.location && (
                                    <div className="flex items-center text-xs text-gray-500 mt-2">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {event.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
