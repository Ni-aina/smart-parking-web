"use client";

import {
    Crown,
    FileText,
    Receipt,
    Smartphone,
    Star,
    Truck,
    UserCheck,
    Wrench
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const LandingPage = () => {

    const handleDownload = () => {
        toast.info("Download coming soon!");
    }

    return (
        <div className="min-h-screen bg-black/95">
            <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10 gap-4">
                <div className="relative w-25 h-8 sm:w-40 sm:h-12">
                    <Image
                        src={"/images/smart-parking.png"}
                        alt="Smart parking"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        href="/auth/sign-in"
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href={"/auth/sign-up"}
                        className="bg-blue-950 text-white px-4 py-2 rounded-lg 
                        hover:opacity-90 transition-opacity"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <section className="text-center mb-20">
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                        Smart Parking
                        <span className="block text-blue-400">Made Simple</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Complete parking management system with vehicle tracking, subscription plans,
                        and multi-agent support. Owners manage via web dashboard while drivers and agents
                        use the mobile app for seamless parking operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl 
                            cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
                        >
                            <Smartphone size={24} />
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Download for</span>
                                <h1 className="text-lg font-bold">Android</h1>
                            </div>
                        </button>
                        <Link
                            href="/owner/dashboard"
                            className="bg-white text-black px-8 py-4 rounded-xl 
                            hover:opacity-80 transition-opacity shadow-lg"
                        >
                            Owner Dashboard
                        </Link>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <Truck className="text-blue-400 mb-4" size={32} />
                            <h3 className="text-xl font-semibold text-white mb-2">Vehicle Management</h3>
                            <p className="text-gray-300">Register and manage multiple vehicles with dimensions, plate numbers, and maintenance schedules.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <Crown className="text-yellow-400 mb-4" size={32} />
                            <h3 className="text-xl font-semibold text-white mb-2">Premium Subscriptions</h3>
                            <p className="text-gray-300">Paid subscription plans with advanced features for parking lot owners and operators.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <Wrench className="text-orange-400 mb-4" size={32} />
                            <h3 className="text-xl font-semibold text-white mb-2">Maintenance Tracking</h3>
                            <p className="text-gray-300">Schedule and track vehicle maintenance with automated reminders and service history.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <FileText className="text-purple-400 mb-4" size={32} />
                            <h3 className="text-xl font-semibold text-white mb-2">Digital Receipts</h3>
                            <p className="text-gray-300">Automatic receipt generation and transaction tracking for all parking payments.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <UserCheck className="text-cyan-400 mb-4" size={32} />
                            <h3 className="text-xl font-semibold text-white mb-2">Agent System</h3>
                            <p className="text-gray-300">Multi-level agent management with role-based permissions and hierarchical control.</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <Wrench className="text-red-400 mb-4" size={32} />
                            <h3 className="text-xl font-semibold text-white mb-2">Vehicle Types</h3>
                            <p className="text-gray-300">Custom vehicle type definitions with size restrictions and specialized parking requirements.</p>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="text-white" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Owner Dashboard</h3>
                            <p className="text-gray-300">Manage parking lots, agents, and subscriptions through the web admin panel.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="text-white" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Mobile App</h3>
                            <p className="text-gray-300">Drivers and agents access parking features on-the-go with our Android app.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt className="text-white" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Seamless Operations</h3>
                            <p className="text-gray-300">Real-time sync between web dashboard and mobile app for complete control.</p>
                        </div>
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Platform Architecture</h2>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Role-Based Access System</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Owners: Web dashboard for complete management</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Agents: Mobile app for on-site operations</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Drivers: Mobile app for parking reservations</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Subscription-based revenue models</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Vehicle type and dimension management</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Hierarchical agent system with permissions</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Complete transaction history and receipts</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Star className="text-yellow-400" size={20} />
                                        <span>Bank account integration for payouts</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <h4 className="text-xl font-semibold text-white mb-4">System Features</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-400">3</div>
                                        <div className="text-sm text-gray-300">User Roles</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-400">2</div>
                                        <div className="text-sm text-gray-300">Platforms</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-400">100%</div>
                                        <div className="text-sm text-gray-300">Stripe Integration</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-400">24/7</div>
                                        <div className="text-sm text-gray-300">Monitoring</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="text-center mb-20">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join parking owners who manage their business through our web dashboard while
                        drivers and agents use the mobile app for seamless operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleDownload}
                            className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl 
                            cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
                        >
                            <Smartphone size={24} />
                            <span>Download Android App</span>
                        </button>
                        <Link
                            href="/owner/dashboard"
                            className="bg-white text-black px-8 py-4 rounded-xl hover:opacity-80 transition-opacity shadow-lg"
                        >
                            Owner Access
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="relative w-32 h-10 mb-4">
                                <Image
                                    src={"/images/smart-parking.png"}
                                    alt="Smart parking"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <p className="text-gray-400 text-sm">
                                Making parking simple and efficient for everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>
                                    <Link href="/owner/dashboard" className="hover:text-white transition-colors">Owner Dashboard</Link>
                                </li>
                                <li>
                                    <Link href="#" >Mobile App</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">Subscription Plans</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2025 Smart Parking. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage;
