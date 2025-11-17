// import {createSlice} from '@reduxjs/toolkit';
//
// const initialState = {
//     sidebarOpen: window.innerWidth >= 768, // Ouvert par défaut sur desktop
//     loadingGlobal: false,
//     isModalManageCategoryOpen: false,
// };
//
// const uiSlice = createSlice({
//     name: 'ui',
//     initialState,
//     reducers: {
//         toggleSidebar: (state) => {
//             state.sidebarOpen = !state.sidebarOpen;
//         },
//         setSidebarOpen: (state, action) => {
//             state.sidebarOpen = action.payload;
//         },
//
//         setLoadingGlobal: (state, action) => {
//             state.loadingGlobal = action.payload;
//         },
//         setIsModalOpen: (state, action) => {
//             state.isModalManageCategoryOpen = action.payload;
//         }
//     },
// });
// export const { toggleSidebar,setIsModalOpen,setSidebarOpen, setLoadingGlobal } = uiSlice.actions;
// export const uiSliceReducer = uiSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

// Vérifier si on est sur mobile
const isMobile = window.innerWidth < 768;

const initialState = {
    sidebarOpen: !isMobile, // Fermé par défaut sur mobile, ouvert sur desktop
    sidebarMinimized: false, // Nouvel état pour le mode réduit
    loadingGlobal: false,
    isModalManageCategoryOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
            // Si on ouvre le sidebar, on s'assure qu'il n'est pas minimisé
            if (state.sidebarOpen) {
                state.sidebarMinimized = false;
            }
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
            // Si on ferme le sidebar, on désactive aussi le mode réduit
            if (!action.payload) {
                state.sidebarMinimized = false;
            }
        },
        toggleSidebarMinimized: (state) => {
            // On ne peut minimiser que si le sidebar est ouvert
            if (state.sidebarOpen) {
                state.sidebarMinimized = !state.sidebarMinimized;
            }
        },
        setSidebarMinimized: (state, action) => {
            // On ne peut minimiser que si le sidebar est ouvert
            if (state.sidebarOpen) {
                state.sidebarMinimized = action.payload;
            }
        },
        setLoadingGlobal: (state, action) => {
            state.loadingGlobal = action.payload;
        },
        setIsModalOpen: (state, action) => {
            state.isModalManageCategoryOpen = action.payload;
        },
        // Reducer pour fermer automatiquement le sidebar sur mobile
        closeSidebarOnMobile: (state) => {
            if (window.innerWidth < 768) {
                state.sidebarOpen = false;
                state.sidebarMinimized = false;
            }
        }
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarMinimized,
    setSidebarMinimized,
    setLoadingGlobal,
    setIsModalOpen,
    closeSidebarOnMobile
} = uiSlice.actions;

export  default uiSlice.reducer;