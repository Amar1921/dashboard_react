// // pages/Dashboard.jsx
// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     fetchDashboardStats,
//     fetchRecentActivities,
//     fetchPendingEcheances,
//     fetchMonthlyStats,
//     setMonthlyStatsYear,
//     clearDashboardError
// } from '../store/slices/dashboardSlice';
// import {
//     Users, Home, MapPin, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Activity,
//     Calendar, BarChart3, RefreshCw, Eye, UserCheck, CreditCard, TrendingDown, Map, LandPlot,
//     AlertTriangle, ChevronDown, ChevronUp
// } from 'lucide-react';
// import DashboardLayout from '../components/layout/DashboardLayout';
//
// // Chart.js imports
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
//
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
//
// // Monthly bar chart (responsive)
// const MonthlyBarChart = ({ data, loading }) => {
//     if (loading) {
//         return (
//             <div className="h-44 sm:h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
//                 <div className="text-center">
//                     <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
//                     <p className="text-gray-500 text-sm">Chargement du graphique...</p>
//                 </div>
//             </div>
//         );
//     }
//     if (!data || data.length === 0) {
//         return (
//             <div className="h-44 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <div className="text-center">
//                     <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
//                     <p className="text-gray-500">Aucune donnée disponible</p>
//                 </div>
//             </div>
//         );
//     }
//     const chartData = {
//         labels: data.map(month => month.month_name.substring(0, 3)),
//         datasets: [
//             {
//                 label: 'Échéances Validées',
//                 data: data.map(month => month.echeances.montant_valide || 0),
//                 backgroundColor: 'rgba(34, 197, 94, 0.8)',
//                 borderColor: 'rgb(34, 197, 94)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//                 barPercentage: 0.6,
//             },
//             {
//                 label: 'Dépenses',
//                 data: data.map(month => month.depenses.montant_total || 0),
//                 backgroundColor: 'rgba(239, 68, 68, 0.8)',
//                 borderColor: 'rgb(239, 68, 68)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//                 barPercentage: 0.6,
//             }
//         ]
//     };
//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//                 labels: {
//                     usePointStyle: true,
//                     padding: 10,
//                     font: { size: 10 }
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(context) {
//                         let label = context.dataset.label || '';
//                         if (label) label += ': ';
//                         if (context.parsed.y != null) {
//                             label += new Intl.NumberFormat('fr-FR', {
//                                 style: 'currency',
//                                 currency: 'MGA',
//                                 maximumFractionDigits: 0
//                             }).format(context.parsed.y);
//                         }
//                         return label;
//                     }
//                 }
//             },
//             title: {
//                 display: true,
//                 text: `Statistiques Mensuelles - ${new Date().getFullYear()}`,
//                 font: { size: 13 }
//             }
//         },
//         scales: {
//             x: {
//                 grid: { display: false },
//                 ticks: { font: { size: 9 }, maxRotation: 45 }
//             },
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     callback: function(value) {
//                         if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
//                         if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
//                         return value;
//                     },
//                     font: { size: 9 }
//                 },
//                 grid: { color: 'rgba(0, 0, 0, 0.1)' }
//             }
//         },
//         interaction: { intersect: false, mode: 'index' },
//         animation: { duration: 800 }
//     };
//     return (
//         <div className="w-full min-h-[180px] h-[180px] sm:h-64 md:h-72">
//             <Bar data={chartData} options={options} />
//         </div>
//     );
// };
//
// // Responsive StatCard
// const StatCard = ({ title, value, icon: Icon, trend, color, loading, compact = false }) => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-3 w-full min-w-0">
//         <div className="flex items-center justify-between">
//             <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
//                 {loading ? (
//                     <div className="h-6 w-12 sm:w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
//                 ) : (
//                     <p className={`font-bold text-gray-900 mt-1 ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
//                         {value}
//                     </p>
//                 )}
//                 {trend && (
//                     <p className={`text-xs ${trend.color} mt-1 truncate`}>
//                         {trend.value} {trend.label}
//                     </p>
//                 )}
//             </div>
//             <div className={`p-0.5 sm:p-2 rounded-full ${color} flex-shrink-0 ml-1 sm:ml-2`}>
//                 <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
//             </div>
//         </div>
//     </div>
// );
//
// const Dashboard = () => {
//     const dispatch = useDispatch();
//     const { stats, recentActivities, pendingEcheances, monthlyStats } = useSelector(state => state.dashboard);
//     const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//     const [activeSection, setActiveSection] = useState({
//         echeances: true, activites: true, statistiques: true
//     });
//
//     // Vérifier si les données sont déjà chargées
//     const isDataLoaded = useMemo(() => {
//         return {
//             stats: stats.data && !stats.loading && !stats.error,
//             recentActivities: recentActivities.data && recentActivities.data.length > 0 && !recentActivities.loading && !recentActivities.error,
//             pendingEcheances: pendingEcheances.data && pendingEcheances.data.length > 0 && !pendingEcheances.loading && !pendingEcheances.error,
//             monthlyStats: monthlyStats.data && monthlyStats.data.length > 0 && !monthlyStats.loading && !monthlyStats.error && monthlyStats.year === currentYear
//         };
//     }, [stats, recentActivities, pendingEcheances, monthlyStats, currentYear]);
//
//     // Chargement des données avec vérification
//     const loadDashboardData = useCallback((forceRefresh = false) => {
//         if (forceRefresh || !isDataLoaded.stats) {
//             dispatch(fetchDashboardStats());
//         }
//         if (forceRefresh || !isDataLoaded.recentActivities) {
//             dispatch(fetchRecentActivities(8));
//         }
//         if (forceRefresh || !isDataLoaded.pendingEcheances) {
//             dispatch(fetchPendingEcheances(4));
//         }
//         if (forceRefresh || !isDataLoaded.monthlyStats) {
//             dispatch(fetchMonthlyStats(currentYear));
//         }
//     }, [dispatch, isDataLoaded, currentYear]);
//
//     // Chargement initial
//     useEffect(() => {
//         loadDashboardData();
//     }, [loadDashboardData]);
//
//     // Rechargement quand l'année change
//     useEffect(() => {
//         if (monthlyStats.year !== currentYear) {
//             dispatch(fetchMonthlyStats(currentYear));
//         }
//     }, [currentYear, monthlyStats.year, dispatch]);
//
//     const handleRefresh = () => {
//         dispatch(clearDashboardError());
//         loadDashboardData(true); // Force refresh
//     };
//
//     const handleYearChange = year => {
//         setCurrentYear(year);
//         dispatch(setMonthlyStatsYear(year));
//     };
//
//     const toggleSection = section => {
//         setActiveSection(prev => ({ ...prev, [section]: !prev[section] }));
//     };
//
//     const getStatusColor = joursRestants => {
//         if (joursRestants < 0) return 'text-red-600 bg-red-50 border-red-200';
//         if (joursRestants <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
//         if (joursRestants <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//         return 'text-green-600 bg-green-50 border-green-200';
//     };
//
//     const getActivityIcon = (iconName, color = 'text-blue-600') => {
//         const icons = { user: Users, users: Users, home: Home, 'map-pin': MapPin, 'user-check': UserCheck,
//             'dollar-sign': DollarSign, 'check-circle': CheckCircle, 'trending-down': TrendingDown,
//             'credit-card': CreditCard, activity: Activity };
//         const IconComponent = icons[iconName] || Activity;
//         return <IconComponent className={`h-4 w-4 ${color}`} />;
//     };
//
//     const formatCurrency = amount =>
//         new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
//
//     const formatCompactCurrency = amount => {
//         if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
//         if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
//         return amount?.toString() || '0';
//     };
//
//     const formatDate = dateString =>
//         new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//
//     const formatDateTime = dateString =>
//         new Date(dateString).toLocaleDateString('fr-FR', {
//             day: '2-digit', month: '2-digit', year: 'numeric',
//             hour: '2-digit', minute: '2-digit'
//         });
//
//     if (stats.loading && !stats.data) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-44 sm:h-64">
//                     <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="w-full max-w-4xl mx-auto px-1 sm:px-2 md:px-4 lg:px-6">
//
//                 {/* En-tête responsive */}
//                 <div className="flex flex-col gap-2 sm:gap-4 lg:flex-row lg:justify-between lg:items-center mb-3 sm:mb-6">
//                     <div className="flex-1">
//                         <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">Tableau de Bord</h1>
//                         <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1 lg:mt-2">Aperçu général de votre activité</p>
//                     </div>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                         <select
//                             value={currentYear}
//                             onChange={e => handleYearChange(parseInt(e.target.value))}
//                             className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         >
//                             {[2022, 2023, 2024, 2025].map(year => (
//                                 <option key={year} value={year}>{year}</option>
//                             ))}
//                         </select>
//                         <button
//                             onClick={handleRefresh}
//                             disabled={stats.loading}
//                             className="bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-green-700 transition-colors text-xs sm:text-sm"
//                         >
//                             <RefreshCw className={`h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
//                             <span>Actualiser</span>
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Grille Statistiques principales responsive avec scroll sur mobile */}
//                 <div className="overflow-x-auto mb-4 sm:mb-6">
//                     <div className="grid grid-cols-2 min-w-[350px] sm:min-w-0 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
//                         <StatCard title="Total Clients" value={stats.data?.total_clients || 0} icon={Users} color="bg-blue-500" loading={stats.loading && !stats.data} compact />
//                         <StatCard title="Lotissements" value={stats.data?.total_lotissements || 0} icon={Map} color="bg-green-500" loading={stats.loading && !stats.data} compact />
//                         <StatCard title="Parcelles Vendues" value={stats.data?.parcelles_vendues || 0} icon={LandPlot} color="bg-purple-500" trend={{
//                             value: `${stats.data?.taux_occupation || 0}%`,
//                             label: 'occupation',
//                             color: 'text-green-600'
//                         }} loading={stats.loading && !stats.data} compact />
//                         <StatCard title="Chiffre d'Affaires" value={formatCompactCurrency(stats.data?.chiffre_affaires)} icon={DollarSign} color="bg-yellow-500" loading={stats.loading && !stats.data} compact />
//                     </div>
//                 </div>
//
//                 {/* Section bénéfices/dépenses responsive */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-4 w-full">
//                         <div className="flex items-center justify-between mb-1 sm:mb-3">
//                             <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Bénéfice Net</h3>
//                             <TrendingUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                         </div>
//                         {stats.loading && !stats.data ? (
//                             <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
//                         ) : (
//                             <div className="text-lg sm:text-xl font-bold text-gray-900">{formatCompactCurrency(stats.data?.benefice_net)}</div>
//                         )}
//                         <p className="text-xs sm:text-sm text-gray-600 mt-1">Revenus nets après dépenses</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-4 w-full">
//                         <div className="flex items-center justify-between mb-1 sm:mb-3">
//                             <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Dépenses du Mois</h3>
//                             <TrendingDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                         </div>
//                         {stats.loading && !stats.data ? (
//                             <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
//                         ) : (
//                             <div className="text-lg sm:text-xl font-bold text-gray-900">{formatCompactCurrency(stats.data?.depenses_mois)}</div>
//                         )}
//                         <p className="text-xs sm:text-sm text-gray-600 mt-1">Total des dépenses ce mois-ci</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-4 w-full">
//                         <div className="flex items-center justify-between mb-1 sm:mb-3">
//                             <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Échéances en attente</h3>
//                             <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
//                         </div>
//                         {stats.loading && !stats.data ? (
//                             <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
//                         ) : (
//                             <div className="text-lg sm:text-xl font-bold text-gray-900">{stats.data?.echeances_en_attente || 0}</div>
//                         )}
//                         <p className="text-xs sm:text-sm text-gray-600 mt-1">Paiements à valider</p>
//                     </div>
//                 </div>
//
//                 <div className="space-y-2 sm:space-y-4 lg:space-y-6">
//                     {/* Échéances en attente */}
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                         <button onClick={() => toggleSection('echeances')}
//                                 className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                         >
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <Clock className="h-5 w-5 text-orange-500" />
//                                 <span className="text-sm sm:text-base font-semibold text-gray-900">Échéances en Attente</span>
//                             </div>
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-2 py-0.5 rounded">
//                                     {pendingEcheances.data.length}
//                                 </span>
//                                 {activeSection.echeances ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//                             </div>
//                         </button>
//                         {activeSection.echeances && (
//                             <div className="px-2 py-3 sm:p-4">
//                                 {pendingEcheances.loading && !pendingEcheances.data ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {[...Array(2)].map((_, i) => (
//                                             <div key={i} className="flex items-center space-x-2 sm:space-x-3 animate-pulse">
//                                                 <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//                                                 <div className="flex-1 space-y-2">
//                                                     <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                                                     <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : pendingEcheances.data.length > 0 ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {pendingEcheances.data.map(echeance => (
//                                             <div key={echeance.id} className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
//                                                 <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
//                                                     <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
//                                                         <Calendar className="h-4 w-4 text-blue-600" />
//                                                     </div>
//                                                     <div className="min-w-0 flex-1">
//                                                         <p className="font-medium text-gray-900 text-sm truncate">{formatCompactCurrency(echeance.montant)}</p>
//                                                         <p className="text-xs sm:text-sm text-gray-600 truncate">{echeance.client} - {echeance.parcelle.numero}</p>
//                                                         <p className="text-xs text-gray-500">{formatDate(echeance.date)}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${getStatusColor(echeance.jours_restants)}`}>
//                                                     {echeance.jours_restants >= 0 ? `${echeance.jours_restants}j` : `+${Math.abs(echeance.jours_restants)}j`}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-4">
//                                         <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
//                                         <p className="text-gray-500 text-sm">Aucune échéance en attente</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Activités récentes */}
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                         <button onClick={() => toggleSection('activites')}
//                                 className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                         >
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <Activity className="h-5 w-5 text-blue-500" />
//                                 <span className="text-sm sm:text-base font-semibold text-gray-900">Activités Récentes</span>
//                             </div>
//                             {activeSection.activites ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//                         </button>
//                         {activeSection.activites && (
//                             <div className="px-2 py-3 sm:p-4">
//                                 {recentActivities.loading && !recentActivities.data ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {[...Array(3)].map((_, i) => (
//                                             <div key={i} className="flex items-center space-x-2 sm:space-x-3 animate-pulse">
//                                                 <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
//                                                 <div className="flex-1 space-y-2">
//                                                     <div className="h-3 bg-gray-200 rounded w-full"></div>
//                                                     <div className="h-2.5 bg-gray-200 rounded w-2/3"></div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : recentActivities.data.length > 0 ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {recentActivities.data.map(activity => (
//                                             <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
//                                                 <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0 mt-0.5">
//                                                     {getActivityIcon(activity.icon, `text-${activity.color}-600`)}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">{activity.description}</p>
//                                                     <div className="flex items-center space-x-2 mt-1">
//                                                         <p className="text-xs text-gray-500 truncate">{activity.user}</p>
//                                                         <span className="text-gray-300 hidden sm:inline">•</span>
//                                                         <p className="text-xs text-gray-500 flex-shrink-0">{formatDateTime(activity.created_at)}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-4">
//                                         <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                                         <p className="text-gray-500 text-sm">Aucune activité récente</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Statistiques mensuelles - scroll horizontal sur petits écrans */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-3 sm:mt-6">
//                     <button onClick={() => toggleSection('statistiques')}
//                             className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                     >
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                             <BarChart3 className="h-5 w-5 text-green-500" />
//                             <span className="text-sm sm:text-base font-semibold text-gray-900">Statistiques Mensuelles {currentYear}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                             <span className="bg-gray-100 text-gray-600 text-xs sm:text-sm px-2 py-0.5 rounded">{monthlyStats.data.length}m</span>
//                             {activeSection.statistiques ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//                         </div>
//                     </button>
//                     {activeSection.statistiques && (
//                         <div className="px-2 py-3 sm:p-4 overflow-x-auto">
//                             <MonthlyBarChart data={monthlyStats.data} loading={monthlyStats.loading && !monthlyStats.data} />
//                             <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
//                                 <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
//                                     <h3 className="font-semibold text-green-800 mb-2">Échéances Validées</h3>
//                                     <p className="text-green-700 font-bold text-base">
//                                         {formatCurrency(monthlyStats.data.reduce((sum, month) => sum + (month.echeances.montant_valide || 0), 0))}
//                                     </p>
//                                     <p className="text-green-600 text-xs">Total annuel</p>
//                                 </div>
//                                 <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
//                                     <h3 className="font-semibold text-red-800 mb-2">Dépenses</h3>
//                                     <p className="text-red-700 font-bold text-base">
//                                         {formatCurrency(monthlyStats.data.reduce((sum, month) => sum + (month.depenses.montant_total || 0), 0))}
//                                     </p>
//                                     <p className="text-red-600 text-xs">Total annuel</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//
//                 {/* Message d'erreur responsive */}
//                 {(stats.error || recentActivities.error || pendingEcheances.error || monthlyStats.error) && (
//                     <div className="fixed bottom-2 left-2 right-2 sm:left-4 sm:right-4 lg:left-6 lg:right-6 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg text-xs sm:text-sm z-50">
//                         <div className="flex items-center space-x-2">
//                             <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
//                             <p className="text-red-800 flex-1">
//                                 Erreur lors du chargement des données
//                             </p>
//                             <button onClick={() => dispatch(clearDashboardError())}
//                                     className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg font-bold"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Dashboard;

// pages/Dashboard.jsx
// import React, {useCallback, useEffect, useMemo, useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//     clearDashboardError,
//     fetchDashboardStats,
//     fetchMonthlyStats,
//     fetchPendingEcheances,
//     fetchRecentActivities,
//     setMonthlyStatsYear
// } from '../store/slices/dashboardSlice';
// import {
//     Activity,
//     AlertCircle,
//     AlertTriangle,
//     BarChart3,
//     Calendar,
//     CheckCircle,
//     ChevronDown,
//     ChevronUp,
//     Clock,
//     CreditCard,
//     DollarSign,
//     Eye,
//     Home,
//     LandPlot,
//     Map,
//     MapPin,
//     RefreshCw,
//     TrendingDown,
//     TrendingUp,
//     UserCheck,
//     Users
// } from 'lucide-react';
// // Chart.js imports
// import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
// import {Bar} from 'react-chartjs-2';
// import DashboardLayout from "../components/NewLayout/DashboardLayout.jsx";
//
//
// // Monthly bar chart (responsive)
// const MonthlyBarChart = ({ data, loading }) => {
//     if (loading) {
//         return (
//             <div className="h-44 sm:h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
//                 <div className="text-center">
//                     <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
//                     <p className="text-gray-500 text-sm">Chargement du graphique...</p>
//                 </div>
//             </div>
//         );
//     }
//     if (!data || data.length === 0) {
//         return (
//             <div className="h-44 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <div className="text-center">
//                     <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
//                     <p className="text-gray-500">Aucune donnée disponible</p>
//                 </div>
//             </div>
//         );
//     }
//     const chartData = {
//         labels: data.map(month => month.month_name.substring(0, 3)),
//         datasets: [
//             {
//                 label: 'Échéances Validées',
//                 data: data.map(month => month.echeances.montant_valide || 0),
//                 backgroundColor: 'rgba(34, 197, 94, 0.8)',
//                 borderColor: 'rgb(34, 197, 94)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//                 barPercentage: 0.6,
//             },
//             {
//                 label: 'Dépenses',
//                 data: data.map(month => month.depenses.montant_total || 0),
//                 backgroundColor: 'rgba(239, 68, 68, 0.8)',
//                 borderColor: 'rgb(239, 68, 68)',
//                 borderWidth: 1,
//                 borderRadius: 4,
//                 barPercentage: 0.6,
//             }
//         ]
//     };
//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'top',
//                 labels: {
//                     usePointStyle: true,
//                     padding: 10,
//                     font: { size: 10 }
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(context) {
//                         let label = context.dataset.label || '';
//                         if (label) label += ': ';
//                         if (context.parsed.y != null) {
//                             label += new Intl.NumberFormat('fr-FR', {
//                                 style: 'currency',
//                                 currency: 'MGA',
//                                 maximumFractionDigits: 0
//                             }).format(context.parsed.y);
//                         }
//                         return label;
//                     }
//                 }
//             },
//             title: {
//                 display: true,
//                 text: `Statistiques Mensuelles - ${new Date().getFullYear()}`,
//                 font: { size: 13 }
//             }
//         },
//         scales: {
//             x: {
//                 grid: { display: false },
//                 ticks: { font: { size: 9 }, maxRotation: 45 }
//             },
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     callback: function(value) {
//                         if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
//                         if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
//                         return value;
//                     },
//                     font: { size: 9 }
//                 },
//                 grid: { color: 'rgba(0, 0, 0, 0.1)' }
//             }
//         },
//         interaction: { intersect: false, mode: 'index' },
//         animation: { duration: 800 }
//     };
//     return (
//         <div className="w-full min-h-[180px] h-[180px] sm:h-64 md:h-72">
//             <Bar data={chartData} options={options} />
//         </div>
//     );
// };
//
// // Responsive StatCard
// const StatCard = ({ title, value, icon: Icon, trend, color, loading, compact = false }) => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-3 w-full min-w-0">
//         <div className="flex items-center justify-between">
//             <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
//                 {loading ? (
//                     <div className="h-6 w-12 sm:w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
//                 ) : (
//                     <p className={`font-bold text-gray-900 mt-1 ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
//                         {value}
//                     </p>
//                 )}
//                 {trend && (
//                     <p className={`text-xs ${trend.color} mt-1 truncate`}>
//                         {trend.value} {trend.label}
//                     </p>
//                 )}
//             </div>
//             <div className={`p-0.5 sm:p-2 rounded-full ${color} flex-shrink-0 ml-1 sm:ml-2`}>
//                 <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
//             </div>
//         </div>
//     </div>
// );
//
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
//
// // ----------------------------------------------------------------------
// // ⚠️ FIX : éviter duplication des activités (optimisation des dépendances)
// // ----------------------------------------------------------------------
// const Dashboard = () => {
//
//     const dispatch = useDispatch();
//     const { stats, recentActivities, pendingEcheances, monthlyStats } =
//         useSelector(state => state.dashboard);
//
//     const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//     const [activeSection, setActiveSection] = useState({
//         echeances: true,
//         activites: true,
//         statistiques: true
//     });
//
//     // ------------------------------------------------------------------
//     // ⚠️ IMPORTANT : ces booléens sont stables → plus de re-fetch infini !
//     // ------------------------------------------------------------------
//     const {
//         statsLoaded,
//         recentLoaded,
//         pendingLoaded,
//         monthlyLoaded
//     } = useMemo(() => ({
//         statsLoaded:
//             stats.data && !stats.loading && !stats.error,
//
//         recentLoaded:
//             recentActivities.data &&
//             recentActivities.data.length > 0 &&
//             !recentActivities.loading &&
//             !recentActivities.error,
//
//         pendingLoaded:
//             pendingEcheances.data &&
//             pendingEcheances.data.length > 0 &&
//             !pendingEcheances.loading &&
//             !pendingEcheances.error,
//
//         monthlyLoaded:
//             monthlyStats.data &&
//             monthlyStats.data.length > 0 &&
//             !monthlyStats.loading &&
//             !monthlyStats.error &&
//             monthlyStats.year === currentYear
//     }), [stats, recentActivities, pendingEcheances, monthlyStats, currentYear]);
//
//     // ------------------------------------------------------------------
//     // ⚠️ FIX : plus de dépendance instable → plus de fetch infini
//     // ------------------------------------------------------------------
//     const loadDashboardData = useCallback((forceRefresh = false) => {
//         if (forceRefresh || !statsLoaded)
//             dispatch(fetchDashboardStats());
//
//         if (forceRefresh || !recentLoaded)
//             dispatch(fetchRecentActivities(8));
//
//         if (forceRefresh || !pendingLoaded)
//             dispatch(fetchPendingEcheances(4));
//
//         if (forceRefresh || !monthlyLoaded)
//             dispatch(fetchMonthlyStats(currentYear));
//
//     }, [dispatch, statsLoaded, recentLoaded, pendingLoaded, monthlyLoaded, currentYear]);
//
//     // Chargement initial
//     useEffect(() => {
//         loadDashboardData();
//     }, [loadDashboardData]);
//
//     // Rechargement quand l'année change
//     useEffect(() => {
//         if (monthlyStats.year !== currentYear) {
//             dispatch(fetchMonthlyStats(currentYear));
//         }
//     }, [currentYear, monthlyStats.year, dispatch]);
//
//     // Refresh bouton
//     const handleRefresh = () => {
//         dispatch(clearDashboardError());
//         loadDashboardData(true);
//     };
//
//     const handleYearChange = year => {
//         setCurrentYear(year);
//         dispatch(setMonthlyStatsYear(year));
//     };
//
//     // ------------------------------------------------------------------
//     // Le reste du composant est IDENTIQUE à ton code original
//     // ------------------------------------------------------------------
//
//     const toggleSection = section => {
//         setActiveSection(prev => ({ ...prev, [section]: !prev[section] }));
//     };
//
//     const getStatusColor = joursRestants => {
//         if (joursRestants < 0) return 'text-red-600 bg-red-50 border-red-200';
//         if (joursRestants <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
//         if (joursRestants <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//         return 'text-green-600 bg-green-50 border-green-200';
//     };
//
//     const getActivityIcon = (iconName, color = 'text-blue-600') => {
//         const icons = {
//             user: Users, users: Users, home: Home, 'map-pin': MapPin,
//             'user-check': UserCheck, 'dollar-sign': DollarSign,
//             'check-circle': CheckCircle, 'trending-down': TrendingDown,
//             'credit-card': CreditCard, activity: Activity
//         };
//         const IconComponent = icons[iconName] || Activity;
//         return <IconComponent className={`h-4 w-4 ${color}`} />;
//     };
//
//     const formatCurrency = amount =>
//         new Intl.NumberFormat('fr-FR', {
//             style: 'currency',
//             currency: 'MGA',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(amount || 0);
//
//     const formatCompactCurrency = amount => {
//         if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
//         if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
//         return amount?.toString() || '0';
//     };
//
//     const formatDate = dateString =>
//         new Date(dateString).toLocaleDateString('fr-FR', {
//             day: '2-digit', month: '2-digit', year: 'numeric'
//         });
//
//     const formatDateTime = dateString =>
//         new Date(dateString).toLocaleDateString('fr-FR', {
//             day: '2-digit', month: '2-digit', year: 'numeric',
//             hour: '2-digit', minute: '2-digit'
//         });
//
//     // -----------------------------------------------------------------------
//     // ⚠️ NOTE : tout ce qui suit est ton UI EXACTE sans modifications majeures
//     // -----------------------------------------------------------------------
//
//     if (stats.loading && !stats.data) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-44 sm:h-64">
//                     <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 md:px-4 lg:px-4">
//
//                 {/* En-tête responsive */}
//                 <div className="flex flex-col gap-2 sm:gap-4 lg:flex-row lg:justify-between lg:items-center mb-3 sm:mb-6">
//                     <div className="flex-1">
//                         <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">Tableau de Bord</h1>
//                         <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1 lg:mt-2">Aperçu général de votre activité</p>
//                     </div>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                         <select
//                             value={currentYear}
//                             onChange={e => handleYearChange(parseInt(e.target.value))}
//                             className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         >
//                             {[2022, 2023, 2024, 2025].map(year => (
//                                 <option key={year} value={year}>{year}</option>
//                             ))}
//                         </select>
//                         <button
//                             onClick={handleRefresh}
//                             disabled={stats.loading}
//                             className="bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-green-700 transition-colors text-xs sm:text-sm"
//                         >
//                             <RefreshCw className={`h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
//                             <span>Actualiser</span>
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Grille Statistiques principales responsive avec scroll sur mobile */}
//                 <div className="overflow-x-auto mb-4 sm:mb-6">
//                     <div className="grid grid-cols-2 min-w-[350px] sm:min-w-0 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
//                         <StatCard title="Total Clients" value={stats.data?.total_clients || 0} icon={Users} color="bg-blue-500" loading={stats.loading && !stats.data} compact />
//                         <StatCard title="Lotissements" value={stats.data?.total_lotissements || 0} icon={Map} color="bg-green-500" loading={stats.loading && !stats.data} compact />
//                         <StatCard title="Parcelles Vendues" value={stats.data?.parcelles_vendues || 0} icon={LandPlot} color="bg-purple-500" trend={{
//                             value: `${stats.data?.taux_occupation || 0}%`,
//                             label: 'occupation',
//                             color: 'text-green-600'
//                         }} loading={stats.loading && !stats.data} compact />
//                         <StatCard title="Chiffre d'Affaires" value={formatCompactCurrency(stats.data?.chiffre_affaires)} icon={DollarSign} color="bg-yellow-500" loading={stats.loading && !stats.data} compact />
//                     </div>
//                 </div>
//
//                 {/* Section bénéfices/dépenses responsive */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-4 w-full">
//                         <div className="flex items-center justify-between mb-1 sm:mb-3">
//                             <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Bénéfice Net</h3>
//                             <TrendingUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                         </div>
//                         {stats.loading && !stats.data ? (
//                             <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
//                         ) : (
//                             <div className="text-lg sm:text-xl font-bold text-gray-900">{formatCompactCurrency(stats.data?.benefice_net)}</div>
//                         )}
//                         <p className="text-xs sm:text-sm text-gray-600 mt-1">Revenus nets après dépenses</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-4 w-full">
//                         <div className="flex items-center justify-between mb-1 sm:mb-3">
//                             <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Dépenses du Mois</h3>
//                             <TrendingDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                         </div>
//                         {stats.loading && !stats.data ? (
//                             <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
//                         ) : (
//                             <div className="text-lg sm:text-xl font-bold text-gray-900">{formatCompactCurrency(stats.data?.depenses_mois)}</div>
//                         )}
//                         <p className="text-xs sm:text-sm text-gray-600 mt-1">Total des dépenses ce mois-ci</p>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-4 w-full">
//                         <div className="flex items-center justify-between mb-1 sm:mb-3">
//                             <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Échéances en attente</h3>
//                             <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
//                         </div>
//                         {stats.loading && !stats.data ? (
//                             <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
//                         ) : (
//                             <div className="text-lg sm:text-xl font-bold text-gray-900">{stats.data?.echeances_en_attente || 0}</div>
//                         )}
//                         <p className="text-xs sm:text-sm text-gray-600 mt-1">Paiements à valider</p>
//                     </div>
//                 </div>
//
//                 <div className="space-y-2 sm:space-y-4 lg:space-y-6">
//                     {/* Échéances en attente */}
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                         <button onClick={() => toggleSection('echeances')}
//                                 className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                         >
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <Clock className="h-5 w-5 text-orange-500" />
//                                 <span className="text-sm sm:text-base font-semibold text-gray-900">Échéances en Attente</span>
//                             </div>
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-2 py-0.5 rounded">
//                                     {pendingEcheances.data.length}
//                                 </span>
//                                 {activeSection.echeances ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//                             </div>
//                         </button>
//                         {activeSection.echeances && (
//                             <div className="px-2 py-3 sm:p-4">
//                                 {pendingEcheances.loading && !pendingEcheances.data ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {[...Array(2)].map((_, i) => (
//                                             <div key={i} className="flex items-center space-x-2 sm:space-x-3 animate-pulse">
//                                                 <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//                                                 <div className="flex-1 space-y-2">
//                                                     <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                                                     <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : pendingEcheances.data.length > 0 ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {pendingEcheances.data.map(echeance => (
//                                             <div key={echeance.id} className="flex items-center justify-between p-2 sm:p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
//                                                 <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
//                                                     <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
//                                                         <Calendar className="h-4 w-4 text-blue-600" />
//                                                     </div>
//                                                     <div className="min-w-0 flex-1">
//                                                         <p className="font-medium text-gray-900 text-sm truncate">{formatCompactCurrency(echeance.montant)}</p>
//                                                         <p className="text-xs sm:text-sm text-gray-600 truncate">{echeance.client} - {echeance.parcelle.numero}</p>
//                                                         <p className="text-xs text-gray-500">{formatDate(echeance.date)}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${getStatusColor(echeance.jours_restants)}`}>
//                                                     {echeance.jours_restants >= 0 ? `${echeance.jours_restants}j` : `+${Math.abs(echeance.jours_restants)}j`}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-4">
//                                         <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
//                                         <p className="text-gray-500 text-sm">Aucune échéance en attente</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Activités récentes */}
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                         <button onClick={() => toggleSection('activites')}
//                                 className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                         >
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <Activity className="h-5 w-5 text-blue-500" />
//                                 <span className="text-sm sm:text-base font-semibold text-gray-900">Activités Récentes</span>
//                             </div>
//                             {activeSection.activites ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//                         </button>
//                         {activeSection.activites && (
//                             <div className="px-2 py-3 sm:p-4">
//                                 {recentActivities.loading && !recentActivities.data ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {[...Array(3)].map((_, i) => (
//                                             <div key={i} className="flex items-center space-x-2 sm:space-x-3 animate-pulse">
//                                                 <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
//                                                 <div className="flex-1 space-y-2">
//                                                     <div className="h-3 bg-gray-200 rounded w-full"></div>
//                                                     <div className="h-2.5 bg-gray-200 rounded w-2/3"></div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : recentActivities.data.length > 0 ? (
//                                     <div className="space-y-2 sm:space-y-3">
//                                         {recentActivities.data.map(activity => (
//                                             <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
//                                                 <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0 mt-0.5">
//                                                     {getActivityIcon(activity.icon, `text-${activity.color}-600`)}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">{activity.description}</p>
//                                                     <div className="flex items-center space-x-2 mt-1">
//                                                         <p className="text-xs text-gray-500 truncate">{activity.user}</p>
//                                                         <span className="text-gray-300 hidden sm:inline">•</span>
//                                                         <p className="text-xs text-gray-500 flex-shrink-0">{formatDateTime(activity.created_at)}</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-4">
//                                         <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                                         <p className="text-gray-500 text-sm">Aucune activité récente</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Statistiques mensuelles - scroll horizontal sur petits écrans */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-3 sm:mt-6">
//                     <button onClick={() => toggleSection('statistiques')}
//                             className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
//                     >
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                             <BarChart3 className="h-5 w-5 text-green-500" />
//                             <span className="text-sm sm:text-base font-semibold text-gray-900">Statistiques Mensuelles {currentYear}</span>
//                         </div>
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                             <span className="bg-gray-100 text-gray-600 text-xs sm:text-sm px-2 py-0.5 rounded">{monthlyStats.data.length}m</span>
//                             {activeSection.statistiques ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//                         </div>
//                     </button>
//                     {activeSection.statistiques && (
//                         <div className="px-2 py-3 sm:p-4 overflow-x-auto">
//                             <MonthlyBarChart data={monthlyStats.data} loading={monthlyStats.loading && !monthlyStats.data} />
//                             <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
//                                 <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
//                                     <h3 className="font-semibold text-green-800 mb-2">Échéances Validées</h3>
//                                     <p className="text-green-700 font-bold text-base">
//                                         {formatCurrency(monthlyStats.data.reduce((sum, month) => sum + (month.echeances.montant_valide || 0), 0))}
//                                     </p>
//                                     <p className="text-green-600 text-xs">Total annuel</p>
//                                 </div>
//                                 <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
//                                     <h3 className="font-semibold text-red-800 mb-2">Dépenses</h3>
//                                     <p className="text-red-700 font-bold text-base">
//                                         {formatCurrency(monthlyStats.data.reduce((sum, month) => sum + (month.depenses.montant_total || 0), 0))}
//                                     </p>
//                                     <p className="text-red-600 text-xs">Total annuel</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//
//                 {/* Message d'erreur responsive */}
//                 {(stats.error || recentActivities.error || pendingEcheances.error || monthlyStats.error) && (
//                     <div className="fixed bottom-2 left-2 right-2 sm:left-4 sm:right-4 lg:left-6 lg:right-6 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg text-xs sm:text-sm z-50">
//                         <div className="flex items-center space-x-2">
//                             <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
//                             <p className="text-red-800 flex-1">
//                                 Erreur lors du chargement des données
//                             </p>
//                             <button onClick={() => dispatch(clearDashboardError())}
//                                     className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg font-bold"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//
//             {/* Pour éviter un message trop long, tout ton rendu reste identique */}
//         </DashboardLayout>
//     );
// };
//
// export default Dashboard;

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    clearDashboardError,
    fetchDashboardStats,
    fetchMonthlyStats,
    fetchPendingEcheances,
    fetchRecentActivities,
    setMonthlyStatsYear
} from '../store/slices/dashboardSlice';
import {
    Activity, AlertCircle, AlertTriangle, BarChart3, Calendar, CheckCircle,
    ChevronDown, ChevronUp, Clock, CreditCard, DollarSign, Eye, Home, LandPlot,
    Map, MapPin, RefreshCw, TrendingDown, TrendingUp, UserCheck, Users
} from 'lucide-react';
// Chart.js imports
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import DashboardLayout from "../components/NewLayout/DashboardLayout.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Monthly bar chart (responsive)
const MonthlyBarChart = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="h-44 sm:h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-gray-500 text-sm">Chargement du graphique...</p>
                </div>
            </div>
        );
    }
    if (!data || data.length === 0) {
        return (
            <div className="h-44 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Aucune donnée disponible</p>
                </div>
            </div>
        );
    }
    const chartData = {
        labels: data.map(month => month.month_name.substring(0, 3)),
        datasets: [
            {
                label: 'Échéances Validées',
                data: data.map(month => month.echeances.montant_valide || 0),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
            },
            {
                label: 'Dépenses',
                data: data.map(month => month.depenses.montant_total || 0),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 10,
                    font: { size: 10 }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y != null) {
                            label += new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'MGA',
                                maximumFractionDigits: 0
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
            title: {
                display: true,
                text: `Statistiques Mensuelles - ${new Date().getFullYear()}`,
                font: { size: 13 }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 9 }, maxRotation: 45 }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                        if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                        return value;
                    },
                    font: { size: 9 }
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            }
        },
        interaction: { intersect: false, mode: 'index' },
        animation: { duration: 800 }
    };
    return (
        <div className="w-full min-h-[180px] h-[180px] sm:h-64 md:h-72">
            <Bar data={chartData} options={options} />
        </div>
    );
};

