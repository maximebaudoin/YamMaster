import AsyncStorage from '@react-native-async-storage/async-storage';

// Après une connexion réussie, stocke le nom d'utilisateur dans AsyncStorage
export async function handleSuccessfulLogin(username) {
    try {
        await AsyncStorage.setItem('username', username);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du nom d\'utilisateur :', error);
    }
}

// Vérifie si l'utilisateur est connecté lors du chargement de l'application
export async function checkLoggedIn() {
    try {
        const username = await AsyncStorage.getItem('username');
        return username !== null;
    } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
        return false;
    }
}

// Déconnecte l'utilisateur en supprimant le nom d'utilisateur de AsyncStorage
export async function logout() {
    try {
        await AsyncStorage.removeItem('username');
        // Effectuer toute autre action nécessaire, comme rediriger l'utilisateur vers l'écran de connexion
    } catch (error) {
        console.error('Erreur lors de la suppression du nom d\'utilisateur :', error);
    }
}
