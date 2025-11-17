# Base Front - Application React avec Système d'Authentification

Une base d'application React moderne avec système d'authentification complet, state management avec Redux Toolkit, et styling avec Tailwind CSS.

## 🚀 Fonctionnalités

- **⚛️ React 19** - Dernière version de React avec les hooks modernes
- **🎯 Redux Toolkit** - State management avec RTK Query intégré
- **🔐 Système d'Authentification** - Gestion complète des tokens JWT
- **🛣️ React Router v7** - Navigation avec routes protégées
- **🎨 Tailwind CSS v4** - Styling utilitaire moderne
- **📱 Responsive Design** - Interface adaptative
- **💾 Persistance Redux** - Sauvegarde automatique du state
- **🔒 Routes Protégées** - Accès conditionnel basé sur les rôles
- **🔄 Gestion d'État Avancée** - Avec Redux Persist

## 🛠️ Technologies Utilisées

- **React 19.2.0** - Bibliothèque UI
- **Redux Toolkit 2.10.1** - State management
- **React Router 7.9.6** - Routing
- **Tailwind CSS 4.1.17** - CSS framework
- **Axios 1.13.2** - Client HTTP
- **JWT Decode 4.0.0** - Décodage des tokens
- **Redux Persist 6.0.0** - Persistance du state
- **Lucide React 0.553.0** - Icônes
- **Lodash 4.17.21** - Utilitaires JavaScript

## 📦 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants d'interface de base
│   └── layout/         # Composants de layout
├── features/           # Fonctionnalités par domaine
│   ├── auth/          # Système d'authentification
│   └── user/          # Gestion des utilisateurs
├── pages/              # Pages de l'application
├── store/              # Configuration Redux
├── hooks/              # Hooks personnalisés
├── utils/              # Utilitaires
└── services/           # Services API
```

## 🔐 Système d'Authentification

L'application gère l'authentification via JWT avec la structure de réponse suivante :

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "firstname": "John",
  "lastname": "Doe",
  "roles": [
    "ROLE_SUPER_ADMIN",
    "ROLE_ADMIN",
    "ROLE_USER"
  ],
  "email": "john.doe@example.com",
  "logCount": 34,
  "success": true
}
```

### Fonctionnalités d'Auth

- ✅ Login/Logout
- ✅ Persistance de session
- ✅ Gestion des tokens JWT
- ✅ Protection de routes par rôle
- ✅ Refresh token automatique
- ✅ Décodage des informations utilisateur

## 🎯 Rôles et Permissions

L'application supporte un système de rôles hiérarchique :

- `ROLE_SUPER_ADMIN` - Accès complet
- `ROLE_ADMIN` - Accès administrateur
- `ROLE_USER` - Utilisateur standard

## 🚀 Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone git@github.com:Amar1921/dashboard_react.git
   cd dashboard_react
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer en mode développement**
   ```bash
   npm run dev
   ```

4. **Builder pour la production**
   ```bash
   npm run build
   ```

5. **Linter le code**
   ```bash
   npm run lint
   ```

## 📋 Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build la version production
- `npm run lint` - Analyse le code avec ESLint
- `npm run preview` - Preview la build production

## 🎨 Configuration Tailwind CSS

Le projet utilise Tailwind CSS v4 avec la configuration par défaut. Les styles sont optimisés pour le développement rapide d'interfaces modernes.

## 🔧 Configuration Redux

Le store Redux est configuré avec :

- Redux Toolkit pour une configuration simplifiée
- Redux Persist pour la persistance du state
- Middlewares de développement

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les appareils grâce à Tailwind CSS.

## 🔒 Sécurité

- Tokens JWT sécurisés
- Protection contre les attaques XSS
- Gestion sécurisée des données utilisateur
- Validation des rôles côté client et serveur

## 🛠️ Développement

### Ajouter une nouvelle fonctionnalité

1. Créer un dossier dans `features/`
2. Ajouter les slices Redux si nécessaire
3. Créer les composants associés
4. Ajouter les routes si besoin

### Ajouter une nouvelle page

1. Créer un composant dans `pages/`
2. Ajouter la route dans le router principal
3. Implémenter la protection par rôle si nécessaire

## 📄 Licence

Ce projet est sous licence MIT.

## 👥 Auteur

Développé avec ❤️ pour servir de base à des applications React modernes.

---

**Prêt à coder ?** Lancez `npm run dev` et commencez à développer votre application !