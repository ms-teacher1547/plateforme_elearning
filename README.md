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
- Ouvrez une issue pour discuter de votre proposition avant de commencer.
- Forkez le dépôt et créez une branche descriptive (ex: `feat/ajout-auth`).
- Ajoutez des tests pour toute nouvelle fonctionnalité ou correction de bug.
- Respectez le style PEP8 ; vous pouvez formater avec `black` et vérifier les types avec `mypy` si présents.
- Faites vos commits clairs et atomiques, puis ouvrez une Pull Request vers la branche `main`. Décrivez les changements et liez l'issue associée.

## Licence
- À définir — si vous souhaitez une licence par défaut, je peux ajouter une licence MIT ou une autre licence appropriée.

## Contact
- Auteur : `ms-teacher1547`
- Pour toute question : ouvrez une issue ou contactez le propriétaire du dépôt.

---

Merci de contribuer !
