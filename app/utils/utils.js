export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
};

export function validatePassword(input) {
  // Cette expression régulière accepte les lettres majuscules, minuscules, les chiffres et les caractères spéciaux
  const regex = /^[a-zA-Z0-9\p{P}\p{S}]*$/u;

  // Teste si l'entrée correspond au motif défini dans l'expression régulière
  return regex.test(input);
}
