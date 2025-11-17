import {toast} from "react-toastify";


// Fonction pour calculer la date de Pâques (algorithme de Meeus/Jones/Butcher)

export function copyTextAndHighlight(tdElement, id = null, time = 18000) {
    const rawText = tdElement.textContent || "";

    const textToCopy = rawText
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .replace(/\n/g, "\r\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
        toast("Copied to clipboard!");

        // Ajouter effet visuel avec Tailwind classes
        tdElement.classList.remove("text-white")
        tdElement.classList.add(
            "bg-blue-900", // fond
            "scale-105",     // léger zoom
            "shadow-md",     // ombre
            "transition",
            "duration-300",
            "rounded",
            "text-dark"
        );

        // Retirer l'effet après 1,5s
        setTimeout(() => {
            tdElement.classList.add("text-white")
            tdElement.classList.remove("bg-blue-900", "scale-105", "shadow-md");
        }, 3000);
    }).catch((err) => {
        console.error('Échec de la copie dans le presse-papiers', err);
        toast.error("Erreur lors de la copie dans le presse-papiers");
    });
}


// export function copyTextAndHighlight(tdElement, id = null, time = 18000) {
//     // Nettoyer le texte pour éviter plusieurs sauts de ligne consécutifs
//     const rawText = tdElement.textContent;
//     const textToCopy = rawText
//         .replace(/\n+/g, "\n")         // Réduit plusieurs \n à un seul
//         .replace(/\n/g, "\r\n");       // Compatibilité multi-OS
//
//     navigator.clipboard.writeText(textToCopy).then(() => {
//         // Sauvegarde des styles originaux
//
//         // Mise en surbrillance prolongée si ID four
//         toast("Copied to clipboard!")
//
//     }).catch((err) => {
//         console.error('Échec de la copie dans le presse-papiers', err);
//         toast.error("Erreur lors de la copie dans le presse-papiers")
//     });
// }

let errorToastDisplayed = false;

export function filterDescription(descriptions, text) {
    const result = descriptions.filter((description) =>
        description.description.toLowerCase().includes(text.toLowerCase())
    );

    if (result.length === 0) {
        if (!errorToastDisplayed) {
            toast.error("Nessun template trovato ");
            errorToastDisplayed = true;
            // Réinitialise après quelques secondes pour permettre un futur affichage
            setTimeout(() => {
                errorToastDisplayed = false;
            }, 3000); // tu peux ajuster ce délai
        }
    } else {
        // Réinitialise si des résultats sont trouvés
        errorToastDisplayed = false;
    }

    return result;
}

// export function filterDescription(descriptions, text) {
//     const result = descriptions.filter((description) =>
//         description.description.toLowerCase().includes(text.toLowerCase())
//     );
//
//     if (result.length === 0) {
//         toast.error("Aucun résultat ne correspond à votre recherche.");
//     }
//
//     return result;
// }


// export 	function filterDescription(descriptions,text) {
//     return descriptions.filter((description) => {
//         return description.description.toLowerCase().includes(text.toLowerCase());
//     });
// }

export function copyIp(element) {

    const textToCopy = element.innerText;
    if (textToCopy === "N/A") {
        return

    }
    navigator.clipboard.writeText(textToCopy).then(() => {
        // console.log('Text copied to clipboard');
        element.style.backgroundColor = "#32f355";
        setTimeout(()=>{
            element.style.backgroundColor = "";
            element.style.color = "";
            element.style.borderRadius = "";
            element.style.transition = "";
        },1000)
    }).catch((err) => {
        console.error('Error copying text: ', err);
    });

}

export const parseJwt = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1]; // Récupère la partie payload du token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Token invalide", error);
        return null;
    }
};

export function isJwtValid(token) {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000); // en secondes
        return payload.exp && payload.exp > currentTime;
    } catch (error) {
        console.error("Invalid JWT:", error);
        return false;
    }
}

export function runToast(message, type = "success") {

    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    })
}

export function copyById(id){
    const element = document.getElementById(id);
    navigator.clipboard.writeText(element.innerText)
        .then(()=>{
            if (element) element.classList.add("bg-green-100");
            toast.success("Copied successfully", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
            setTimeout(()=>{
                if (element) element.classList.remove("bg-green-100");
            }, 1000);
        });
}

