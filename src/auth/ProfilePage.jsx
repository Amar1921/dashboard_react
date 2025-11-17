// components/ProfilPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Mail,
  Shield,
  LogOut,
  Edit3,
  Save,
  X,
  Calendar,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';
import { logoutUser, setUserInfo } from '@/store/slices/authSlice';

const ProfilPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setEditForm({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Validation des mots de passe si modification
      if (editForm.newPassword) {
        if (editForm.newPassword !== editForm.confirmPassword) {
          alert('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }
        if (editForm.newPassword.length < 6) {
          alert('Le mot de passe doit contenir au moins 6 caractères');
          setIsLoading(false);
          return;
        }
      }

      // Simulation d'appel API - À ADAPTER avec votre backend
      const response = await fetch(`${import.meta.env.VITE_URL_BASE || 'http://localhost:8000'}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstname: editForm.firstname,
          lastname: editForm.lastname,
          email: editForm.email,
          currentPassword: editForm.currentPassword || undefined,
          newPassword: editForm.newPassword || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour le store Redux
        dispatch(setUserInfo({
          ...user,
          firstname: editForm.firstname,
          lastname: editForm.lastname,
          email: editForm.email
        }));

        // Mettre à jour le localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          firstname: editForm.firstname,
          lastname: editForm.lastname,
          email: editForm.email
        }));

        setIsEditing(false);
        alert('Profil mis à jour avec succès!');
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      dispatch(logoutUser());
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ROLE_ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ROLE_USER':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return 'Super Administrateur';
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'ROLE_USER':
        return 'Utilisateur';
      default:
        return role;
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstname} {user.lastname}
                  </h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                {!isEditing ? (
                    <button
                        onClick={handleEditToggle}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                ) : (
                    <>
                      <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                      <button
                          onClick={handleEditToggle}
                          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </button>
                    </>
                )}

                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche - Informations personnelles */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informations personnelles
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      {isEditing ? (
                          <input
                              type="text"
                              name="firstname"
                              value={editForm.firstname}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                      ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {user.firstname}
                          </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      {isEditing ? (
                          <input
                              type="text"
                              name="lastname"
                              value={editForm.lastname}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                      ) : (
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                            {user.lastname}
                          </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modification du mot de passe */}
              {isEditing && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Modifier le mot de passe
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <input
                              type={showPassword ? "text" : "password"}
                              name="currentPassword"
                              value={editForm.currentPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                          />
                          <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe
                          </label>
                          <input
                              type={showPassword ? "text" : "password"}
                              name="newPassword"
                              value={editForm.newPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le mot de passe
                          </label>
                          <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={editForm.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <p className="text-sm text-gray-500">
                        Laissez vide si vous ne souhaitez pas modifier le mot de passe
                      </p>
                    </div>
                  </div>
              )}
            </div>

            {/* Colonne droite - Statistiques et rôles */}
            <div className="space-y-6">
              {/* Rôles et permissions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-600" />
                  Rôles et permissions
                </h2>

                <div className="space-y-2">
                  {user.roles?.map((role, index) => (
                      <div
                          key={index}
                          className={`px-3 py-2 rounded-lg border ${getRoleBadgeColor(role)} text-sm font-medium`}
                      >
                        {getRoleDisplayName(role)}
                      </div>
                  ))}
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Statistiques
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nombre de connexions</span>
                    <span className="font-semibold text-gray-900 bg-blue-50 px-2 py-1 rounded">
                                        {user.logCount || 0}
                                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dernière connexion</span>
                    <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                        {new Date().toLocaleDateString('fr-FR')}
                                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Membre depuis</span>
                    <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                      {new Date().toLocaleDateString('fr-FR')}
                                    </span>
                  </div>
                </div>
              </div>

              {/* Statut du compte */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Statut du compte
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                        Actif
                                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Vérification email</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                        Vérifié
                                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Niveau de sécurité</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                        Élevé
                                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilPage;