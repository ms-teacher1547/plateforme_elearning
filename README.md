# plateforme_elearning

Petit projet Django fournissant un backend minimal pour une plateforme d'e-learning.

## Prérequis
- Python 3.10 ou supérieur
- virtualenv (optionnel)

## Installation rapide
1. Créez et activez un environnement virtuel :
   - PowerShell : `python -m venv env` puis `.\env\Scripts\Activate.ps1`
2. Installez les dépendances (si `requirements.txt` présent) :
   - `pip install -r requirements.txt`
3. Appliquez les migrations et lancez le serveur :
   - `python manage.py migrate`
   - `python manage.py runserver`

## Structure principale
- `backend/` : configuration Django (settings, urls, wsgi/asgi)
- `users/` : application pour la gestion des utilisateurs
- `profile_photos/` : stockage des photos de profil

## Contribuer
- Ouvrez une issue pour proposer des changements.
- Forkez le dépôt, créez une branche, puis faites une PR.

## Licence
- À définir (contactez l'auteur si nécessaire)

---

Auteur : `ms-teacher1547`