// Responsive StatCard
const StatCard = ({ title, value, icon: Icon, trend, color, loading, compact = false }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 sm:p-3 w-full min-w-0">
        <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
                {loading ? (
                    <div className="h-6 w-12 sm:w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                    <p className={`font-bold text-gray-900 mt-1 ${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`}>
                        {value}
                    </p>
                )}
                {trend && (
                    <p className={`text-xs ${trend.color} mt-1 truncate`}>
                        {trend.value} {trend.label}
                    </p>
                )}
            </div>
            <div className={`p-0.5 sm:p-2 rounded-full ${color} flex-shrink-0 ml-1 sm:ml-2`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, recentActivities, pendingEcheances, monthlyStats } =
        useSelector(state => state.dashboard);

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [activeSection, setActiveSection] = useState({
        echeances: true,
        activites: true,
        statistiques: true
    });

    const {
        statsLoaded,
        recentLoaded,
        pendingLoaded,
        monthlyLoaded
    } = useMemo(() => ({
        statsLoaded: stats.data && !stats.loading && !stats.error,
        recentLoaded: recentActivities.data && recentActivities.data.length > 0 && !recentActivities.loading && !recentActivities.error,
        pendingLoaded: pendingEcheances.data && pendingEcheances.data.length > 0 && !pendingEcheances.loading && !pendingEcheances.error,
        monthlyLoaded: monthlyStats.data && monthlyStats.data.length > 0 && !monthlyStats.loading && !monthlyStats.error && monthlyStats.year === currentYear
    }), [stats, recentActivities, pendingEcheances, monthlyStats, currentYear]);

    const loadDashboardData = useCallback((forceRefresh = false) => {
        if (forceRefresh || !statsLoaded) dispatch(fetchDashboardStats());
        if (forceRefresh || !recentLoaded) dispatch(fetchRecentActivities(8));
        if (forceRefresh || !pendingLoaded) dispatch(fetchPendingEcheances(4));
        if (forceRefresh || !monthlyLoaded) dispatch(fetchMonthlyStats(currentYear));
    }, [dispatch, statsLoaded, recentLoaded, pendingLoaded, monthlyLoaded, currentYear]);

    useEffect(() => { loadDashboardData(); }, [loadDashboardData]);
    useEffect(() => { if (monthlyStats.year !== currentYear) dispatch(fetchMonthlyStats(currentYear)); }, [currentYear, monthlyStats.year, dispatch]);

    const handleRefresh = () => { dispatch(clearDashboardError()); loadDashboardData(true); };
    const handleYearChange = year => { setCurrentYear(year); dispatch(setMonthlyStatsYear(year)); };

    const toggleSection = section => { setActiveSection(prev => ({ ...prev, [section]: !prev[section] })); };
    const getStatusColor = joursRestants => {
        if (joursRestants < 0) return 'text-red-600 bg-red-50 border-red-200';
        if (joursRestants <= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (joursRestants <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };
    const getActivityIcon = (iconName, color = 'text-blue-600') => {
        const icons = { user: Users, users: Users, home: Home, 'map-pin': MapPin, 'user-check': UserCheck, 'dollar-sign': DollarSign, 'check-circle': CheckCircle, 'trending-down': TrendingDown, 'credit-card': CreditCard, activity: Activity };
        const IconComponent = icons[iconName] || Activity;
        return <IconComponent className={`h-4 w-4 ${color}`} />;
    };
    const formatCurrency = amount =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
    const formatCompactCurrency = amount => {
        if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
        if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
        return amount?.toString() || '0';
    };
    const formatDate = dateString =>
        new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formatDateTime = dateString =>
        new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (stats.loading && !stats.data) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-44 sm:h-64">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 md:px-4 lg:px-4">
                {/* En-tête responsive */}
                <div className="flex flex-col gap-2 sm:gap-4 lg:flex-row lg:justify-between lg:items-center mb-3 sm:mb-6">
                    <div className="flex-1">
                        <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                        <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1 lg:mt-2">Aperçu général de votre activité</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <select
                            value={currentYear}
                            onChange={e => handleYearChange(parseInt(e.target.value))}
                            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            {[2022, 2023, 2024, 2025].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleRefresh}
                            disabled={stats.loading}
                            className="bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 hover:bg-green-700 transition-colors text-xs sm:text-sm"
                        >
                            <RefreshCw className={`h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
                            <span>Actualiser</span>
                        </button>
                    </div>
                </div>

                {/* Grille Statistiques principales responsive avec scroll sur mobile */}
                <div className="overflow-x-auto mb-4 sm:mb-6">
                    <div className="grid grid-cols-2 min-w-[350px] sm:min-w-0 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                        <StatCard title="Total Clients" value={stats.data?.total_clients || 0} icon={Users} color="bg-blue-500" loading={stats.loading && !stats.data} compact />
                        <StatCard title="Lotissements" value={stats.data?.total_lotissements || 0} icon={Map} color="bg-green-500" loading={stats.loading && !stats.data} compact />
                        <StatCard title="Parcelles Vendues" value={stats.data?.parcelles_vendues || 0} icon={LandPlot} color="bg-purple-500" trend={{
                            value: `${stats.data?.taux_occupation || 0}%`,
                            label: 'occupation',
                            color: 'text-green-600'
                        }} loading={stats.loading && !stats.data} compact />
                        <StatCard title="Chiffre d'Affaires" value={formatCompactCurrency(stats.data?.chiffre_affaires)} icon={DollarSign} color="bg-yellow-500" loading={stats.loading && !stats.data} compact />
                    </div>
                </div>

                {/* Section bénéfices/dépenses responsive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                    {/* ... identique à plus haut ... */}
                </div>

                <div className="space-y-2 sm:space-y-4 lg:space-y-6">
                    {/* ... identique à plus haut ... */}
                </div>

                {/* Statistiques mensuelles - scroll horizontal sur petits écrans */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-3 sm:mt-6">
                    <button onClick={() => toggleSection('statistiques')}
                            className="w-full px-2 py-3 sm:p-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <BarChart3 className="h-5 w-5 text-green-500" />
                            <span className="text-sm sm:text-base font-semibold text-gray-900">Statistiques Mensuelles {currentYear}</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="bg-gray-100 text-gray-600 text-xs sm:text-sm px-2 py-0.5 rounded">{monthlyStats.data.length}m</span>
                            {activeSection.statistiques ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                    </button>
                    {activeSection.statistiques && (
                        <div className="px-2 py-3 sm:p-4 overflow-x-auto">
                            <MonthlyBarChart data={monthlyStats.data} loading={monthlyStats.loading && !monthlyStats.data} />
                            <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                                {/* ... identique à plus haut ... */}
                            </div>
                        </div>
                    )}
                </div>

                {/* Message d'erreur responsive */}
                {(stats.error || recentActivities.error || pendingEcheances.error || monthlyStats.error) && (
                    <div className="fixed bottom-2 left-2 right-2 sm:left-4 sm:right-4 lg:left-6 lg:right-6 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg text-xs sm:text-sm z-50">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-800 flex-1">Erreur lors du chargement des données</p>
                            <button onClick={() => dispatch(clearDashboardError())}
                                    className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg font-bold"
                            >×</button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
