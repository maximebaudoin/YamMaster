import axios from "axios";
import config from "../../config";

export default class User {
  static async Login(username, password) {
    try {
      console.log("username log : " + username);
      console.log("password log: " + password);

      const response = await axios.post(
        `${config.apiUrl}/login`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);

      if (error.response) {
        // Le serveur a répondu avec un code d'erreur (par exemple, 400, 500)
        console.error("Erreur de réponse du serveur:", error.response.status);
        return error.response.data; // Renvoyer les détails de l'erreur du serveur
      } else if (error.request) {
        // La requête a été effectuée, mais aucune réponse n'a été reçue
        console.error("Aucune réponse du serveur reçue");
        return { error: "Aucune réponse du serveur reçue" };
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error(
          "Erreur lors de la configuration de la requête:",
          error.message
        );
        return { error: "Erreur lors de la configuration de la requête" };
      }
    }
  }

  static async SignUp(username, password) {
    try {
      const response = await axios.post(`${config.apiUrl}/signup`, {
        username: username,
        password: password,
      });
      return response.data;
    } catch (error) {
      // Vérifier s'il y a une erreur de réponse du serveur
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur (par exemple, 400, 500)
        console.log("Erreur de réponse du serveur:", error.response.status);
        return error.response.data; // Renvoyer les détails de l'erreur du serveur
      } else if (error.request) {
        // La requête a été effectuée, mais aucune réponse n'a été reçue
        console.log("Aucune réponse du serveur reçue");
        return { error: "Aucune réponse du serveur reçue" };
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.log(
          "Erreur lors de la configuration de la requête:",
          error.message
        );
        return { error: "Erreur lors de la configuration de la requête" };
      }
    }
  }
}
